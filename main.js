import React from 'react';
import ReactDOM from 'react-dom';
import style from './style.css';

function Square(props) {
  const winColor = 'lightgreen';
  const style = {
    backgroundColor: props.win ? winColor : ''
  };

  return (
    <button
      style={style}
      className="square"
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const win = this.props.winMoves &&
                this.props.winMoves.indexOf(i) !== -1;
    return (
      <Square
        key={i}
        win={win}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let board = [];
    for (let i = 0; i < 3; i += 1) {
      let row = [];
      for (let j = 0; j < 3; j += 1) {
        row.push(this.renderSquare(j + i * 3));
      }
      board.push(<div key={i} className="board-row">{row}</div>);
    }
    return (
      <div>
        <div className="status">{status}</div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastMove: {
          x: null,
          y: null
        },
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares,
        lastMove: {
          x: i % 3 + 1,
          y: Math.floor(i / 3 + 1)
        },
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, n) => {
      const desc = n ?
        ((n % 2 ? 'X' : 'O') + ' at (' +
         step.lastMove.x + ', ' + step.lastMove.y + ')') :
        'Game start';
      const style = {
        fontWeight: this.state.stepNumber === n ? 'bold' : ''
      };
      return (
        <li key={n}>
          <a
            href="#"
            style={style}
            onClick={() => this.jumpTo(n)}
          >
            {desc}
          </a>
        </li>
      );
    });

    let status;
    let winMoves;
    if (winner) {
      status = 'Winner: ' + winner.player;
      winMoves = winner.moves;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winMoves={winMoves}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], moves: lines[i] };
    }
  }
  return null;
}
