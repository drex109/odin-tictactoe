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
    
    return { placeSymbol, resetGrid, winCheck, readGrid };
    
})();

const displayController = (() => {

    const render = (gridData) => {
        board.textContent = '';

        for(let row = 0; row < gridData.length; row++) {
            for(let col = 0; col < gridData[row].length; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.setAttribute('data-row', row);
                square.setAttribute('data-col', col);
                
                square.textContent = gridData[row][col];
                
                board.appendChild(square);
            }
        }
    };

    const messageElem = document.querySelector('#message');
    
    const showWinMessage = (row, col, player) => {
        const message = document.createElement('h1');
        messageElem.appendChild(message);
        
        if (gameboard.winCheck(row, col)) {
            message.textContent = `${player} wins the round!`
        } else {
            message.textContent = ''
        }
    }

    const showStatusMessage = (playerTurn) => {
        const statusMessage = document.createElement('h2');

        if (playerTurn) {
            statusMessage.textContent = `${playerOne.name}'s turn`;
        } else {
            statusMessage.textContent = `${playerTwo.name}'s turn`;
        }
        messageElem.replaceChildren(statusMessage);
    }
    
    return { render, showWinMessage, showStatusMessage };
})()

const createPlayer = (name, symbol)  => {
    let score = 0;
    const getScore = () => score;
    const givePoint = () => score++;

    return { name, symbol, getScore, givePoint }
}

const playerOne = createPlayer('player 1', 'X');
const playerTwo = createPlayer('player 2', 'O');

function playGame(playerOne, playerTwo) {
    displayController.render(gameboard.readGrid())
    

    let playerTurn = true;
    let currentPlayer = playerOne;
    
    displayController.showStatusMessage(playerTurn);

    const board = document.querySelector('#board');
    
    board.addEventListener('click', (e) => {
        if (!e.target.classList.contains('square')) return;
        
        if (playerTurn) {
            currentPlayer = playerOne;
            playerTurn = false;
        } else{
            currentPlayer = playerTwo;
            playerTurn = true;
        }

        const row = Number(e.target.dataset.row);
        const col = Number(e.target.dataset.col);

        gameboard.placeSymbol(row, col, currentPlayer.symbol);
        gameboard.winCheck(row, col);

        displayController.showStatusMessage(playerTurn);
        displayController.showWinMessage(row, col, currentPlayer.name);
        displayController.render(gameboard.readGrid())
        
    });
    
}


playGame(playerOne, playerTwo);

