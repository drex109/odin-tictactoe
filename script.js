const gameboard = (() => {
    const grid = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
    ];

    const placeSymbol = (row, col, symbol) => {
        if (grid[row][col] === '') {
            grid[row][col] = symbol;
            console.log(grid.join('\n'));
            return true;
        } else {
            console.log('space already taken');
            console.log(grid.join('\n'));
            return false;
        }
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
        return [...grid];
    }
    
    return { placeSymbol, resetGrid, winCheck, readGrid };
    
})();

const displayController = (() => {
    
    const board = document.querySelector('#board');

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

    const showWinMessage = (player) => {
        const winMessageElem = document.querySelector('#win-message');
        const winMessage = document.createElement('h1');
        
        winMessage.textContent = `${player.name} wins the round!`;

        winMessageElem.replaceChildren(winMessage);
    }
    
    const statusMessageElem = document.querySelector('#status-message')
    
    const showDrawMessage = () => {
        const drawMessage = document.createElement('h1');

        drawMessage.textContent = 'Draw!';

        statusMessageElem.replaceChildren(drawMessage);
    }

    const showStatusMessage = (player) => {
        const statusMessage = document.createElement('h2');
        
        statusMessage.textContent = `${player.name}'s turn`;
        
        statusMessageElem.replaceChildren(statusMessage);
    }

    const resetUI = (gridData) => {
        board.textContent = '';

        for(let row = 0; row < gridData.length; row++) {
            for(let col = 0; col < gridData[row].length; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.setAttribute('data-row', row);
                square.setAttribute('data-col', col);
                
                square.textContent = '';
                
                board.appendChild(square);
            }
        }
    }
    
    return { render, showWinMessage, showDrawMessage, showStatusMessage, resetUI };
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
    let roundActive = true;
    let movesPlayed = 0;
    
    displayController.render(gameboard.readGrid())

    let currentPlayer = playerOne;
    
    displayController.showStatusMessage(currentPlayer);

    const board = document.querySelector('#board');
    
    board.addEventListener('click', (e) => {
        if (!e.target.classList.contains('square')) return;

        const row = Number(e.target.dataset.row);
        const col = Number(e.target.dataset.col);

        if (!roundActive) return;
        if (!gameboard.placeSymbol(row, col, currentPlayer.symbol)) return;
        
        movesPlayed++;
        
        displayController.render(gameboard.readGrid());

        if (gameboard.winCheck(row, col)) {
            displayController.showWinMessage(currentPlayer);
            roundActive = false;
            return;
        }
        if (movesPlayed === 9) {
            displayController.showDrawMessage();
            roundActive = false;
            return;
        }

        currentPlayer === playerOne ?
        currentPlayer = playerTwo : 
        currentPlayer = playerOne;
        
        displayController.showStatusMessage(currentPlayer);
        
        console.log(movesPlayed);
    });

    const resetButton = document.querySelector('#reset-button');

    resetButton.addEventListener('click', () => {
        gameboard.resetGrid();
        displayController.resetUI(gameboard.readGrid());
        movesPlayed = 0;
    })
}

playGame(playerOne, playerTwo);

