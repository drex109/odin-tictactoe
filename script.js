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

const displayController = (() => {

    const render = (gridData) => {
        board.textContent = '';

        console.log(gridData);
        for(let row = 0; row < gridData.length; row++) {
            for(let col = 0; col < gridData[row].length; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.setAttribute('data-row', row);
                square.setAttribute('data-col', col);
                
                // console.log(gridData[row][col]);
                square.textContent = gridData[row][col];
                
                
                board.appendChild(square);
            }
        }
    };

    const showWinMessage = (row, col, player) => {
        const messageElem = document.querySelector('#message');
        const message = document.createElement('h1');
        messageElem.appendChild(message);
        console.log(player)
        
        if (gameboard.winCheck(row, col)) {
            message.textContent = `${player} wins the round!`
        } else {
            message.textContent = ''
        }

        
    }
    
    return { render, showWinMessage }
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

    const board = document.querySelector('#board');
    const messageElem = document.querySelector('#message');
    const statusMessage = document.createElement('h3');

    statusMessage.textContent = `${currentPlayer.name}'s turn`
    messageElem.appendChild(statusMessage);

    board.addEventListener('click', (e) => {
        if (!e.target.classList.contains('square')) return;
        
        if (playerTurn) {
            currentPlayer = playerOne;
            statusMessage.textContent = `${playerTwo.name}'s turn`
            messageElem.appendChild(statusMessage);
            playerTurn = false;
        } else{
            currentPlayer = playerTwo;
            statusMessage.textContent = `${playerOne.name}'s turn`
            messageElem.appendChild(statusMessage);
            playerTurn = true;
        }

        const row = Number(e.target.dataset.row);
        const col = Number(e.target.dataset.col);
        console.log(row);
        console.log(col);
        console.log(currentPlayer.name)

        gameboard.placeSymbol(row, col, currentPlayer.symbol);
        gameboard.winCheck(row, col);

        displayController.showWinMessage(row, col, currentPlayer.name);
        displayController.render(gameboard.readGrid())
        
    });
    
}


playGame(playerOne, playerTwo);

