const LINE_CELL_COUNT = 3;

const RETVALS = {
    SUCCESS: 1,
    ILLEGAL_MOVE: -1,
    GAME_NOT_IN_PLAY: -2,
};

// factory function for logical (code/backendish) board
function makeBoard() {
    const MARKER = {
        X: "x",
        O: "o",
        NONE: "",
    }

    const INCREMENET = {
        UP_OR_RIGHT: 1,
        DOWN_OR_LEFT: -1,
    };

    let board = [];
    let moveCount = 1;
    let player = MARKER.X;
    let gameEnd = false;
    function resetBoard() {
        board = [];
        for (let i = 0; i < LINE_CELL_COUNT; i++) {
            let row = [];
            for (let j = 0; j < LINE_CELL_COUNT; j++) {
                row.push(MARKER.NONE);
            }
            board.push(row);
        }
        console.table(board);
    }
    resetBoard();

    function playMove(row, col) {
        if (!gameEnd) {
            if (board[row][col] === MARKER.NONE) {
                board[row][col] = player;
                moveCount++;
                let winner = findWinner();
                if (winner !== MARKER.NONE) {
                    gameEnd = true;
                    console.log(`Congrats! Player ${winner} has won!`);
                } else {
                    player = player === MARKER.X ? MARKER.O : MARKER.X;
                }
                console.table(board);
                return RETVALS.SUCCESS;
            } else {
                return RETVALS.ILLEGAL_MOVE;
            }
        } else {
            console.log("The game has ended! Please start over");
            return RETVALS.GAME_NOT_IN_PLAY
        }
    }

    // helper for findWinner
    function findLineWinner(row, col, rowInc, colInc) {
        for (let i = 1; i < LINE_CELL_COUNT; i++) {
            if (board[row][col] !== board[row + i*rowInc][col + i*colInc]) {
                return MARKER.NONE;
            }
        }
        return board[row][col];
    }

    function findWinner() {
        let lineOutcome = MARKER.NONE;
        // checking rows:
        for (let i = 0; i < LINE_CELL_COUNT; i++) {
            lineOutcome = findLineWinner(i, 0, 0, INCREMENET.UP_OR_RIGHT);
            if (lineOutcome !== MARKER.NONE) return lineOutcome;
        }
        // checking cols:
        for (let i = 0; i < LINE_CELL_COUNT; i++) {
            lineOutcome = findLineWinner(0, i, INCREMENET.UP_OR_RIGHT, 0);
            if (lineOutcome !== MARKER.NONE) return lineOutcome;
        }
        // checking top-left to bottom-right diag
        lineOutcome = findLineWinner(0, 0, INCREMENET.UP_OR_RIGHT, INCREMENET.UP_OR_RIGHT);
        if (lineOutcome !== MARKER.NONE) return lineOutcome;
        //checking bottom-left to top-right diag
        lineOutcome = findLineWinner(LINE_CELL_COUNT - 1, 0, INCREMENET.DOWN_OR_LEFT, INCREMENET.UP_OR_RIGHT);
        if (lineOutcome !== MARKER.NONE) return lineOutcome;
        return MARKER.NONE;
    }

    function getBoardElement(row, col) { return board[row][col]; }

    return {playMove, getBoardElement};
}

const visualBoard = (function() {
    const logicBoard = makeBoard();

    const DOMBoard = document.querySelector(".board");
    const status = document.querySelector(".status");

    function playMove(cell, row, col) {
        const actionResult = logicBoard.playMove(row, col);
        if (actionResult === RETVALS.SUCCESS) {
            cell.textContent = logicBoard.getBoardElement(row, col);
        } else if (actionResult === RETVALS.ILLEGAL_MOVE) {
            status.textContent = `You cannot play there!`;
        } else {
            status.textContent = `Game has ended! Please start a new game if you wish to play.`;
        }
    }

    function renderBoard() {
        for (let i = 0; i < LINE_CELL_COUNT; i++) {
            const row = document.createElement("div");
            row.classList.toggle("row");
            for (let j = 0; j < LINE_CELL_COUNT; j++) {
                const cell = document.createElement("div");
                cell.classList.toggle("cell");
                cell.addEventListener("click", );
                cell.textContent = logicBoard.getBoardElement(i, j);
                row.appendChild(cell);
            }
            DOMBoard.appendChild(row);
        } 
    }
    return {DOMBoard, logicBoard, renderBoard};
})();

visualBoard.renderBoard();
