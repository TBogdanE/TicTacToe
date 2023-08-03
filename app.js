const gameController = (() => {
    const userElementX = document.getElementById('w-x');
    const userElementO = document.getElementById('w-o');
    const humanPlayer = document.getElementById('opponent-player');
    const aiPlayer = document.getElementById('opponent-ai');
    const fieldBtn = document.querySelectorAll('.field');


    userElementX.addEventListener('click', () => gameBoard.setUserSign('X'));
    userElementO.addEventListener('click', () => gameBoard.setUserSign('O'));
    humanPlayer.addEventListener('click', () => gameBoard.setSecondPlayer('humanPlayer'));
    aiPlayer.addEventListener('click', () => gameBoard.setSecondPlayer('aiPlayer'));

    fieldBtn.forEach(btn => {
        btn.addEventListener('click', () =>{
            console.log('sal');
        });
    });

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
    const gameBoardArray = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    let userSign = 'X';
    let secondPlayer = 'humanPlayer';
    let secondPlayerSign = 'O';
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




    return {
        gameBoardArray,
        setUserSign,
        setSecondPlayer,
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
