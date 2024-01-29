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
    let board = [];
    let moveCount = 1;
    let player = "x";
    let gameEnd = false;
    function resetBoard() {
        board = [];
        for (let i = 0; i < LINE_CELL_COUNT; i++) {
            let row = [];
            for (let j = 0; j < LINE_CELL_COUNT; j++) {
                row.push("e");
            }
            board.push(row);
        }
        console.table(board);
    }
    resetBoard();

    function playMove(row, col) {
        if (!gameEnd) {
            if (board[row][col] === "e") {
                board[row][col] = player;
                moveCount++;
                let winner = findWinner();
                if (winner !== OUTCOMES.NONE) {
                    gameEnd = true;
                    console.log(`Congrats! Player ${winner} has won!`);
                } else {
                    player = player === "x" ? "o" : "x";
                }
                console.table(board);
            } else {
                console.log("This square is already occupied");
            }
        } else {
            console.log("The game has ended! Please start over");
        }
    }

    // helper for findWinner
    function findLineWinner(row, col, rowInc, colInc) {
        for (let i = 1; i < LINE_CELL_COUNT; i++) {
            if (board[row][col] !== board[row + i*rowInc][col + i*colInc]) {
                return OUTCOMES.NONE;
            }
        }
        return board[row][col];
    }

    function findWinner() {
        let lineOutcome = OUTCOMES.NONE;
        // checking rows:
        for (let i = 0; i < LINE_CELL_COUNT; i++) {
            lineOutcome = findLineWinner(i, 0, 0, INCREMENET.UP_OR_RIGHT);
            if (lineOutcome !== OUTCOMES.NONE) return lineOutcome;
        }
        // checking cols:
        for (let i = 0; i < LINE_CELL_COUNT; i++) {
            lineOutcome = findLineWinner(0, i, INCREMENET.UP_OR_RIGHT, 0);
            if (lineOutcome !== OUTCOMES.NONE) return lineOutcome;
        }
        // checking top-left to bottom-right diag
        lineOutcome = findLineWinner(0, 0, INCREMENET.UP_OR_RIGHT, INCREMENET.UP_OR_RIGHT);
        if (lineOutcome !== OUTCOMES.NONE) return lineOutcome;
        //checking bottom-left to top-right diag
        lineOutcome = findLineWinner(LINE_CELL_COUNT - 1, 0, INCREMENET.DOWN_OR_LEFT, INCREMENET.UP_OR_RIGHT);
        if (lineOutcome !== OUTCOMES.NONE) return lineOutcome;
        return OUTCOMES.NONE;
    }

    return {playMove};
})();