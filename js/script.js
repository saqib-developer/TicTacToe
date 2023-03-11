let player = 1;
let ai = true;
let canrun = true;
let placesLeft = 9;
let drawn = true;
let board = ["", "", "", "", "", "", "", "", ""];

if (ai) {

    function turn(btnId) {
        let possible = document.getElementById(btnId).hasAttribute('name');
        if (!possible && canrun) {
            document.getElementById(btnId).setAttribute('name', 'checked');
            document.getElementById(btnId).firstElementChild.textContent = 'X';
            document.getElementById(btnId).firstElementChild.setAttribute('class', 'cross');
            board[parseInt(btnId)] = "X";
            computerTurn();
            RealWinner();
        }
    }

    function computerTurn() {
        let numb = minimax(board, 'O').move;
        if (numb !== undefined) {
            board[numb] = "O";
            document.getElementById(numb.toString()).firstElementChild.textContent = 'O';
            document.getElementById(numb.toString()).firstElementChild.setAttribute('class', 'circle');
        }
    }


    function minimax(board, player) {
        // Base case: check if the game is over
        var result = checkWinner(board);
        if (result !== null) {
            // Return a value based on who won
            switch (result) {
                case "X": return { value: 10 };
                case "O": return { value: -10 };
                case "tie": return { value: 0 };
            }
        }

        // Recursive case: evaluate all possible moves
        var bestMove;
        var bestValue = (player === "X") ? -Infinity : Infinity; // Initialize best value
        for (var i = 0; i < board.length; i++) {
            if (board[i] === "") {
                // Make a move and get its value
                board[i] = player;
                var moveValue = minimax(board, (player === "X") ? "O" : "X").value;
                board[i] = ""; // Undo the move

                // Update best value and best move
                if ((player === "X" && moveValue > bestValue) || (player === "O" && moveValue < bestValue)) {
                    bestValue = moveValue;
                    bestMove = i;
                }
            }
        }

        // Base case: return a value if there are no empty squares left
        if (bestMove === undefined) {
            return { value: 0 };
        }

        // Return the best move and its value
        return { move: bestMove, value: bestValue };
    }
} else {
    function turn(btnId) {
        let possible = document.getElementById(btnId).hasAttribute('name');
        if (!possible && canrun) {
            document.getElementById(btnId).setAttribute('name', 'checked');
            if (player == 1) {
                player++;
                document.getElementById(btnId).firstElementChild.textContent = 'X';
                document.getElementById(btnId).firstElementChild.setAttribute('class', 'cross');
                board[parseInt(btnId)] = "X";
            } else if (player == 2) {
                player--;
                document.getElementById(btnId).firstElementChild.textContent = 'O';
                document.getElementById(btnId).firstElementChild.setAttribute('class', 'circle');
                board[parseInt(btnId)] = "O";
            }
            RealWinner();
        }
    }
}

function checkWinner(board) {
    // Check rows
    for (var i = 0; i < 9; i += 3) {
        if (board[i] !== "" && board[i] === board[i + 1] && board[i] === board[i + 2]) {
            return board[i];
        }
    }

    // Check columns
    for (var i = 0; i < 3; i++) {
        if (board[i] !== "" && board[i] === board[i + 3] && board[i] === board[i + 6]) {
            return board[i];
        }
    }

    // Check diagonals
    if (board[0] !== "" && board[0] === board[4] && board[0] === board[8]) {
        return board[0];
    }
    if (board[2] !== "" && board[2] === board[4] && board[2] === board[6]) {
        return board[2];
    }

    // Check for tie
    for (var i = 0; i < 9; i++) {
        if (board[i] === "") {
            return null;
        }
    }
    return "tie";
}


function RealWinner() {
    let winner = checkWinner(board);
    if (winner !== null) {
        switch (winner) {
            case "X": won('X'); break;
            case "O": won('O'); break;
            case "tie": draw(); break;
        }
    }
}

function won(winner) {
    document.getElementById('result').innerHTML = winner + ' Won';
    drawn = false;
    canrun = false;
}

function draw() {
    document.getElementById('result').innerHTML = 'Match Drawn';
    canrun = false;
}

function restart() {
    location.reload();
}
