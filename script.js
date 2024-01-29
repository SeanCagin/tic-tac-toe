const gameboard = (function(){
    const OUTCOMES = {
        X_WIN: "x",
        O_WIN: "o",
        NONE: "e",
    }

    const INCREMENET = {
        UP_OR_RIGHT: 1,
        DOWN_OR_LEFT: -1,
    };

    const LINE_CELL_COUNT = 3;
    const board = [["e", "e", "e"],
                   ["e", "e", "e"], 
                   ["e", "e", "e"]];
    let moveCount = 1;
    let player = "x";

    function playMove(row, col) {
        if (board[row][col] === "e") {
            board[row][col] = player;

        } else {
            console.log("This square is already occupied");
        }
    }

    function findLineWinner(row, col, rowInc, colInc) {
        for (let i = 1; i < LINE_CELL_COUNT; i++) {
            if (board[row][col] !== row[row + i*rowInc][col + i*colInc]) {
                return OUTCOMES.NONE;
            }
        }
        return board[row][col];
    }

    function findWinner() {
        let lineOutcome = OUTCOMES.NONE;
        // checking rows:
        for (let i = 0; i < LINE_CELL_COUNT; i++) {
            lineOutcome = findLineWinner(i, 0, 0, UP_OR_RIGHT);
            if (lineOutcome !== OUTCOMES.NONE) return lineOutcome;
        }
        // checking cols:
        for (let i = 0; i < LINE_CELL_COUNT; i++) {
            lineOutcome = findLineWinner(0, i, UP_OR_RIGHT, 0);
            if (lineOutcome !== OUTCOMES.NONE) return lineOutcome;
        }
        // checking top-left to bottom-right diag
        lineOutcome = findLineWinner(0, 0, UP_OR_RIGHT, UP_OR_RIGHT);
        if (lineOutcome !== OUTCOMES.NONE) return lineOutcome;
        //checking bottom-left to top-right diag
        lineOutcome = findLineWinner(LINE_CELL_COUNT - 1, 0, DOWN_OR_LEFT, UP_OR_RIGHT);
        if (lineOutcome !== OUTCOMES.NONE) return lineOutcome;
        return OUTCOMES.NONE;
    }
})();