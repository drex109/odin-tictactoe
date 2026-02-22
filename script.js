const gameboard = (() => {
    const grid = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
    ];
    const updateBoard = (choice, symbol) => {
        if (choice === 1) {
            grid[0][0] = symbol;
        }
        console.log(grid.join('\n'))
    }
    return { updateBoard }
    
})();

const createPlayer = (name, symbol)  => {
    // const playerSymbol = symbol;

    let score = 0;
    const getScore = () => score;
    const givePoint = () => score++;

    return { name, symbol, getScore, givePoint }
}

function playerTurn(board, playerOne, playerTwo) {
    playerOne = createPlayer('player 1', 'X');
    playerTwo = createPlayer('player 2', 'O');
    console.log(playerOne);
    console.log(playerTwo);
    gameboard.updateBoard(1, playerOne.symbol)
    gameboard.updateBoard(1, playerTwo.symbol)
}

playerTurn()

// function playGame(board, playerOne, playerTwo) {
    
// }
// playGame();