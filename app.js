const gameController = (() => {
  //initialising variables
  const userElementX = document.getElementById("w-x");
  const userElementO = document.getElementById("w-o");
  const humanPlayer = document.getElementById("opponent-player");
  const aiPlayer = document.getElementById("opponent-ai");
  const aiPlayerDifficulty = document.getElementById("difficulty");
  const fieldBtn = document.querySelectorAll(".field");
  const restartBtn = document.getElementById("restart-btn");
  const overlay = document.getElementById("overlay");

  //set user sign
  userElementX.addEventListener("click", () => gameBoard.setUserSign("X"));
  userElementO.addEventListener("click", () => gameBoard.setUserSign("O"));
  //choose second player type
  humanPlayer.addEventListener("click", () =>
    gameBoard.setSecondPlayerType("humanPlayer")
  );
  aiPlayer.addEventListener("click", () =>
    gameBoard.setSecondPlayerType("aiPlayer")
  );
  //set aiPlayer difficulty
  aiPlayerDifficulty.addEventListener("change", () => {
    gameBoard.resetGame();
    gameBoard.setAiDifficulty(aiPlayerDifficulty.value);
  });

  //getting all the fields of the game
  fieldBtn.forEach((btn, index) => {
    //getting the coordonates in the 2D array
    btn.addEventListener("click", () => gameBoard.startGame(index));
  });

  //initialising the restart btn
  restartBtn.addEventListener("click", () => gameBoard.resetGame());

  //when user presses ESC after overlay is shown, hide it back and resets the game
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      gameController.overlay.classList.contains("active")
    ) {
      boardUi.overlayToggle("");
      gameBoard.resetGame();
    } else {
      gameBoard.resetGame();
    }
  });

  return {
    userElementX,
    userElementO,
    humanPlayer,
    aiPlayer,
    fieldBtn,
    overlay,
  };
})();

//main logic of the game
const gameBoard = (() => {
  //initialising the array
  let gameBoardArray = ["", "", "", "", "", "", "", "", ""];

  //initialising variables
  let userSign = "X";
  let userTurn = true;
  let secondPlayer = "humanPlayer";
  let secondPlayerSign = "O";
  let aiDifficulty = "Easy";
  let winner = undefined;
  let depthLvl = 0;

  // set user and second player sign based on the user sign
  function setUserSign(selectedSign) {
    resetGame();
    userSign = selectedSign;
    secondPlayerSign = userSign === "X" ? "O" : "X";
    boardUi.updateSignButtonUI(userSign);
    return userSign;
  }

  // sets the second player type
  function setSecondPlayerType(player) {
    resetGame();
    secondPlayer = player;
    boardUi.updateSecondPlayerUI(secondPlayer);
  }

  //playing the game
  function startGame(posField) {
    //checks if the game is won, so players cannot make new moves
    if (winner !== undefined) {
      console.log("Game has already been won!");
      return;
    }
    //switching the turns and make secondPlayer move acording to player type
    if (userTurn) {
      makeMove(posField);
    } else if (!userTurn && secondPlayer === "humanPlayer") {
      makeMove(posField);
    }
  }

  // makes the user and human second player moves
  function makeMove(posField) {
    //checks if the field is empty
    if (gameBoardArray[posField] === "") {
      //executes users move
      if (userTurn) {
        gameBoardArray[posField] = userSign;
        boardUi.updateGameArray(posField, userSign);
        checkWin(gameBoardArray, userSign, false);
        userTurn = false;
        //checks if second player is AI, so it will be called after user makes move
        if (secondPlayer === "aiPlayer") {
          aiPlayer(aiDifficulty);
        }
      } else {
        //executes second player move
        gameBoardArray[posField] = secondPlayerSign;
        boardUi.updateGameArray(posField, secondPlayerSign);
        checkWin(gameBoardArray, secondPlayerSign, false);
        userTurn = true;
      }
    } else {
      //prints error if field is already used
      console.error("Error! You can't take this spot");
    }
  }

  //sets the difficulty for the aiPlayer
  function setAiDifficulty(difficulty) {
    aiDifficulty = difficulty;
  }

  //aiPlayer configuration
  function aiPlayer(aiDifficulty) {
    //creates a copy of actual gameboard array
    function currentBoardState(gameBoardArray) {
      return [...gameBoardArray];
    }
    //plays the aiPlayer based on selected difficulty
    if (aiDifficulty === "Easy") {
      const randomField = Math.floor(Math.random() * 9);
      if (gameBoardArray[randomField] === "") {
        makeMove(randomField);
      } else if (!isBoardFull(gameBoardArray)) {
        aiPlayer(aiDifficulty);
      } else {
        return;
      }
    } else if (aiDifficulty === "Medium") {
      depthLvl = 10;
      const bestMovePos = minimax(
        currentBoardState(gameBoardArray),
        secondPlayerSign,
        depthLvl
      );
      const bestMovePosIndex = bestMovePos.index;
      makeMove(bestMovePosIndex);
    } else if (aiDifficulty === "Hard") {
      depthLvl = 0;
      const bestMovePos = minimax(
        currentBoardState(gameBoardArray),
        secondPlayerSign,
        depthLvl
      );
      const bestMovePosIndex = bestMovePos.index;
      makeMove(bestMovePosIndex);
    }
  }

  //gets the indexes of all the empty cells of the board
  function getAllEmptyCellsIndexes(currBdSt) {
    //saves all the indexes here
    let emptyCellsIndexes = [];

    for (let i = 0; i < currBdSt.length; i++) {
      if (currBdSt[i] !== "X" && currBdSt[i] !== "O") {
        emptyCellsIndexes.push(i);
      }
    }
    return emptyCellsIndexes;
  }

  //minimax AI algorithm
  function minimax(currBdSt, currMark, depth) {
    //get the indexes of all the empty cells of the board
    const availCellsIndexes = getAllEmptyCellsIndexes(currBdSt);
    //searches for terminal state
    if (checkWin(currBdSt, userSign, true)) {
      return { score: -1 };
    } else if (checkWin(currBdSt, secondPlayerSign, true)) {
      return { score: 1 };
    } else if (availCellsIndexes.length === 0) {
      return { score: 0 };
    }
    //saves each test info
    const allTestPlayInfos = [];
    //loop through all the empty cells
    for (let i = 0; i < availCellsIndexes.length; i++) {
      //array to store all test plays info
      const currentTestPlayInfo = {};
      //inainte era currentTestPlayInfo.index = currBdSt[availCellsIndexes[i]];
      //saves the index of the cell that for loop is currently checking
      currentTestPlayInfo.index = availCellsIndexes[i];
      //places current player sign on the cell that for loop is currently checking
      currBdSt[availCellsIndexes[i]] = currMark;
      if (currMark === secondPlayerSign) {
        //recursively run minimax function for the new case
        const result = minimax(currBdSt, userSign, depth);
        //saves the result variable's score intro currentTestPlayInfo object
        currentTestPlayInfo.score = result.score - depth;
      } else {
        //recursively run minimax function for the new case
        const result = minimax(currBdSt, secondPlayerSign, depth);
        //saves the result variable's score intro currentTestPlayInfo object
        currentTestPlayInfo.score = result.score + depth;
      }
      // reset the current board back to the state it was before the current player made its move
      currBdSt[availCellsIndexes[i]] = currentTestPlayInfo.index;
      //save the result of the current player test-play for future use
      allTestPlayInfos.push(currentTestPlayInfo);
    }
    //variable used for storing best test-play reference
    let bestTestPlay = null;
    //get the reference to the current player best test-play
    if (currMark === secondPlayerSign) {
      let bestScore = -Infinity;
      for (let i = 0; i < allTestPlayInfos.length; i++) {
        if (allTestPlayInfos[i].score > bestScore) {
          bestScore = allTestPlayInfos[i].score;
          bestTestPlay = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < allTestPlayInfos.length; i++) {
        if (allTestPlayInfos[i].score < bestScore) {
          bestScore = allTestPlayInfos[i].score;
          bestTestPlay = i;
        }
      }
    }
    //get the obeject with the best test-play score for the ai player

    return allTestPlayInfos[bestTestPlay];
  }

  // check for the win or tie
  function checkWin(board, sign, aiCheck) {
    //a list with the winning combinations
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    //check the current state with the winning combinations
    if (aiCheck) {
      for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] === sign && board[b] === sign && board[c] === sign) {
          return true;
        }
      }
      return false;
    }

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (board[a] === sign && board[b] === sign && board[c] === sign) {
        winner = sign;
        console.log(`Winner: ${winner}`);
        boardUi.overlayToggle(winner);
        console.log(winner);
        return winner;
      } else if (isBoardFull(board) && !winner) {
        winner = "tie";
        boardUi.overlayToggle(winner);
        console.log(winner);
        return winner;
      }
    }
  }

  function isBoardFull(board) {
    for (let element of board) {
      if (element == "") {
        return false;
      }
    }
    return true;
  }

  //resets the game and UI
  function resetGame() {
    gameBoardArray = ["", "", "", "", "", "", "", "", ""];
    userTurn = true;
    winner = undefined;
    //aiDifficulty = 'Easy';
    boardUi.resetUI();
    boardUi.updateSignButtonUI(userSign); // Update user sign UI
    boardUi.updateSecondPlayerUI(secondPlayer); // Update second player UI
  }

  return {
    setUserSign,
    setSecondPlayerType,
    startGame,
    resetGame,
    setAiDifficulty,
  };
})();

//controlling the UI of the game
const boardUi = (() => {
  //showing the overlay after the game ends with a specific message
  function overlayToggle(winner) {
    if (overlay.classList.contains("active")) {
      overlay.classList.remove("active");
      overlay.innerText = "";
    } else {
      overlay.classList.add("active");
      if (winner === "X" || winner === "O") {
        overlay.innerText = `Winner is ${winner}`;
      } else if (winner === "tie") {
        overlay.innerHTML = `It\'s a tie`;
      }
    }
  }

  //update buttons style after changing signs
  function updateSignButtonUI(sign) {
    if (sign === "X") {
      gameController.userElementX.classList.add("active");
      gameController.userElementO.classList.remove("active");
    } else if (sign === "O") {
      gameController.userElementO.classList.add("active");
      gameController.userElementX.classList.remove("active");
    }
  }

  //update buttons style after changing second player type
  function updateSecondPlayerUI(secondPlayer) {
    if (secondPlayer === "humanPlayer") {
      gameController.humanPlayer.classList.add("active");
      gameController.aiPlayer.classList.remove("active");
    } else if (secondPlayer === "aiPlayer") {
      gameController.aiPlayer.classList.add("active");
      gameController.humanPlayer.classList.remove("active");
    }
  }

  //update the fields of the game
  function updateGameArray(posField, sign) {
    const targetBtn = gameController.fieldBtn[posField];
    targetBtn.innerHTML = sign;
  }

  //resets the UI
  function resetUI() {
    gameController.fieldBtn.forEach((btn) => {
      btn.innerHTML = "";
      console.log();
    });
  }

  return {
    updateSignButtonUI,
    updateSecondPlayerUI,
    updateGameArray,
    overlayToggle,
    resetUI,
  };
})();
