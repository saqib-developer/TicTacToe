import './App.css';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from 'firebase/database';
import { useState } from 'react';
import ShowJoinOptions from './components/ShowJoinOptions';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

function App() {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBwCzXU5gobAsSwICILCS7ooo3sfkGX76M",
    authDomain: "tictactoe-a8087.firebaseapp.com",
    projectId: "tictactoe-a8087",
    storageBucket: "tictactoe-a8087.appspot.com",
    messagingSenderId: "728019266800",
    appId: "1:728019266800:web:7020f2f9e70911a2db6635",
    measurementId: "G-DYP4T94VX4"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const [showJoinOptions, setShowJoinOptions] = useState(false)
  let player = 1;
  let opponent = 'ai';//ai, online, twoPlayer
  let canrun = true;
  let board = ["", "", "", "", "", "", "", "", ""];
  const [purpose, setPurpose] = useState('Join');
  let gameId = 'default';

  const getData = () => {
    get(ref(db, 'Game Rooms/' + gameId)).then((snapshot) => {
      let data = (snapshot.val());
      board = data.board;
      player = data.player;
    }).catch((error) => {
      console.error(error);
    });
  }
  getData();

  const turn = (element) => {
    let possible = element.hasAttribute('name');
    if (!possible && canrun) {
      if (opponent === 'ai') {
        element.setAttribute('name', 'checked');
        element.firstElementChild.textContent = 'X';
        element.firstElementChild.setAttribute('class', 'cross');
        board[parseInt(element.id)] = "X";
        // setBoard(ps => {
        //   ps[parseInt(element.id)] = 'X';
        //   return [...ps]
        // });
        computerTurn();
      }

      else if (opponent === 'twoPlayer') {
        if (player === 1) {
          player++;
          element.firstElementChild.textContent = 'X';
          element.firstElementChild.setAttribute('class', 'cross');
          board[parseInt(element.id)] = "X";
        } else if (player === 2) {
          player--;
          element.firstElementChild.textContent = 'O';
          element.firstElementChild.setAttribute('class', 'circle');
          board[parseInt(element.id)] = "O";
        }
      }

      else if (opponent === 'online') {
        if (player === 1) {
          player++;
          element.firstElementChild.textContent = 'X';
          element.firstElementChild.setAttribute('class', 'cross');
          board[parseInt(element.id)] = "X";
          sync(gameId);
        } else if (player === 2) {
          player--;
          element.firstElementChild.textContent = 'O';
          element.firstElementChild.setAttribute('class', 'circle');
          board[parseInt(element.id)] = "O";
          sync(gameId);
        }
      }
      RealWinner();
    }
  }

  const sync = (id) => {
    set(ref(db, 'Game Rooms/' + id), {
      player: player,
      board: board
    })
      .then(() => {
        console.log('Turn Saved');
      })
      .catch((error) => {
        console.log('Turn not Saved Error ' + error);
      });
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
        default: break;
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
        default: break;
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
            document.getElementById('line').style.marginRight = '250px'
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
            document.getElementById('line').style.marginRight = '-250px'
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
          default:
            break;
        }
      }
    }
  }

  function won(winner) {
    document.getElementById('result').innerHTML = winner + ' Won';
    canrun = false;
  }

  function draw() {
    document.getElementById('result').innerHTML = 'Match Drawn';
    canrun = false;
  }

  const restart = () => {
    window.location.reload(false);
  }

  const saveData = (event) => {
    event.preventDefault();
    setShowJoinOptions(false);
    const id = document.getElementById('idOfGame').value;
    gameId = id;

    sync(id)
  }
  return (
    <>
      <p id="result"></p>
      <div className="cantainer">
        <div className="line" id="line"></div>
        <div className="rows">
          <button className="box" id="0" onClick={(event) => { turn(event.target) }}><span></span></button>
          <button className="box" id="1" onClick={(event) => { turn(event.target) }}><span></span></button>
          <button className="box" id="2" onClick={(event) => { turn(event.target) }}><span></span></button>
        </div>
        <div className="rows">
          <button className="box" id="3" onClick={(event) => { turn(event.target) }}><span></span></button>
          <button className="box" id="4" onClick={(event) => { turn(event.target) }}><span></span></button>
          <button className="box" id="5" onClick={(event) => { turn(event.target) }}><span></span></button>
        </div>
        <div className="rows">
          <button className="box" id="6" onClick={(event) => { turn(event.target) }}><span></span></button>
          <button className="box" id="7" onClick={(event) => { turn(event.target) }}><span></span></button>
          <button className="box" id="8" onClick={(event) => { turn(event.target) }}><span></span></button>
        </div>
      </div>
      {opponent === 'online' ? (
        <div>
          <button className="restart" onClick={() => { setShowJoinOptions(true); setPurpose('Join'); }}>Join</button>
          <button className="restart" onClick={() => { setShowJoinOptions(true); setPurpose('Create'); }}>Create</button>
        </div>
      ) : (
        <button className="restart" onClick={restart}>Restart</button>
      )}
      {showJoinOptions ? (
        <ShowJoinOptions purpose={purpose} saveData={saveData} setShowJoinOptions={setShowJoinOptions} />
      ) : (
        <div></div>
      )}

    </>
  );
}

export default App;
