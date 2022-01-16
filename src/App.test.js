import { render, screen } from '@testing-library/react';
import App, { getWinner } from './App';

const allWinLines = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,3,6],
	[1,4,7],
	[2,5,8],
	[0,4,8],
	[2,4,6]
];

test('renders Tic-Tac-Toe', () => {
  render(<App />);
  const title = screen.getByText(/Tic-Tac-Toe/i);
  expect(title).toBeInTheDocument();
});

describe('on the first turn', () => {
	test('x goes first', () => {
		render(<App />);
		const moveStatus = screen.getByText('Move: X');
		expect(moveStatus).toBeInTheDocument();
	});

	describe('x can put their mark anywhere', () => {
		for (let i = 0, len = 9; i < len; i++) {
			test(`on square${i}`, () => {
				render(<App />);
				const square = screen.getByTestId('square'+i);
				square.click();
				expect(square).toHaveTextContent('X');
			});
		}
	});
});

describe('x can win', () => {
	const winSquares = [0,1,2];
	testWin(winSquares, 'x');
});

describe('o can win', () => {
	const winSquares = [0,1,2];
	testWin(winSquares, 'o');
});

describe('x can win everyway', () => {
	allWinLines.forEach(winLine => {
		testWin(winLine, 'x');
	});
});

describe('o can win everyway', () => {
	allWinLines.forEach(winLine => {
		testWin(winLine, 'o');
	});
});

describe('getWinner() returns right winner', () => {
	function testWin(winLine, winner) {
		test(winner + ' wins with ' + winLine, () => {
			const board = lineToBoard(winLine, winner);
			expect(getWinner(board)).toEqual(winner);
		});
	}

	describe('x combinations', () => {
		allWinLines.forEach(line => testWin(line, 'x'));
	});

	describe('o combinations', () => {
		allWinLines.forEach(line => testWin(line, 'o'));
	});

	function testLoss(loseLine, loser) {
		test(loser + ' loses with ' + loseLine, () => {
			const board = lineToBoard(loseLine, loser);
			expect(getWinner(board)).not.toEqual(loser === 'x' ? 'o' : 'x');
		});
	}

	function testBothLose(loseLine) {
		describe('with ' + loseLine, () => {
			testLoss(loseLine, 'x');
			testLoss(loseLine, 'o');
		});
	}

	describe('no one wins', () => {
		test('with no moves', () => {
			const board = lineToBoard([]);
			expect(getWinner(board)).toBeFalsy();
		});

		allWinLines.slice().forEach(winLine => {
			for (let i = 0, len = winLine.length - 1; i < len; i++) {
				testBothLose(winLine.slice(0, i+1));
			}
		})
	});

});

function testWin(winSquares, winner) {
	const allSquares = [0,1,2,3,4,5,6,7,8];
	const leftoverSquares = allSquares.filter(square => !winSquares.includes(square));
	// These are squares the loser can pick from to let the winner win. From the
	// squares that remain after reserving the win squares for the winning
	// player, the losing player can garuntee losing as long as they pick only
	// even or only odd from the remaining squares.
	// Algorithm credit: Vicky ♡
	let loseSquares = leftoverSquares.filter(square => (square % 2 === 0));
	if (loseSquares.length === 2) {
		loseSquares = leftoverSquares.filter(square => (square % 2 === 1));
	}

	test(`${winner} wins with ${winSquares}`, () => {
		// console.log({ allSquares, leftoverSquares, winSquares, loseSquares });
		render(<App />);

		for (let i = 0, len = winSquares.length; i < len; i++) {
			const squareXId = 'square' + (winner === 'x' ? winSquares[i] : loseSquares[i]);
			const squareX = screen.getByTestId(squareXId);
			squareX.click();
			const squareOId = 'square' + (winner === 'o' ? winSquares[i] : loseSquares[i]);
			const squareO = screen.getByTestId(squareOId);
			squareO.click();
		}

		const winnerStatus = screen.getByText('Winner: '+ winner.toUpperCase());
		expect(winnerStatus).toBeInTheDocument();
	});
}

function lineToBoard(line, mark) {
	let board = Array(9).fill(null);
	line.forEach(square => {
		board[square] = mark;
	});
	return board;
}

