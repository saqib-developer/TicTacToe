import './App.css';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { useState, useEffect } from 'react';
import ShowJoinOptions from './components/ShowJoinOptions';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

function App() {
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
  const [player, setPlayer] = useState(1);
  let opponent = 'twoPlayer'; //ai, online, twoPlayer
  let canrun = true;
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""])
  const [purpose, setPurpose] = useState('Join');
  const [gameId, setGameId] = useState();

  useEffect(() => {
    if (gameId !== undefined) {
      set(ref(db, 'Game Rooms/' + gameId), {
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
    board.forEach((element, index) => {
      if (element === 'X') {
        document.getElementById(index.toString()).firstElementChild.setAttribute('class', 'cross');
      } else if (element === 'O') {
        document.getElementById(index.toString()).firstElementChild.setAttribute('class', 'circle');
      }
    });

    document.getElementById('result').innerHTML = '';
    document.getElementById('line').style.display = 'none';
    RealWinner();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, db, gameId, player])

  useEffect(() => {
    if (gameId !== undefined) {
      onValue(ref(db, 'Game Rooms/' + gameId), (snapshot) => {
        let data = (snapshot.val());
        setBoard(data.board);
        setPlayer(data.player);
      }, (error) => {
        console.error(error);
      });
    }
  }, [db, gameId, player])

  const turn = (element) => {
    if ((board[parseInt(element.id)] === "") && canrun) {
      if (opponent === 'online') {
        if (player === 1) {
          setPlayer(player + 1);
          setBoard(ps => {
            ps[parseInt(element.id)] = 'X';
            return [...ps]
          });
        } else if (player === 2) {
          setPlayer(player - 1);
          setBoard(ps => {
            ps[parseInt(element.id)] = 'O';
            return [...ps]
          });
        }
      }

      else if (opponent === 'twoPlayer') {
        setGameId(undefined);
        if (player === 1) {
          setPlayer(player + 1);
          setBoard(ps => {
            ps[parseInt(element.id)] = 'X';
            return [...ps]
          });
        } else if (player === 2) {
          setPlayer(player - 1);
          setBoard(ps => {
            ps[parseInt(element.id)] = 'O';
            return [...ps]
          });
        }
      }

      else if (opponent === 'ai') {
        element.setAttribute('name', 'checked');
        element.firstElementChild.textContent = 'X';
        element.firstElementChild.setAttribute('class', 'cross');
        board[parseInt(element.id)] = "X";
        // setBoard(ps => {
        //   ps[parseInt(element.id)] = 'X';
        //   return [...ps]
        // });
        computerTurn();
        RealWinner();
      }
    }
  }
  function computerTurn() {
    let numb = minimax(board, 'O').move;
    if (numb !== undefined) {
      board[numb] = "O";
      setBoard(board);

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
            document.getElementById('line').style.transform = 'translate(0,-157px) rotate(90deg)'
            break;
          case 1:
            console.log(1);
            document.getElementById('line').style.transform = 'translate(-136px,0) rotate(0deg)'
            break;
          case 2:
            console.log(2);
            break;
          case 3:
            console.log(3);
            document.getElementById('line').style.transform = 'translate(0px, -14px) rotate(90deg)'
            break;
          case 4:
            console.log(4);
            document.getElementById('line').style.transform = 'translate(142px,0) rotate(0deg)'
            break;
          case 5:
            console.log(5);
            document.getElementById('line').style.transform = 'translate(0px, 126px) rotate(90deg)'
            break;
          case 6:
            console.log(6);
            document.getElementById('line').style.transform = 'rotate(-45deg) scaleY(1.3)'
            break;
          case 7:
            console.log(7);
            document.getElementById('line').style.transform = 'rotate(45deg) scaleY(1.3)'
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
    setBoard(["", "", "", "", "", "", "", "", ""])
    setPlayer(1);
  }

  const saveData = (event) => {
    event.preventDefault();
    setShowJoinOptions(false);
    const id = document.getElementById('idOfGame').value;
    setGameId(id);
  }

  return (
    <>
      <p id="result"></p>
      <div className="cantainer">
        <div className="line" id="line"></div>
        <div className="rows">
          <button className="box" id="0" onClick={(event) => { turn(event.target) }}><span>{board[0]}</span></button>
          <button className="box" id="1" onClick={(event) => { turn(event.target) }}><span>{board[1]}</span></button>
          <button className="box" id="2" onClick={(event) => { turn(event.target) }}><span>{board[2]}</span></button>
        </div>
        <div className="rows">
          <button className="box" id="3" onClick={(event) => { turn(event.target) }}><span>{board[3]}</span></button>
          <button className="box" id="4" onClick={(event) => { turn(event.target) }}><span>{board[4]}</span></button>
          <button className="box" id="5" onClick={(event) => { turn(event.target) }}><span>{board[5]}</span></button>
        </div>
        <div className="rows">
          <button className="box" id="6" onClick={(event) => { turn(event.target) }}><span>{board[6]}</span></button>
          <button className="box" id="7" onClick={(event) => { turn(event.target) }}><span>{board[7]}</span></button>
          <button className="box" id="8" onClick={(event) => { turn(event.target) }}><span>{board[8]}</span></button>
        </div>
      </div>
      {opponent === 'online' ? (
        <div>
          <button className="restart" onClick={() => { setShowJoinOptions(true); setPurpose('Join'); }}>Join</button>
          <button className="restart" onClick={() => { setShowJoinOptions(true); setPurpose('Create'); }}>Create</button>
        </div>
      ) : (
        <></>
      )}
      <button className="restart" onClick={restart}>Restart</button>
      {showJoinOptions ? (
        <ShowJoinOptions purpose={purpose} saveData={saveData} setShowJoinOptions={setShowJoinOptions} />
      ) : (
        <div></div>
      )}

    </>
  );
}

export default App;
