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

    const roundElem = document.querySelector('#round');
    const showCurrentRound = (roundNum) => {
        const round = document.createElement('h2');
        round.textContent = `Round ${roundNum}`;

        roundElem.replaceChildren(round);
    }

    const scoreBoard = document.querySelector('#score-board');
    const showScoreBoard = (p1, p2) => {
        const scores = document.createElement('div');

        const playerOneScore = document.createElement('h3');
        playerOneScore.textContent = `${p1.name} : ${p1.getScore()}`;

        const playerTwoScore = document.createElement('h3');
        playerTwoScore.textContent = `${p2.name} : ${p2.getScore()}`;

        scores.appendChild(playerOneScore);
        scores.appendChild(playerTwoScore);

        scoreBoard.replaceChildren(scores);
    }

    const winMessageElem = document.querySelector('#win-message');
    const showWinMessage = (player) => {
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

    const clearWinMessage = () => {
        winMessageElem.replaceChildren();
    }
    
    return { render, showCurrentRound, showScoreBoard, showWinMessage, showDrawMessage, showStatusMessage, clearWinMessage };
})()

const createPlayer = (name, symbol)  => {
    let score = 0;
    const getScore = () => score;
    const givePoint = () => score++;

    return { name, symbol, getScore, givePoint }
}

const gameController = (() => {
    let roundActive;
    let currentRound;
    let movesPlayed;
    let currentPlayer;
    let playerOne;
    let playerTwo;

    const board = document.querySelector('#board');
    
    const buttons = document.querySelector('#buttons');
    const resetButton = document.createElement('button');
    resetButton.setAttribute('id', 'reset-button');
    resetButton.textContent = 'Reset';

    const dialog = document.querySelector('dialog');
    const openDialog = document.querySelector('#open-dialog');
    const closeDialog = document.querySelector('#close-dialog');
    const form = document.querySelector('#player-info');
    const err = document.querySelector('#error-message')

    openDialog.addEventListener('click', () => {
        dialog.showModal()
    });
    closeDialog.addEventListener('click', () => {
        dialog.close()
    });

    form.addEventListener('submit', (e) => {
        const data = Object.fromEntries(new FormData(form));
        
        if (data.playerOneName === data.playerTwoName) {
            err.textContent = "Names cannot be the same";
            e.preventDefault();
            return;
        }
        if (data.playerOneSymbol === data.playerTwoSymbol) {
            err.textContent = "Symbols cannot be the same"
            e.preventDefault();
            return;
        }

        board.classList.add('board-active');

        buttons.replaceChildren(resetButton);
        
        init(
            createPlayer(data.playerOneName, data.playerOneSymbol),
            createPlayer(data.playerTwoName, data.playerTwoSymbol)
        );
    });

    const init = (p1, p2) => {
        playerOne = p1;
        playerTwo = p2;

        roundActive = true;
        currentRound = 1;
        movesPlayed = 0;
        currentPlayer = playerOne;
        
        displayController.render(gameboard.readGrid());
        displayController.showCurrentRound(currentRound);
        displayController.showScoreBoard(playerOne, playerTwo);
        displayController.showStatusMessage(currentPlayer);
        board.addEventListener('click', boardClick);
        resetButton.addEventListener('click', resetGame);
    };

    const boardClick = (e) => {
        if (!e.target.classList.contains('square')) return;
        
        const row = Number(e.target.dataset.row);
        const col = Number(e.target.dataset.col);
        
        if (!roundActive) return;
        if (!gameboard.placeSymbol(row, col, currentPlayer.symbol)) return;
        
        movesPlayed++;
        displayController.render(gameboard.readGrid());

        if (gameboard.winCheck(row, col)) {
            displayController.showWinMessage(currentPlayer);
            
            currentPlayer.givePoint();
            displayController.showScoreBoard(playerOne, playerTwo);

            currentRound++;
            console.log(currentRound);

            roundActive = false;
            return;
        }

        if (movesPlayed === 9) {
            displayController.showDrawMessage();
            
            currentRound++;
            console.log(currentRound);
            
            roundActive = false;
            return;
        }
        
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
        
        displayController.showStatusMessage(currentPlayer);
        
        console.log(movesPlayed);
    };

    const resetGame = () => {
        gameboard.resetGrid();
        displayController.render(gameboard.readGrid());
        displayController.clearWinMessage();
        displayController.showCurrentRound(currentRound);

        roundActive = true;
        movesPlayed = 0;
        currentPlayer = playerOne;
        
        displayController.showStatusMessage(currentPlayer);
    }

})();


