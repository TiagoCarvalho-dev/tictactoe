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

  const markSquare = (playerMarker, row, column, board) => board[row][column] = playerMarker;

  let randomRow;
  let randomColumn;
  
  const markRandomSquare = () => {
    randomRow = Math.floor(Math.random() * 3);
    randomColumn = Math.floor(Math.random() * 3);
    if(board[randomRow][randomColumn] !== '') {
      markRandomSquare();
    } else {
    board[randomRow][randomColumn] = 'O';
    }
  }

  const getRandomRowValue = () => randomRow;
  const getRandomColumnValue = () => randomColumn;

  return {getBoard, markSquare, markRandomSquare, getRandomRowValue, getRandomColumnValue};
}

const GameLoop = function(playerOne = 'Player One', playerTwo = 'Player Two') {
  const board = Board();
  const gameUI = GameUI();

  const players = [{
    name: playerOne,
    marker: 'X'
  },
  {
    name: playerTwo,
    marker: 'O'
  }];

  let activePlayer = players[0];

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const playGame = (playerOne, playerTwo, vsComputer) => {
    console.log('Hello');
    gameUI.removeBoardUI();
    gameUI.buildBoardUI(playerOne, playerTwo, vsComputer, board.getBoard());
  }

  const playRoundVsPlayer = (row, column) => {
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
      gameUI.playAgainButton();
      return
    }
    switchActivePlayer();
  }

  const playRoundVsComputer = (row, column) => {
    if(board.getBoard()[row][column] !== '') {
      console.log('Square already taken, please choose another one.');
      return
    }
    board.markSquare(activePlayer.marker, row, column, board.getBoard());
    gameUI.showSquareValue(row, column, board.getBoard());
    checkResult(board.getBoard());
    if(victoriousPlayer !== 0) {
      displayResultVsComputer();
      endGame();
      gameUI.playAgainButton();
      return;
    }
    board.markRandomSquare();
    gameUI.showSquareValue(board.getRandomRowValue(), board.getRandomColumnValue(), board.getBoard());
    checkResult(board.getBoard());
    if(victoriousPlayer !== 0) {
      displayResultVsComputer();
      endGame();
      gameUI.playAgainButton();
      return;
    }
  }

  let victoriousPlayer = 0;

  const checkResult = (board) => {
    for(let i = 0; i < 3; i++) {
      if(board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        if(board[i][0] === 'X') victoriousPlayer = players[0];
        if(board[i][0] === 'O') victoriousPlayer = players[1];
      } else if(board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        if(board[0][i] === 'X') victoriousPlayer = players[0];
        if(board[0][i] === 'O') victoriousPlayer = players[1];
      }
    }
    if((board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
       (board[0][2] === board[1][1] && board[1][1] === board[2][0])) {
        if(board[1][1] === 'X') victoriousPlayer = players[0];
        if(board[1][1] === 'O') victoriousPlayer = players[1];
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

  const displayResultVsComputer = () => {
    if(victoriousPlayer === 'No one') {
      return console.log(`The game ended in a Draw!`);
    } else if(victoriousPlayer === players[0]) {
      return console.log(`Congratulations ${victoriousPlayer.name}, you WON!`);
    } else {
      return console.log(`Better luck next time ${players[0].name}, you LOST!`)
    }
  }

  const endGame = () => document.querySelectorAll('.board-container button').forEach(button => button.disabled = true);

  return {playGame, playRoundVsPlayer, playRoundVsComputer};
}

const GameUI = function() {
  const boardContainer = document.querySelector('.board-container');

  const buildBoardUI = (playerOne, playerTwo, vsComputer, board) => {
    const gameLoop = GameLoop(playerOne, playerTwo);

    board.forEach((row, rowIndex) => row.forEach((column, columnIndex) => {
      const newDiv = boardContainer.appendChild(document.createElement('div'));
      const newButton = newDiv.appendChild(document.createElement('button'));
      newButton.dataset.row = rowIndex;
      newButton.dataset.column = columnIndex;
      newButton.textContent = board[rowIndex][columnIndex];
      if(vsComputer) {
        newButton.addEventListener('click', () => gameLoop.playRoundVsComputer(newButton.dataset.row, newButton.dataset.column));
      } else {
        newButton.addEventListener('click', () => gameLoop.playRoundVsPlayer(newButton.dataset.row, newButton.dataset.column));
      }
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

  const gameModeContainer = document.querySelector('.game-mode-container');
  const playerNamesContainer = document.querySelector('.player-names-container');
  const playerNameVsComputerContainer = document.querySelector('.player-name-vs-computer-container');
  const playerOneVsComputer = document.querySelector('#player-one-vs-computer');
  const mainGame = document.querySelector('.main-game');
  const playerOne = document.querySelector('#player-one');
  const playerTwo = document.querySelector('#player-two');
  const playerOneConfirm = document.querySelector('.player-one-confirm-button');
  const playerTwoConfirm = document.querySelector('.player-two-confirm-button');

  const playGameButton = () => document.querySelector('.play-game-button').addEventListener('click', () => {
    document.querySelector('.welcome-container').classList.add('hidden');
    gameModeContainer.classList.remove('hidden');
    vsPlayerButton();
    vsComputerButton();
  });

  const vsPlayerButton = () => document.querySelector('.vs-player').addEventListener('click', () => {
    gameModeContainer.classList.add('hidden');
    playerNamesContainer.classList.remove('hidden');
    playerOneConfirmButton();
    playerTwoConfirmButton();
  });

  const vsComputerButton = () => document.querySelector('.vs-computer').addEventListener('click', () => {
    let vsComputer = true;
    gameModeContainer.classList.add('hidden');
    playerNameVsComputerContainer.classList.remove('hidden');
    playerOneVsComputerConfirmButton(vsComputer);
  });

  const playerOneVsComputerConfirmButton = (vsComputer) => {
    document.querySelector('.player-one-vs-computer-confirm-button').addEventListener('click', () => {
    playerOneName = playerOneVsComputer.value;
    playerNameVsComputerContainer.classList.add('hidden');
    mainGame.classList.remove('hidden');
    GameLoop().playGame(playerOneName, '', vsComputer);
  })};

  let playerOneName;
  let playerTwoName;

  const playerOneConfirmButton = () => playerOneConfirm.addEventListener('click', () => {
    playerOne = playerOne.value;
    if(playerTwoConfirm.textContent === 'Confirm') {
      playerOneConfirm.textContent = 'Waiting for player two';
      playerOne.disabled = true;
      playerOneConfirm.disabled = true;
    } else {
      playerNamesContainer.classList.add('hidden');
      mainGame.classList.remove('hidden');
      GameLoop().playGame(playerOneName, playerTwoName);
    }
  });

  const playerTwoConfirmButton = () => playerTwoConfirm.addEventListener('click', () => {
    playerTwo = playerTwo.value;
    if(playerOneConfirm.textContent === 'Confirm') {
      playerTwoConfirm.textContent = 'Waiting for player one';
      playerTwo.disabled = true;
      playerTwoConfirm.disabled = true;
    } else {
      playerNamesContainer.classList.add('hidden');
      mainGame.classList.remove('hidden');
      GameLoop().playGame(playerOneName, playerTwoName);
    }
  });

  const playAgainButton = () => document.querySelector('.play-again-button').addEventListener('click', () => {
    mainGame.classList.add('hidden');
    gameModeContainer.classList.remove('hidden');
    resetPlayerInformation();
    playGameButton();
  });

  const resetPlayerInformation = () => {
    playerOneVsComputer.value = '';
    playerOne.value = '';
    playerTwo.value = '';
    playerOneConfirm.disabled = false;
    playerTwoConfirm.disabled = false;
    playerOne.disabled = false;
    playerTwo.disabled = false;
    playerOneConfirm.textContent = 'Confirm';
    playerTwoConfirm.textContent = 'Confirm';
  }

  return {buildBoardUI, removeBoardUI, showSquareValue, playGameButton, playAgainButton};
}

GameUI().playGameButton();