const gameBoard = (() => {
    // Private state
    const gameBoardArray = ['', '', '', '', '', '', '', '', ''];
    let userSign = 'X'; // Default user sign is 'X'

    // Private function to handle user sign selection
    function getUserSign(selectedSign) {
        userSign = selectedSign;
        boardUi.updateUserInterface(userSign);
    }

    // Public methods (interface)
    return {
        getUserSign,
        gameBoardArray,
        // Add more methods for game logic and state manipulation as needed
    };
})();

const boardUi = ((sign) => {
    function updateUserInterface(sign) {
        console.log(`User sign is: ${sign}`);
        if (sign === 'X') {
            domController.userElementX.style.backgroundColor = 'rgb(57, 57, 57)';
            domController.userElementX.style.color = 'rgb(255, 255, 255)';
            domController.userElementO.style.backgroundColor = 'rgb(255, 255, 255)';
            domController.userElementO.style.color = 'rgb(57, 57, 57)';
        } else if (sign === 'O') {
            domController.userElementO.style.backgroundColor = 'rgb(57, 57, 57)';
            domController.userElementO.style.color = 'rgb(255, 255, 255)';
            domController.userElementX.style.backgroundColor = 'rgb(255, 255, 255)';
            domController.userElementX.style.color = 'rgb(57, 57, 57)';
        }
    }
    return {
        updateUserInterface,
    }
})();

const domController = (() => {
    const userElementX = document.getElementById('w-x');
    const userElementO = document.getElementById('w-o');
    userElementX.addEventListener('click', () => gameBoard.getUserSign('X'));
    userElementO.addEventListener('click', () => gameBoard.getUserSign('O'));
    return {
        userElementO,
        userElementX,
    }
})();

/* TO DO:
- Game board;
- Get user sign;
- Select opponent;
- Update gameBoard;
- Minmax AI;
*/
