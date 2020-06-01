const WALL = 'WALL';
const FLOOR = 'FLOOR';
const BALL = 'BALL';
const GAMER = 'GAMER';

const GAMER_IMG = '<img src="img/gamer.png" />';
const BALL_IMG = '<img src="img/ball.png" />';
var audio = new Audio('sounds/pop.wav');

var gBoard;
var gGamerPos;
var collectedBalls = 0
var intervalId = 0
function initGame() {
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);
	randomBallAtInterval()
	var restartButton = document.querySelector('body .restart')
	restartButton.style.display = 'none'
}


function buildBoard() {
	// Create the Matrix
	// var board = createMat(10, 12)
	var board = new Array(10);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(12);
	}

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}

			// place openings to the side and top
			if ((i === 5 && j === 0) || (i === 5 && j === 11) || (i === 0 && j === 5) || (i === 9 && j === 5)) cell.type = FLOOR;

			// Add created cell to The game board
			board[i][j] = cell;
		}
	}

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	console.log(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// TODO - change to short if statement
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			//TODO - Change To ES6 template string
			strHTML += '\t<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			// TODO - change to switch case statement
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	console.log('strHTML is:');
	// console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {

	//moving to other side of board
	if ((i === 5 && j === -1) || (i === 5 && j === 12) || (i === -1 && j === 5) || (i === 10 && j === 5)) {
		if (i === 5 && j === -1) j = 11;
		if (i === 5 && j === 12) j = 0;
		if (i === -1 && j === 5) i = 9;
		if (i === 10 && j === 5) i = 0;
		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);
	}



	var elCollectedBallsCount = document.querySelector('body h2')
	console.log(gBoard)
	var targetCell = gBoard[i][j];
	console.log(targetCell)
	console.log('i=', i, 'j=', j)
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);
	console.log(iAbsDiff, jAbsDiff)

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

		if (targetCell.gameElement === BALL) {
			collectedBalls++
			elCollectedBallsCount.innerText = 'Collected ' + collectedBalls + ' Balls!';

			console.log('Collecting!');

		}


		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);

	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);
	if (isGameOver()) {
		elCollectedBallsCount.innerText = 'Well done!!! the game is over and you won! You collected ' + collectedBalls + ' balls!!!'
		var restartButton = document.querySelector('body .restart')
		restartButton.style.display = ''


	}

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function randomBallAtInterval() {
	intervalId = setInterval(function () {
		var randomI = getRandomIntInclusive(1, 8)
		var randomJ = getRandomIntInclusive(1, 10)
		// Model
		if (gBoard[randomI][randomJ].gameElement === !null) {
			var IJ = findAvailableCell()
			rendomI = iJ.i
			randomJ = iJ.j

			gBoard[randomI][randomJ].gameElement = BALL;
		} else {
			gBoard[randomI][randomJ].gameElement = BALL;

		}
		// DOM
		renderCell({ i: randomI, j: randomJ }, BALL_IMG);

		// var elH1 = document.querySelector('h1');
		// elH1.innerText = 'I love JS!';
	}, 1000)

}

function isGameOver() {
	var ballsLeft = 0
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			if (gBoard[i][j].gameElement === BALL) {
				ballsLeft++
			}
		}
	}
	if (ballsLeft === 0) {
		clearInterval(intervalId)
		return true;
	}
}

function findAvailableCell() {
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			if (gBoard[i][j].gameElement === null) return { i: i, j: j };

		}
	}
	clearInterval(intervalId)

}


function timer() {
    var elStopWatch = document.querySelector('.stopwatch')
    gTimerInterval = setInterval(function () {
        gTimer++
        elStopWatch.innerHTML = gTimer / 100
            , 10000
    });

}