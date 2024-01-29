const LINE_CELL_COUNT = 3;

const RETVALS = {
    SUCCESS: 1,
    ERROR: -1,
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
    let moveCount = 0;
    let player = MARKER.X;
    let gameEnd = false;
    let hasWinner = false;
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
                    hasWinner = true;
                    return {code: RETVALS.SUCCESS, message: `Game over`, gameEnd, hasWinner};
                } else {
                    if (moveCount == LINE_CELL_COUNT*LINE_CELL_COUNT) {
                        gameEnd = true;
                        return {code: RETVALS.SUCCESS, message: `Game over`, gameEnd, hasWinner};                        
                    }
                    player = player === MARKER.X ? MARKER.O : MARKER.X;
                }
                return {code: RETVALS.SUCCESS, message: `Player "${player}" to move`, gameEnd, hasWinner};
            } else {
                return {code: RETVALS.ERROR, message: `Play a legal move`, gameEnd, hasWinner};
            }
        } else {
            console.log("The game has ended! Please start over");
            return {code: RETVALS.ERROR, message: `Game over`, gameEnd}
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
    const status = document.querySelector("#status .message-holder");
    const winner = document.querySelector("#winner .message-holder");

    function playMove(cell, row, col) {
        const {code, message, gameEnd, hasWinner} = logicBoard.playMove(row, col);
        if (code === RETVALS.SUCCESS) {
            cell.textContent = logicBoard.getBoardElement(row, col);
            cell.classList.toggle(logicBoard.getBoardElement(row, col));
            cell.classList.toggle("moved");
        } 
        if (gameEnd) {
            DOMBoard.classList.add("finished");
            if (code === RETVALS.SUCCESS) {
                if (hasWinner) winner.textContent = `Player ${logicBoard.getBoardElement(row, col)}`;
                else winner.textContent = "Draw";
            } 
        }
        status.textContent = `${message}`;
    }

    function renderBoard() {
        for (let i = 0; i < LINE_CELL_COUNT; i++) {
            for (let j = 0; j < LINE_CELL_COUNT; j++) {
                const cell = document.createElement("div");
                cell.classList.toggle("cell");
                cell.addEventListener("click", (e) => {
                    playMove(cell, i, j);
                });
                
                cell.textContent = logicBoard.getBoardElement(i, j);
                DOMBoard.appendChild(cell);
            }
        }
    }
    return {DOMBoard, logicBoard, renderBoard};
})();

visualBoard.renderBoard();