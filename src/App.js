import './App.css';
import { useState } from 'react';

function Square(props) {
	return <button
		onClick={props.handleNewMark}
		data-testid={'square'+props.squareNum}
	>
		{props.mark}
	</button>
}

function Board(props) {
	let squares = [];
	for (let i = 0, len = 9; i < len; i++) {
		squares.push(
			<Square
				mark={props.marks[i]}
				handleNewMark={() => props.handleNewMark(i)}
				key={i}
				squareNum={i}
			/>
		);
	}
	return <div className="board" data-testid="board">{squares}</div>;
}

function TicTacToe() {
	const [ history, setHistory ] = useState([{
		marks: Array(9).fill(null)
	}]);
	const [ xIsNext, setXIsNext ] = useState(true);
	const [ turnNum, setTurnNum ] = useState(0);

	const marks = history[turnNum].marks;

	function handleNewMove(numSquare) {
		if (marks[numSquare] || getWinner(marks)) return;
		let newMarks = Array.from(marks);
		newMarks[numSquare] = xIsNext ? 'X' : 'O';
		const newHistory = history.slice(0, turnNum+1);
		newHistory.push({ marks: newMarks });
		setHistory(newHistory);
		setTurnNum(turnNum+1);
		setXIsNext(!xIsNext);
	};

	function handleResetGame() {
		setHistory([{
			marks: Array(9).fill(null),
			xIsNext: true,
		}]);
		setTurnNum(0);
		setXIsNext(true);
	};

	function jumpToTurn(targetTurn) {
		setTurnNum(targetTurn);
		setXIsNext((targetTurn % 2) === 0);
	}

	const winner = getWinner(marks);
	let status = '';
	if (winner) {
		status = 'Winner: ' + winner;
	} else {
		status = 'Move: ' + (xIsNext ? 'X' : 'O');
	}

	let turnsListItems = [];
	for (let i = 0, len = history.length; i < len; i++) {
		const turnText = (i === 0) ? 'Go to start' : ('Go to turn ' + i);
		turnsListItems.push(
			<li key={i}>
				<button onClick={() => jumpToTurn(i)}>{turnText}</button>
			</li>
		);
	}

	return (
		<div style={{marginLeft: 12}}>
			<h1>Tic-Tac-Toe</h1>
			<div style={{display: 'flex'}}>
				<div>
					<Board marks={marks} handleNewMark={handleNewMove}/>
					<button onClick={handleResetGame} style={{marginTop: 12}}>Reset</button>
				</div>
				<div style={{marginLeft: 12}}>
					<div>{status}</div>
					<ol>
						{turnsListItems}
					</ol>
				</div>
			</div>
		</div>
	);
}

export function getWinner(marks) {
	const winningLines = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6]
	];

	for (const [match1, match2, match3] of winningLines) {
		// mark = 'X' or 'O' or null
		const mark1 = marks[match1];
		const mark2 = marks[match2];
		const mark3 = marks[match3];
		if (!mark1) continue;
		if ((mark1 === mark2) && (mark2 === mark3)) {
			// 'X' or 'O'
			return mark1;
		}
	};
}

function App() {
  return (
    <div>
			<TicTacToe/>
    </div>
  );
}

export default App;
