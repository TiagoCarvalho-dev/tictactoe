const Board = function() {
  const rows = 3;
  const column = 3;
  const board = [];

  for(let i = 0; i < rows; i++) {
    board.push([]);
    for(let j = 0; j < column; j++) {
      board[i].push('');
    }
  }

  const getBoard = () => board;

  const markSquare = function(playerMarker, row, column, board) {
    board[row][column] = playerMarker;
  }

  return {getBoard, markSquare};
}

const Players = function() {
  const players = [{
    name: 'PlayerOne',
    marker: 1
  },
  {
    name: 'PlayerTwo',
    marker: 2
  }];

  const getPlayers = () => players;

  return {getPlayers};
}

const GameLoop = function() {
  const board = Board();
  const players = Players();
  const gameUI = GameUI();

  let activePlayer = players.getPlayers()[0];

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players.getPlayers()[0] ? players.getPlayers()[1] : players.getPlayers()[0];
  }

  const playGame = () => {
    console.log('Hello, let\'s play');
    gameUI.buildBoardUI(board.getBoard());
  }

  const playRound = (row, column) => {
    if(board.getBoard()[row][column] !== '') {
      console.log('Square already taken, please choose another one.');
      return
    }
    board.markSquare(activePlayer.marker, row, column, board.getBoard());
    gameUI.showSquareValue(row, column, board.getBoard());
    checkResult(board.getBoard());
    if(victoriousPlayer !== 0) {
      displayResult();
    }
    switchActivePlayer();
  }

  let victoriousPlayer = 0;

  const checkResult = (board) => {
    for(let i = 0; i < 3; i++) {
      if(board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        if(board[i][0] === 1) victoriousPlayer = players.getPlayers()[0];
        if(board[i][0] === 2) victoriousPlayer = players.getPlayers()[1];
      } else if(board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        if(board[0][i] === 1) victoriousPlayer = players.getPlayers()[0];
        if(board[0][i] === 2) victoriousPlayer = players.getPlayers()[1];
      }
    }
    if((board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
       (board[0][2] === board[1][1] && board[1][1] === board[2][0])) {
        if(board[1][1] === 1) victoriousPlayer = players.getPlayers()[0];
        if(board[1][1] === 2) victoriousPlayer = players.getPlayers()[1];
    }
    if(board[0][0] > 0 && board[0][1] > 0 && board[0][2] > 0 &&
       board[1][0] > 0 && board[1][1] > 0 && board[1][2] > 0 &&
       board[2][0] > 0 && board[2][1] > 0 && board[2][2] > 0) {
      return victoriousPlayer = 'No one';
    }
  }

  const displayResult = () => {
    if(victoriousPlayer === 'No one') {
      return console.log(`The game ended in a Draw!`);
    } else {
      return console.log(`Congratulations ${victoriousPlayer.name}, you WON!`);
    }
  }

  return {playGame, playRound};
}

const GameUI = function() {

  const buildBoardUI = (board) => {
    const gameLoop = GameLoop();
    const boardContainer = document.querySelector('.board-container');

    board.forEach((row, rowIndex) => row.forEach((column, columnIndex) => {
      const newDiv = boardContainer.appendChild(document.createElement('div'));
      const newButton = newDiv.appendChild(document.createElement('button'));
      newButton.dataset.row = rowIndex;
      newButton.dataset.column = columnIndex;
      newButton.textContent = board[rowIndex][columnIndex];
      newButton.addEventListener('click', () => gameLoop.playRound(newButton.dataset.row, newButton.dataset.column));
    }));
  }

  const showSquareValue = (row, column, board) => {
    document.querySelector(`[data-row='${row}'][data-column='${column}']`).textContent = board[row][column];
  }

  return {buildBoardUI, showSquareValue};
}