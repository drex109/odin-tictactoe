const gameboard = (() => {
    const grid = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
    ];

    const placeSymbol = (row, col, symbol) => {
        if (grid[row][col] === '') {
            grid[row][col] = symbol;
            return true;
        } else {
            return false;
        }
    }

    const resetGrid = () => {
        for(let row = 0; row < grid.length; row++) {
            for(let col = 0; col < grid[row].length; col++) {
                grid[row][col] = '';
            }
        }
    }

    const winCheck = (row, col) => {
        if (grid[row][col] !== '') {
            let currentSymbol = grid[row][col];
            if (grid[row][0] === currentSymbol && 
                grid[row][1] === currentSymbol && 
                grid[row][2] === currentSymbol) {
                    return true;
            } else if (grid[0][col] === currentSymbol && 
                grid[1][col] === currentSymbol && 
                grid[2][col] === currentSymbol) {
                    return true;
            } 
            
            if (row === col &&
                grid[0][0] === currentSymbol &&
                grid[1][1] === currentSymbol &&
                grid[2][2] === currentSymbol) {
                    return true;
            } 

            if (row + col === 2 &&
                grid[0][2] === currentSymbol &&
                grid[1][1] === currentSymbol &&
                grid[2][0] === currentSymbol) {
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
    const showCurrentRound = (currentRound) => {
        const round = document.createElement('h2');
        round.textContent = `Round ${currentRound}`;

        roundElem.replaceChildren(round);
    }

    const roundCountdownElem = document.querySelector('#countdown')
    let timer;
    const roundCountdown = (resetGame) => {
        let count = 11;
        const countdown = document.createElement('h1');
        timer = setInterval(() => {
            if (count === 0) {
                clearInterval(timer);
                countdown.textContent = '';
                resetGame();
            } else {
                count--;
                countdown.textContent = `Next round starting... ${count}`;
            }
        }, 1000)

        roundCountdownElem.replaceChildren(countdown)
        
    }

    const cancelCountdown = () => {
        clearInterval(timer);
        roundCountdownElem.replaceChildren('')
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
    
    const statusMessageElem = document.querySelector('#status-message')
    
    const showWinMessage = (player) => {
        const winMessage = document.createElement('h2');
        
        winMessage.textContent = `${player.name} wins the round!`;
        winMessage.style.color = 'lightgreen'

        statusMessageElem.classList.add('active');
        statusMessageElem.replaceChildren(winMessage);
    }

    const showDrawMessage = () => {
        const drawMessage = document.createElement('h2');

        drawMessage.textContent = 'Draw!';
        drawMessage.style.color = 'yellow'
        
        statusMessageElem.classList.add('active');
        statusMessageElem.replaceChildren(drawMessage);
    }

    const showTurnMessage = (player) => {
        const turnMessage = document.createElement('h2');
        
        turnMessage.textContent = `${player.name}'s turn`;
        
        statusMessageElem.classList.add('active');
        statusMessageElem.replaceChildren(turnMessage);
    }

    const finalMessageElem = document.querySelector('#final-message')
    const showFinalMessage = (p1, p2) => {
        const finMessage = document.createElement('h1');
        let draw = false;
        let player;

        if (p1.getScore() > p2.getScore()) {
            player = p1;
        } else if (p2.getScore() > p1.getScore()) {
            player = p2;
        } else {
            draw = true;
        }

        if (draw) {
            finMessage.textContent = `Draw!`;
        } else {
            finMessage.textContent = `${player.name} wins the game!`;
        }
        finMessage.style.color = 'lightgreen'

        finalMessageElem.replaceChildren(finMessage);
    }
    
    return { render, showCurrentRound, roundCountdown, cancelCountdown, showScoreBoard, showWinMessage, showFinalMessage, showDrawMessage, showTurnMessage };
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
        displayController.showTurnMessage(currentPlayer);
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

            roundActive = false;

            if (currentRound === 6) {
                resetGame();
                return;
            }

            displayController.roundCountdown(resetGame);
            return;
        }

        if (movesPlayed === 9) {
            displayController.showDrawMessage();
            
            currentRound++;
            
            roundActive = false;

            if (currentRound === 6) {
                resetGame();
                return;
            }

            displayController.roundCountdown(resetGame);
            return;
        }
        
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
        
        displayController.showTurnMessage(currentPlayer);
        
    };

    const resetGame = () => {
        displayController.cancelCountdown();
        
        if (currentRound === 6) {
            displayController.showFinalMessage(playerOne, playerTwo);
            return;
        }
        
        gameboard.resetGrid();
        displayController.render(gameboard.readGrid());
        displayController.showCurrentRound(currentRound);

        roundActive = true;
        movesPlayed = 0;
        currentPlayer = playerOne;
        
        displayController.showTurnMessage(currentPlayer);
    }

})();


