function Gameboard(symbol) {
    const gameboard = [
    [' ', ' ', ' ',],
    [' ', ' ', ' '],
    [' ', ' ',' ']
    ];
    console.log(gameboard.join('\n'))
}
Gameboard();

function createPlayer(name, symbol) {
    const playerSymbol = symbol;

    let score = 0;
    const getScore = () => score;
    const givePoint = () => score++;

    return { name, playerSymbol, getScore, givePoint }
}

function playerTurn(board, playerOne, playerTwo) {
    playerOne = createPlayer('player 1', 'X');
    playerTwo = createPlayer('player 2', 'O');
    console.log(playerOne);
    console.log(playerTwo);
}

playerTurn()

// function playGame(board, playerOne, playerTwo) {
    
// }
// playGame();