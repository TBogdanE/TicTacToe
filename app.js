//Event Listeners and everything that can be controlled on the page
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
    gameBoard.getAiDifficulty(aiPlayerDifficulty.value);
  });

  //getting all the fields of the game
  fieldBtn.forEach((btn, index) => {
    //getting the coordonates in the 2D array
    const x = Math.floor(index / 3);
    const y = index % 3;
    btn.addEventListener("click", () => gameBoard.startGame(x, y, index));
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
  let gameBoardArray = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  //initialising variables
  let userSign = "X";
  let userTurn = true;
  let secondPlayer = "humanPlayer";
  let secondPlayerSign = "O";
  let aiDifficulty = "Easy";
  let winner = undefined;

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
  function startGame(posX, posY, posField) {
    //checks if the game is won, so players cannot make new moves
    if (winner !== undefined) {
      console.log("Game has already been won!");
      return;
    }
    //switching the turns and make secondPlayer move acording to player type
    if (userTurn) {
      makeMove(posX, posY, posField);
    } else if (!userTurn && secondPlayer === "humanPlayer") {
      makeMove(posX, posY, posField);
    } else if (!userTurn && secondPlayer === "aiPlayer") {
      aiPlayer(gameBoardArray, secondPlayer);
    }
  }

  // makes the user and human second player moves
  function makeMove(posX, posY, posField) {
    if (gameBoardArray[posX][posY] === "") {
      if (userTurn === true) {
        gameBoardArray[posX][posY] = userSign;
        boardUi.updateGameArray(posField, userSign);
        userTurn = false;
        checkWin(gameBoardArray, userSign);
      } else {
        gameBoardArray[posX][posY] = secondPlayerSign;
        boardUi.updateGameArray(posField, secondPlayerSign);
        userTurn = true;
        checkWin(gameBoardArray, secondPlayerSign);
      }
    } else {
      console.error("Error! You can\t take this spot");
    }
  }

  //setting the difficulty level of the aiPlayer
  function getAiDifficulty(difficulty) {
    aiDifficulty = difficulty;
    return aiDifficulty;
  }

  const currentArrayState = gameBoardArray
    .map((row) => [...row])
    .reduce((acc, row) => acc.concat(row), []);

  function emptyCell(currentArrayState) {
    return currentArrayState.filter((i) => i !== "X" && i !== "O");
  }

  function aiPlayer(currentBS, sign) {
    /*let availableFields = emptyIndex(newBoard);
    let moves = [];
    let move = {};
    move.index = newBoard[availableFields[i]];

    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    function emptyIndex(board) {
      return board.filter((s) => s != "O" && s != "X");
    }

    newBoard[availableFields[i]] = move.index;

    moves.push(move);

    if (checkWin(gameBoardArray, userSign)) {
      return { score: -10 };
    } else if (checkWin(gameBoardArray, secondPlayerSign)) {
      return { score: 10 };
    } else if (availableFields.length === 0) {
      return { score: 0 };
    }*/
  }
  // check for the win or tie
  function checkWin(board, sign) {
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

    //transforms the 2D array into a simple one
    const flattenedBoard = board.reduce((acc, row) => acc.concat(row), []);
    //check the current state with the winning combinations
    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (
        flattenedBoard[a] === sign &&
        flattenedBoard[b] === sign &&
        flattenedBoard[c] === sign
      ) {
        winner = sign;
        console.log(`Winner: ${winner}`);
        boardUi.overlayToggle(winner);
        return winner;
      }
    }

    //checks for tie
    if (isBoardFull(board) && !winner) {
      winner = "tie";
      boardUi.overlayToggle(winner);
      return winner;
    }
  }

  function isBoardFull(board) {
    for (let row of board) {
      if (row.includes("")) {
        return false;
      }
    }
    return true;
  }

  //resets the game and UI
  function resetGame() {
    gameBoardArray = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    userTurn = true;
    winner = undefined;
    boardUi.resetUI();
    boardUi.updateSignButtonUI(userSign); // Update user sign UI
    boardUi.updateSecondPlayerUI(secondPlayer); // Update second player UI
  }

  return {
    setUserSign,
    setSecondPlayerType,
    startGame,
    resetGame,
    getAiDifficulty,
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

/* TO DO:
- DONE - Game board;
- DONE - Get user sign;
- DONE - Select opponent;
- DONE - Update gameBoard;
- Minmax AI;
*/
