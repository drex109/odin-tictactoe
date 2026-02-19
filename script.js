function Gameboard(symbol) {
    const gameboard = [
    [' ', ' ', ' ',],
    [' ', ' ', ' '],
    [' ', ' ',' ']
    ];
    console.log(gameboard.join('\n'))
}
Gameboard();

function Player(name, symbol) {
    this.name = name;
    this.symbol = symbol;
}

function playerTurn(board, playerOne, playerTwo) {
    playerOne = new Player('player 1', 'X');
    playerTwo = new Player('player 2', 'O');
    console.log(playerOne);
    console.log(playerTwo);
}

function playGame(board, playerOne, playerTwo) {
    
}
playGame();