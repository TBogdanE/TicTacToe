const gameController = (() => {
    const userElementX = document.getElementById('w-x');
    const userElementO = document.getElementById('w-o');
    const humanPlayer = document.getElementById('opponent-player');
    const aiPlayer = document.getElementById('opponent-ai');
    const fieldBtn = document.querySelectorAll('.field');
    const restartBtn = document.getElementById('restart-btn');


    userElementX.addEventListener('click', () => gameBoard.setUserSign('X'));
    userElementO.addEventListener('click', () => gameBoard.setUserSign('O'));
    humanPlayer.addEventListener('click', () => gameBoard.setSecondPlayer('humanPlayer'));
    aiPlayer.addEventListener('click', () => gameBoard.setSecondPlayer('aiPlayer'));
    fieldBtn.forEach((btn, index) => {
        const x = Math.floor(index / 3); // Calculate the row (x coordinate)
        const y = index % 3;
        btn.addEventListener('click', () => gameBoard.startGame(x, y, index));
    });
    restartBtn.addEventListener('click', () => gameBoard.resetGame());

    return {
        userElementX,
        userElementO,
        humanPlayer,
        aiPlayer,
        fieldBtn,
    }
})();

const gameBoard = (() => {
    // Private state
    let gameBoardArray = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    let userSign = 'X';
    let userTurn = true;
    let secondPlayer = 'humanPlayer';
    let secondPlayerSign = 'O';
    let secondPlayerTurn = false;
    console.log(userSign, secondPlayer, secondPlayerSign);

    // Private function to handle user sign selection
    function setUserSign(selectedSign) {
        userSign = selectedSign;
        secondPlayerSign = userSign === 'X' ? 'O' : 'X';
        boardUi.updateSignButtonUI(userSign);
        console.log(`I am: ${selectedSign} and the other player is ${secondPlayer}: ${secondPlayerSign}`);
        return userSign;
    }

    function setSecondPlayer(player) {
        secondPlayer = player;
        boardUi.updateSecondPlayerUI(secondPlayer);
        console.log(`Second player is: ${player}, and his sign is ${secondPlayerSign}`);
    }

    function startGame(posX, posY, posField) {
        if (gameBoardArray[posX][posY] === '') {
            if (userTurn === true) {
                gameBoardArray[posX][posY] = userSign;
                boardUi.updateGameArray(posField, userSign);
                userTurn = false;
                secondPlayerTurn = true;
            } else {
                gameBoardArray[posX][posY] = secondPlayerSign;
                boardUi.updateGameArray(posField, secondPlayerSign);
                userTurn = true;
                secondPlayerTurn = false;
            }
            console.log(gameBoardArray);
        } else {
            console.error('Error! You can\t take this spot');
        }
    }

    function resetGame() {
        gameBoardArray = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        userSign = 'X';
        userTurn = true;
        secondPlayer = 'humanPlayer';
        secondPlayerSign = 'O';
        secondPlayerTurn = false;
        boardUi.resetUI();
    }


    return {
        setUserSign,
        setSecondPlayer,
        startGame,
        resetGame,
    };
})();

const boardUi = (() => {
    //DOM
    //const restartBtn = document.getElementById('restart-btn');

    //EVENTS
    //restartBtn.addEventListener('click', restartGame);

    //FUNCTIONS 
    function updateSignButtonUI(sign) {
        if (sign === 'X') {
            gameController.userElementX.classList.add('active');
            gameController.userElementO.classList.remove('active');
        } else if (sign === 'O') {
            gameController.userElementO.classList.add('active');
            gameController.userElementX.classList.remove('active');
        }
    }

    function updateSecondPlayerUI(secondPlayer) {
        if (secondPlayer === 'humanPlayer') {
            gameController.humanPlayer.classList.add('active');
            gameController.aiPlayer.classList.remove('active');
        } else if (secondPlayer === 'aiPlayer') {
            gameController.aiPlayer.classList.add('active');
            gameController.humanPlayer.classList.remove('active');
        }
    }

    function updateGameArray(posField, sign) {
        const targetBtn = gameController.fieldBtn[posField];
        targetBtn.innerHTML = sign;
    }

    function resetUI() {
        gameController.fieldBtn.forEach((btn) => {
            btn.innerHTML = '';
            console.log()
        });
    }

    return {
        updateSignButtonUI,
        updateSecondPlayerUI,
        updateGameArray,
        resetUI,
    }
})();



/* TO DO:
- Game board;
- Get user sign;
- Select opponent;
- Update gameBoard;
- Minmax AI;
*/
