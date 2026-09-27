import { useState } from "react";
import "./TicTacToe.css";

function calculateWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(board);

  const handleClick = (i) => {
    if (winner || board[i]) return;

    const next = board.slice();
    next[i] = xIsNext ? "X" : "O";
    setBoard(next);
    setXIsNext(!xIsNext);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <section className="tictactoe-app">
      <header>
        <h2>Tic Tac Toe</h2>
        <small>{winner ? `Winner: ${winner}` : `Next: ${xIsNext ? 'X' : 'O'}`}</small>
      </header>

      <div className="board">
        {board.map((cell, i) => (
          <button key={i} className="cell" onClick={() => handleClick(i)}>
            {cell}
          </button>
        ))}
      </div>

      <div className="game-actions">
        <button onClick={reset}>Restart</button>
      </div>
    </section>
  );
}

export default TicTacToe;
