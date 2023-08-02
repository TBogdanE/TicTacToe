const gameBoard = (() => {
    // Private state
    const gameBoardArray = ['', '', '', '', '', '', '', '', ''];
    let userSign = 'X'; // Default user sign is 'X'

    //event listeners

    // Private function to handle user sign selection
    function setUserSign(selectedSign) {
        userSign = selectedSign;
        boardUi.updateSignButtonUI(userSign);
    }

    function setSecondPlayer(player) {
        let secondPlayer = player;
        boardUi.updateSecondPlayerUI(secondPlayer);
    }

    // Public methods (interface)
    return {
        setUserSign,
        setSecondPlayer,
    };
})();

const gameController = (() => {
    const userElementX = document.getElementById('w-x');
    const userElementO = document.getElementById('w-o');
    const humanPlayer = document.getElementById('opponent-player');
    const aiPlayer = document.getElementById('opponent-ai');
    userElementX.addEventListener('click', () => gameBoard.setUserSign('X'));
    userElementO.addEventListener('click', () => gameBoard.setUserSign('O'));
    humanPlayer.addEventListener('click', () => gameBoard.setSecondPlayer('humanPlayer'));
    aiPlayer.addEventListener('click', () => gameBoard.setSecondPlayer('aiPlayer'));

    return {
        userElementX,
        userElementO,
        humanPlayer,
        aiPlayer,
    }
})();

const boardUi = (() => {
    //DOM
    //const restartBtn = document.getElementById('restart-btn');

    //EVENTS
    //restartBtn.addEventListener('click', restartGame);

    //FUNCTIONS 
    function updateSignButtonUI(sign) {
        console.log(`User sign is: ${sign}`);
        if (sign === 'X') {
            gameController.userElementX.style.backgroundColor = 'rgb(57, 57, 57)';
            gameController.userElementX.style.color = 'rgb(255, 255, 255)';
            gameController.userElementO.style.backgroundColor = 'rgb(255, 255, 255)';
            gameController.userElementO.style.color = 'rgb(57, 57, 57)';
        } else if (sign === 'O') {
            gameController.userElementO.style.backgroundColor = 'rgb(57, 57, 57)';
            gameController.userElementO.style.color = 'rgb(255, 255, 255)';
            gameController.userElementX.style.backgroundColor = 'rgb(255, 255, 255)';
            gameController.userElementX.style.color = 'rgb(57, 57, 57)';
        }
    }   
    function updateSecondPlayerUI(secondPlayer) {
        console.log(`Second player is: ${secondPlayer}`);
        if (secondPlayer === 'humanPlayer') {
            gameController.humanPlayer.style.backgroundColor = 'rgb(57, 57, 57)';
            gameController.humanPlayer.style.color = 'rgb(255, 255, 255)';
            gameController.aiPlayer.style.backgroundColor = 'rgb(255, 255, 255)';
            gameController.aiPlayer.style.color = 'rgb(57, 57, 57)';
        } else if (secondPlayer === 'aiPlayer') {
            gameController.aiPlayer.style.backgroundColor = 'rgb(57, 57, 57)';
            gameController.aiPlayer.style.color = 'rgb(255, 255, 255)';
            gameController.humanPlayer.style.backgroundColor = 'rgb(255, 255, 255)';
            gameController.humanPlayer.style.color = 'rgb(57, 57, 57)';
        }
    }
    return {
        updateSignButtonUI,
        updateSecondPlayerUI,
    }
})();

/* TO DO:
- Game board;
- Get user sign;
- Select opponent;
- Update gameBoard;
- Minmax AI;
*/
