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
    name: GameMenuUI().getPlayerOne(),
    marker: 'X'
  },
  {
    name: GameMenuUI().getPlayerTwo(),
    marker: 'O'
  }];

  const getPlayers = () => players;

  return {getPlayers};
}

const GameLoop = function() {
  const board = Board();
  const players = Players();
  const gameUI = GameUI();
  const gameMenuUI = GameMenuUI();

  let activePlayer = players.getPlayers()[0];

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players.getPlayers()[0] ? players.getPlayers()[1] : players.getPlayers()[0];
  }

  const playGame = () => {
    console.log('Hello, let\'s play');
    gameUI.removeBoardUI();
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
      endGame();
      gameMenuUI.playAgainButton();
    }
    switchActivePlayer();
  }

  let victoriousPlayer = 0;

  const checkResult = (board) => {
    for(let i = 0; i < 3; i++) {
      if(board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        if(board[i][0] === 'X') victoriousPlayer = players.getPlayers()[0];
        if(board[i][0] === 'O') victoriousPlayer = players.getPlayers()[1];
      } else if(board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        if(board[0][i] === 'X') victoriousPlayer = players.getPlayers()[0];
        if(board[0][i] === 'O') victoriousPlayer = players.getPlayers()[1];
      }
    }
    if((board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
       (board[0][2] === board[1][1] && board[1][1] === board[2][0])) {
        if(board[1][1] === 'X') victoriousPlayer = players.getPlayers()[0];
        if(board[1][1] === 'O') victoriousPlayer = players.getPlayers()[1];
    }
    if(board[0][0] !== '' && board[0][1] !== '' && board[0][2] !== '' &&
       board[1][0] !== '' && board[1][1] !== '' && board[1][2] !== '' &&
       board[2][0] !== '' && board[2][1] !== '' && board[2][2] !== '') {
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

  const endGame = () => document.querySelectorAll('.board-container button').forEach(button => button.disabled = true);

  return {playGame, playRound};
}

const GameUI = function() {
  const boardContainer = document.querySelector('.board-container');

  const buildBoardUI = (board) => {
    const gameLoop = GameLoop();

    board.forEach((row, rowIndex) => row.forEach((column, columnIndex) => {
      const newDiv = boardContainer.appendChild(document.createElement('div'));
      const newButton = newDiv.appendChild(document.createElement('button'));
      newButton.dataset.row = rowIndex;
      newButton.dataset.column = columnIndex;
      newButton.textContent = board[rowIndex][columnIndex];
      newButton.addEventListener('click', () => gameLoop.playRound(newButton.dataset.row, newButton.dataset.column));
    }));
  }

  const removeBoardUI = () => {
    while(boardContainer.firstChild) {
      boardContainer.removeChild(boardContainer.lastChild);
    }
  }

  const showSquareValue = (row, column, board) => {
    document.querySelector(`[data-row='${row}'][data-column='${column}']`).textContent = board[row][column];
  }

  return {buildBoardUI, removeBoardUI, showSquareValue};
}

const GameMenuUI = function() {
  let playerOne;
  let playerTwo;

  const getPlayerOne = () => playerOne;
  const getPlayerTwo = () => playerTwo;

  const playGameButton = () => document.querySelector('.play-game-button').addEventListener('click', () => {
    document.querySelector('.welcome-container').classList.add('hidden');
    document.querySelector('.game-mode-container').classList.remove('hidden');
    vsPlayerButton();
  });

  const vsPlayerButton = () => document.querySelector('.vs-player').addEventListener('click', () => {
    document.querySelector('.game-mode-container').classList.add('hidden');
    document.querySelector('.player-names-container').classList.remove('hidden');
    playerOneConfirmButton();
    playerTwoConfirmButton();
  });

  const playerOneConfirmButton = () => document.querySelector('.player-one-confirm-button').addEventListener('click', () => {
    playerOne = document.querySelector('#player-one').value;
    Players().getPlayers()[0].name = playerOne;
    if(document.querySelector('.player-two-confirm-button').textContent === 'Confirm') {
      document.querySelector('.player-one-confirm-button').textContent = 'Waiting for player two';
      document.querySelector('#player-one').disabled = true;
      document.querySelector('.player-one-confirm-button').disabled = true;
    } else {
      document.querySelector('.player-names-container').classList.add('hidden');
      document.querySelector('.main-game').classList.remove('hidden');
      GameLoop().playGame();
    }
  });

  const playerTwoConfirmButton = () => document.querySelector('.player-two-confirm-button').addEventListener('click', () => {
    playerTwo = document.querySelector('#player-two').value;
    Players().getPlayers()[1].name = playerTwo;
    if(document.querySelector('.player-one-confirm-button').textContent === 'Confirm') {
      document.querySelector('.player-two-confirm-button').textContent = 'Waiting for player one';
      document.querySelector('#player-two').disabled = true;
      document.querySelector('.player-two-confirm-button').disabled = true;
    } else {
      document.querySelector('.player-names-container').classList.add('hidden');
      document.querySelector('.main-game').classList.remove('hidden');
      GameLoop().playGame();
    }
  });

  const playAgainButton = () => document.querySelector('.play-again-button').addEventListener('click', () => {
    document.querySelector('.main-game').classList.add('hidden');
    document.querySelector('.game-mode-container').classList.remove('hidden');
    resetPlayerInformation();
    playGameButton();
  });

  const resetPlayerInformation = () => {
    document.querySelector('#player-one').value = '';
    document.querySelector('#player-two').value = '';
    document.querySelector('.player-one-confirm-button').disabled = false;
    document.querySelector('.player-two-confirm-button').disabled = false;
    document.querySelector('#player-one').disabled = false;
    document.querySelector('#player-two').disabled = false;
    document.querySelector('.player-one-confirm-button').textContent = 'Confirm';
    document.querySelector('.player-two-confirm-button').textContent = 'Confirm';
  }

  return {playGameButton, playAgainButton, getPlayerOne, getPlayerTwo};
}

GameMenuUI().playGameButton();