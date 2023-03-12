let player = 1;
let ai = false;
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
            document.getElementById(numb.toString()).setAttribute('name', 'checked');
            document.getElementById(numb.toString()).firstElementChild.textContent = 'O';
            document.getElementById(numb.toString()).firstElementChild.setAttribute('class', 'circle');
        }
    }


    function minimax(board, player) {
        // Base case: check if the game is over
        let result = checkWinner(board).winnerMark;
        if (result !== null) {
            // Return a value based on who won
            switch (result) {
                case "X": return { value: 10 };
                case "O": return { value: -10 };
                case "tie": return { value: 0 };
            }
        }

        // Recursive case: evaluate all possible moves
        let bestMove;
        let bestValue = (player === "X") ? -Infinity : Infinity; // Initialize best value
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                // Make a move and get its value
                board[i] = player;
                let moveValue = minimax(board, (player === "X") ? "O" : "X").value;
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
    // 0 3 6
    for (let i = 0; i < 9; i += 3) {
        if (board[i] !== "" && board[i] === board[i + 1] && board[i] === board[i + 2]) {
            if (i === 6) {
                return { winnerMark: board[i], place: 5 };
            } else {
                return { winnerMark: board[i], place: (i) };
            }
        }
    }

    // Check columns
    // 0 1 2
    for (let i = 0; i < 3; i++) {
        if (board[i] !== "" && board[i] === board[i + 3] && board[i] === board[i + 6]) {
            if (i === 2) {
                return { winnerMark: board[i], place: 4 };
            } else {
                return { winnerMark: board[i], place: (i + 1) };
            }
        }
    }

    // Check diagonals
    if (board[0] !== "" && board[0] === board[4] && board[0] === board[8]) {
        return { winnerMark: board[0], place: 6 };
    }
    if (board[2] !== "" && board[2] === board[4] && board[2] === board[6]) {
        return { winnerMark: board[2], place: 7 };
    }

    // Check for tie
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            return { winnerMark: null, place: null };
        }
    }
    return { winnerMark: "tie", place: undefined };
    ;
}


function RealWinner() {
    let winnerPlace = checkWinner(board);

    if (winnerPlace.winnerMark !== null) {
        switch (winnerPlace.winnerMark) {
            case "X": won('X'); break;
            case "O": won('O'); break;
            case "tie": draw(); break;
        }
        if (winnerPlace.winnerMark !== 'tie') {
            document.getElementById('line').style.display = 'block';
            switch (winnerPlace.place) {
                case 0:
                    console.log(0);
                    document.getElementById('line').style.transform = 'rotate(90deg)'
                    document.getElementById('line').style.marginBottom = '226px'
                    break;
                    case 1:
                        console.log(1);
                        document.getElementById('line').style.transform = 'rotate(0deg)'
                        document.getElementById('line').style.marginRight = '226px'
                    break;
                case 2:
                    console.log(2);
                    document.getElementById('line').style.transform = 'rotate(0deg)'
                    break;
                case 3:
                    console.log(3);
                    document.getElementById('line').style.transform = 'rotate(90deg)'
                    document.getElementById('line').style.marginBottom = '-27px'
                    break;
                case 4:
                    console.log(4);
                    document.getElementById('line').style.transform = 'rotate(0deg)'
                    break;
                case 5:
                    console.log(5);
                    document.getElementById('line').style.transform = 'rotate(90deg)'
                    document.getElementById('line').style.marginBottom = '-317px'
                    break;
                case 6:
                    console.log(6);
                    document.getElementById('line').style.transform = 'rotate(-45deg)'
                    break;
                case 7:
                    console.log(7);
                    document.getElementById('line').style.transform = 'rotate(45deg)'
                    break;
            }
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
