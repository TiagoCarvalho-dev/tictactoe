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

  const chooseFirstPlayerToMove = () => {
    let firstMove = Math.floor(Math.random() * 2);
    if(firstMove === 1) {
      activePlayer = players[0];
    } else {
      activePlayer = players[1];
    }
  }

  let activePlayer;

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const getActivePlayer = () => activePlayer;

  const playGame = (playerOne, playerTwo, vsComputer) => {
    gameUI.changeGameInformation('May the best player win');
    gameUI.removeBoardUI();
    gameUI.buildBoardUI(playerOne, playerTwo, vsComputer, board.getBoard());
  }

  const playRoundVsPlayer = (row, column) => {
    gameUI.changePlayerTurnInformation(activePlayer, players);
    if(board.getBoard()[row][column] !== '') {
      gameUI.changeGameInformation('Square already taken, please choose another one.');
      return
    }
    gameUI.changeGameInformation('');
    playerTurn(row, column);
    checkResult();
    switchActivePlayer();
  }

  const playRoundVsComputer = (row, column, vsComputer) => {
    if(board.getBoard()[row][column] !== '') {
      gameUI.changeGameInformation('Square already taken, please choose another one.');
      return
    }
    gameUI.changeGameInformation('');
    playerTurn(row, column);
    checkResult(vsComputer);
    if(victoriousPlayer !== 0) return;
    setTimeout(() => {
      computerTurn();
      checkResult(vsComputer);
    }, 700);
    if(victoriousPlayer !== 0) return;
  }

  const playerTurn = (row, column) => {
    board.markSquare(activePlayer.marker, row, column, board.getBoard());
    gameUI.showSquareValue(row, column, board.getBoard());
  }

  const computerTurn = () => {
    board.markRandomSquare();
    gameUI.showSquareValue(board.getRandomRowValue(), board.getRandomColumnValue(), board.getBoard());
  }

  const checkResult = (vsComputer) => {
    checkBoard(board.getBoard());
    if(victoriousPlayer !== 0) {
      displayResult(vsComputer);
      gameUI.playAgainButton();
      disableBoard();
    }
  }

  let victoriousPlayer = 0;

  const checkBoard = (board) => {
    for(let i = 0; i < 3; i++) {
      if(board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        if(board[i][0] === 'X') return victoriousPlayer = players[0];
        if(board[i][0] === 'O') return victoriousPlayer = players[1];
      } else if(board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        if(board[0][i] === 'X') return victoriousPlayer = players[0];
        if(board[0][i] === 'O') return victoriousPlayer = players[1];
      }
    }
    if((board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
       (board[0][2] === board[1][1] && board[1][1] === board[2][0])) {
        if(board[1][1] === 'X') return victoriousPlayer = players[0];
        if(board[1][1] === 'O') return victoriousPlayer = players[1];
    }
    if(board[0][0] !== '' && board[0][1] !== '' && board[0][2] !== '' &&
       board[1][0] !== '' && board[1][1] !== '' && board[1][2] !== '' &&
       board[2][0] !== '' && board[2][1] !== '' && board[2][2] !== '') {
      return victoriousPlayer = 'No one';
    }
  }

  const displayResult = (vsComputer) => {
    if(vsComputer) {
      if(victoriousPlayer === 'No one') {
        return gameUI.changeGameInformation(`The game ended in a Draw!`);
      } else if (victoriousPlayer === players[0]) {
        return gameUI.changeGameInformation(`Congratulations ${victoriousPlayer.name}, you WON!`);
      } else {
        return gameUI.changeGameInformation('Better luck next time, you LOST!');
      }
    } else {
      if(victoriousPlayer === 'No one') {
        return gameUI.changeGameInformation(`The game ended in a Draw!`);
      } else {
        return gameUI.changeGameInformation(`Congratulations ${victoriousPlayer.name}, you WON!`);
      }
    }
  }

  const disableBoard = () => document.querySelectorAll('.board-container button').forEach(button => button.disabled = true);

  return {playGame, playRoundVsPlayer, playRoundVsComputer, getActivePlayer, chooseFirstPlayerToMove};
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
        newButton.addEventListener('click', () => gameLoop.playRoundVsComputer(newButton.dataset.row, newButton.dataset.column, vsComputer));
      } else {
        gameLoop.chooseFirstPlayerToMove();
        playerTurnInformation.textContent = `It\'s ${gameLoop.getActivePlayer().name}'s turn`;
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
  let playerOneVsComputer = document.querySelector('#player-one-vs-computer');
  const mainGame = document.querySelector('.main-game');
  let playerOne = document.querySelector('#player-one');
  let playerTwo = document.querySelector('#player-two');
  const playerOneConfirm = document.querySelector('.player-one-confirm-button');
  const playerTwoConfirm = document.querySelector('.player-two-confirm-button');
  const playAgain = document.querySelector('.play-again-button');
  const gameInformation = document.querySelector('.game-information');
  const playerTurnInformation = document.querySelector('.player-turn-information');

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
    playerOneName = playerOne.value;
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
    playerTwoName = playerTwo.value;
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

  const playAgainButton = () => {
    playAgain.classList.remove('hidden');
    playerTurnInformation.textContent = '';
    playAgain.addEventListener('click', () => {
    mainGame.classList.add('hidden');
    gameModeContainer.classList.remove('hidden');
    playAgain.classList.add('hidden');
    resetPlayerInformation();
    playGameButton();
  })};

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

  const changeGameInformation = (message) => {
    gameInformation.textContent = message;
  }

  const changePlayerTurnInformation = (activePlayer, players) => {
    if(activePlayer === players[0]) {
      playerTurnInformation.textContent = `It\'s ${players[1].name}'s turn`;
    } else {
      playerTurnInformation.textContent = `It\'s ${players[0].name}'s turn`;
    }
  }

  return {buildBoardUI, removeBoardUI, showSquareValue, playGameButton, playAgainButton, changeGameInformation, changePlayerTurnInformation};
}

GameUI().playGameButton();