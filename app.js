const gameController = (() => {
  const userElementX = document.getElementById("w-x");
  const userElementO = document.getElementById("w-o");
  const humanPlayer = document.getElementById("opponent-player");
  const aiPlayer = document.getElementById("opponent-ai");
  const aiPlayerDifficulty = document.getElementById('difficulty');
  const fieldBtn = document.querySelectorAll(".field");
  const restartBtn = document.getElementById("restart-btn");
  const overlay = document.getElementById("overlay");

  userElementX.addEventListener("click", () => gameBoard.setUserSign("X"));
  userElementO.addEventListener("click", () => gameBoard.setUserSign("O"));
  humanPlayer.addEventListener("click", () =>
    gameBoard.setSecondPlayerType("humanPlayer")
  );
  aiPlayer.addEventListener("click", () =>
    gameBoard.setSecondPlayerType("aiPlayer")
  );

  aiPlayerDifficulty.addEventListener('change', () => {
    gameBoard.aiDifficulty = aiPlayerDifficulty.value;
    gameBoard.resetGame();
  });

  fieldBtn.forEach((btn, index) => {
    const x = Math.floor(index / 3);
    const y = index % 3;
    btn.addEventListener("click", () => gameBoard.startGame(x, y, index));
  });
  restartBtn.addEventListener("click", () => gameBoard.resetGame());

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      gameController.overlay.classList.contains("active")
    ) {
      boardUi.overlayToggle("");
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

const gameBoard = (() => {
  // Private state
  let gameBoardArray = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  let userSign = "X";
  let userTurn = true;
  let secondPlayer = "humanPlayer";
  let secondPlayerSign = "O";
  let aiDifficulty = 'Easy';
  let winner = undefined;

  // Private function to handle user sign selection
  function setUserSign(selectedSign) {
    resetGame();
    userSign = selectedSign;
    secondPlayerSign = userSign === "X" ? "O" : "X";
    boardUi.updateSignButtonUI(userSign);
    console.log(
      `I am: ${selectedSign} and the other player is ${secondPlayer}: ${secondPlayerSign}`
    );
    return userSign;
  }

  function setSecondPlayerType(player) {
    resetGame();
    secondPlayer = player;
    boardUi.updateSecondPlayerUI(secondPlayer);
    console.log(
      `Second player is: ${player}, and his sign is ${secondPlayerSign}`
    );
  }

  function startGame(posX, posY, posField) {
    if (winner !== undefined) {
      console.log("Game has already been won!");
      return;
    }

    if (userTurn) {
      makeMove(posX, posY, posField);
    } else if (!userTurn && secondPlayer === "humanPlayer") {
      makeMove(posX, posY, posField);
    } else if (!userTurn && secondPlayer === "aiPlayer") {
      moveAi(aiDifficulty);
    }
  }

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

  function checkWin(board, sign) {
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

    const flattenedBoard = board.reduce((acc, row) => acc.concat(row), []);

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
        return;
      }
    }

    if (isBoardFull(board) && !winner) {
      winner = "tie";
      boardUi.overlayToggle(winner);
      return;
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
  };
})();

const boardUi = (() => {
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

  function updateSignButtonUI(sign) {
    if (sign === "X") {
      gameController.userElementX.classList.add("active");
      gameController.userElementO.classList.remove("active");
    } else if (sign === "O") {
      gameController.userElementO.classList.add("active");
      gameController.userElementX.classList.remove("active");
    }
  }

  function updateSecondPlayerUI(secondPlayer) {
    if (secondPlayer === "humanPlayer") {
      gameController.humanPlayer.classList.add("active");
      gameController.aiPlayer.classList.remove("active");
    } else if (secondPlayer === "aiPlayer") {
      gameController.aiPlayer.classList.add("active");
      gameController.humanPlayer.classList.remove("active");
    }
  }

  function updateGameArray(posField, sign) {
    const targetBtn = gameController.fieldBtn[posField];
    targetBtn.innerHTML = sign;
  }

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
