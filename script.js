const gameboard = (() => {
    const grid = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
    ];

    const placeSymbol = (row, col, symbol) => {
        if (grid[row][col] === '') {
            grid[row][col] = symbol;
        } else {
            console.log('space already taken');
        }
        console.log(grid.join('\n'));
    }

    const resetGrid = () => {
        for(let row = 0; row < grid.length; row++) {
            for(let col = 0; col < grid[row].length; col++) {
                grid[row][col] = '';
            }
        }
        console.log(grid.join('\n'));
    }

    const winCheck = (row, col) => {
        if (grid[row][col] !== '') {
            let currentSymbol = grid[row][col];
            if (grid[row][0] === currentSymbol && 
                grid[row][1] === currentSymbol && 
                grid[row][2] === currentSymbol) {
                    console.log('win');
                    return true;
            } else if (grid[0][col] === currentSymbol && 
                grid[1][col] === currentSymbol && 
                grid[2][col] === currentSymbol) {
                    console.log('win');
                    return true;
            } 
            
            if (row === col &&
                grid[0][0] === currentSymbol &&
                grid[1][1] === currentSymbol &&
                grid[2][2] === currentSymbol) {
                    console.log('win');
                    return true;
            } 

            if (row + col === 2 &&
                grid[0][2] === currentSymbol &&
                grid[1][1] === currentSymbol &&
                grid[2][0] === currentSymbol) {
                    console.log('win');
                    return true;
            }
        }
        return false;
    }

    const readGrid = () => {
        return grid;
    }
    
    return { placeSymbol, resetGrid, winCheck, readGrid }
    
})();

const boardRender = (gridData) => {
    const board = document.querySelector('#board');

    board.textContent = '';

    console.log(gridData);
    for(let row = 0; row < gridData.length; row++) {
        for(let col = 0; col < gridData[row].length; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            
            console.log(gridData[row][col]);
            square.textContent = gridData[row][col];
            
            
            board.appendChild(square);
        }
    }
};

const createPlayer = (name, symbol)  => {
    let score = 0;
    const getScore = () => score;
    const givePoint = () => score++;

    return { name, symbol, getScore, givePoint }
}

const playerOne = createPlayer('player 1', 'X');
const playerTwo = createPlayer('player 2', 'O');

function playGame(playerOne, playerTwo) {
    gameboard.placeSymbol(1, 0, playerOne.symbol);
    gameboard.placeSymbol(1, 0, playerTwo.symbol);
    gameboard.placeSymbol(2, 1, playerOne.symbol);
    gameboard.resetGrid();
    gameboard.placeSymbol(0, 2, playerTwo.symbol);
    gameboard.placeSymbol(1, 1, playerTwo.symbol);
    gameboard.placeSymbol(2, 0, playerTwo.symbol);
    gameboard.winCheck(1, 1);
    playerTwo.givePoint();
    playerTwo.givePoint();
    playerTwo.givePoint();
    playerTwo.givePoint();
    console.log(playerTwo.getScore())
    boardRender(gameboard.readGrid())
}

playGame(playerOne, playerTwo);

