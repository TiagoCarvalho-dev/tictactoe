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

const GameLoop = function(playerOne = 'PLAYER ONE', playerTwo = 'PLAYER TWO') {
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

  let activePlayer = players[0];

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const getActivePlayer = () => activePlayer;

  const playGame = (playerOne, playerTwo, vsComputer) => {
    gameUI.changeGameInformation('MAY THE BEST PLAYER WIN');
    gameUI.removeBoardUI();
    gameUI.buildBoardUI(playerOne, playerTwo, vsComputer, board.getBoard());
  }

  const playRoundVsPlayer = (row, column) => {
    if(board.getBoard()[row][column] !== '') {
      gameUI.changeGameInformation('SQUARE ALREADY TAKEN, PLEASE CHOOSE ANOTHER ONE');
      return
    }
    gameUI.changePlayerTurnInformation(activePlayer, players);
    document.querySelector('.game-information').classList.add('invisible');
    playerTurn(row, column);
    checkResult();
    switchActivePlayer();
  }

  const playRoundVsComputer = (row, column, vsComputer) => {
    if(board.getBoard()[row][column] !== '') {
      gameUI.changeGameInformation('SQUARE ALREADY TAKEN, PLEASE CHOOSE ANOTHER ONE');
      return
    }
    document.querySelector('.game-information').classList.add('invisible');
    playerTurn(row, column);
    toggleBoard('disable');
    checkResult(vsComputer);
    if(victoriousPlayer !== 0) return;
    setTimeout(() => {
      toggleBoard('enable');
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
      gameUI.nextGameButtons(vsComputer);
    }
  }

  let victoriousPlayer = 0;

  const checkBoard = (board) => {
    for(let i = 0; i < 3; i++) {
      if((board[i][0] === board[i][1] && board[i][1] === board[i][2]) &&
          board[i][0] !== '' && board[i][1] !== '' && board[i][2] !== '') {
        gameUI.markWinningSequence('row', i);
        if(board[i][0] === 'X') return victoriousPlayer = players[0];
        if(board[i][0] === 'O') return victoriousPlayer = players[1];
      } else if((board[0][i] === board[1][i] && board[1][i] === board[2][i]) &&
                 board[0][i] !== '' && board[1][i] !== '' && board[2][i] !== '') {
        gameUI.markWinningSequence('column', i);
        if(board[0][i] === 'X') return victoriousPlayer = players[0];
        if(board[0][i] === 'O') return victoriousPlayer = players[1];
      }
    }
    if((board[0][0] === board[1][1] && board[1][1] === board[2][2]) && 
        board[0][0] !== '' && board[1][1] !== '' && board[2][2] !== '') {
        gameUI.markWinningSequence('diagonal1');
        if(board[1][1] === 'X') return victoriousPlayer = players[0];
        if(board[1][1] === 'O') return victoriousPlayer = players[1];
    } else if((board[0][2] === board[1][1] && board[1][1] === board[2][0]) && 
               board[0][2] !== '' && board[1][1] !== '' && board[2][0] !== '') {
        gameUI.markWinningSequence('diagonal2');
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
    toggleBoard('disable');
    if(vsComputer) {
      if(victoriousPlayer === 'No one') {
        return gameUI.changeGameInformation(`THE GAME ENDED IN A DRAW`);
      } else if (victoriousPlayer === players[0]) {
        return gameUI.changeGameInformation(`CONGRATULATIONS ${victoriousPlayer.name}, YOU WON!`);
      } else {
        return gameUI.changeGameInformation('BETTER LUCK NEXT TIME, YOU LOST!');
      }
    } else {
      if(victoriousPlayer === 'No one') {
        return gameUI.changeGameInformation(`THE GAME ENDED IN A DRAW`);
      } else {
        return gameUI.changeGameInformation(`CONGRATULATIONS ${victoriousPlayer.name}, YOU WON!`);
      }
    }
  }

  const toggleBoard = (state) => {
    if(state === 'enable') {
      document.querySelectorAll('.board-container button').forEach(button => button.disabled = false);
    } else {
      document.querySelectorAll('.board-container button').forEach(button => button.disabled = true);
    }
  }

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
        newButton.addEventListener('click', () => gameLoop.playRoundVsPlayer(newButton.dataset.row, newButton.dataset.column));
      }
    }));
    if(vsComputer) {
      playerTurnInformation.classList.add('invisible');
    } else {
      playerTurnInformation.classList.remove('invisible');
      gameLoop.chooseFirstPlayerToMove();
      playerTurnInformation.textContent = `IT\'S ${gameLoop.getActivePlayer().name}'S TURN`;
    }
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
  const nextGameButtonsContainer = document.querySelector('.next-game-buttons-container');
  const newGame = document.querySelector('.new-game-button');
  const rematch = document.querySelector('.rematch-button');
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
    playerOneName = playerOneVsComputer.value.toUpperCase();
    if(playerOneName === '') {
      playerOneName = 'PLAYER ONE';
    }
    playerNameVsComputerContainer.classList.add('hidden');
    mainGame.classList.remove('hidden');
    GameLoop().playGame(playerOneName, '', vsComputer);
  })};

  let playerOneName;
  let playerTwoName;

  const playerOneConfirmButton = () => playerOneConfirm.addEventListener('click', () => {
    playerOneName = playerOne.value.toUpperCase();
    if(playerOneName === '') {
      playerOneName = 'PLAYER ONE';
    }
    if(playerTwoConfirm.textContent === 'CONFIRM') {
      playerOneConfirm.textContent = 'WAITING FOR PLAYER TWO';
      playerOne.disabled = true;
      playerOneConfirm.disabled = true;
    } else {
      playerNamesContainer.classList.add('hidden');
      mainGame.classList.remove('hidden');
      GameLoop().playGame(playerOneName, playerTwoName);
    }
  });

  const playerTwoConfirmButton = () => playerTwoConfirm.addEventListener('click', () => {
    playerTwoName = playerTwo.value.toUpperCase();
    if(playerTwoName === '') {
      playerTwoName = 'PLAYER TWO';
    }
    if(playerOneConfirm.textContent === 'CONFIRM') {
      playerTwoConfirm.textContent = 'WAITING FOR PLAYER ONE';
      playerTwo.disabled = true;
      playerTwoConfirm.disabled = true;
    } else {
      playerNamesContainer.classList.add('hidden');
      mainGame.classList.remove('hidden');
      GameLoop().playGame(playerOneName, playerTwoName);
    }
  });

  const nextGameButtons = (vsComputer) => {
    nextGameButtonsContainer.classList.remove('invisible');
    playerTurnInformation.classList.add('invisible');
    newGameButton();
    rematchButton(vsComputer);
  }

  const newGameButton = () => {
    newGame.addEventListener('click', () => {
      mainGame.classList.add('hidden');
      gameModeContainer.classList.remove('hidden');
      nextGameButtonsContainer.classList.add('invisible');
      resetPlayerInformation();
      playGameButton();
    });
  }

  const rematchButton = (vsComputer) => {
    if(vsComputer) {
      playerOneName = playerOneVsComputer.value.toUpperCase();
      if(playerOneName === '') {
        playerOneName = 'PLAYER ONE';
      }
    } else {
      playerOneName = playerOne.value.toUpperCase();
      if(playerOneName === '') {
        playerOneName = 'PLAYER ONE';
      }
      playerTwoName = playerTwo.value.toUpperCase();
      if(playerTwoName === '') {
        playerTwoName = 'PLAYER TWO';
      }
    }
    rematch.addEventListener('click', () => {
      nextGameButtonsContainer.classList.add('invisible');
      GameLoop().playGame(playerOneName, playerTwoName, vsComputer);
    });
  }

  const resetPlayerInformation = () => {
    playerOneVsComputer.value = '';
    playerOne.value = '';
    playerTwo.value = '';
    playerOneConfirm.disabled = false;
    playerTwoConfirm.disabled = false;
    playerOne.disabled = false;
    playerTwo.disabled = false;
    playerOneConfirm.textContent = 'CONFIRM';
    playerTwoConfirm.textContent = 'CONFIRM';
  }

  const changeGameInformation = (message) => {
    gameInformation.classList.remove('invisible');
    gameInformation.textContent = message;
  }

  const changePlayerTurnInformation = (activePlayer, players) => {
    playerTurnInformation.classList.remove('invisible');
    if(activePlayer === players[0]) {
      playerTurnInformation.textContent = `IT\'S ${players[1].name}'S TURN`;
    } else {
      playerTurnInformation.textContent = `IT\'S ${players[0].name}'S TURN`;
    }
  }

  const markWinningSequence = (reference, index) => {
    if(reference === 'row') {
      for(let i = 0; i < 3; i++) {
        document.querySelector(`[data-row='${index}'][data-column='${i}']`).classList.add('winning-sequence-color');
      }
      return
    } else if(reference === 'column') {
      for(let j = 0; j < 3; j++) {
        document.querySelector(`[data-row='${j}'][data-column='${index}']`).classList.add('winning-sequence-color');
      }
      return
    } else if(reference === 'diagonal1') {
      for(let k = 0; k < 3; k++) {
        document.querySelector(`[data-row='${k}'][data-column='${k}']`).classList.add('winning-sequence-color');
      }
    } else if(reference === 'diagonal2') {
      document.querySelector(`[data-row='0'][data-column='2']`).classList.add('winning-sequence-color');
      document.querySelector(`[data-row='1'][data-column='1']`).classList.add('winning-sequence-color');
      document.querySelector(`[data-row='2'][data-column='0']`).classList.add('winning-sequence-color');
    }
  }

  return {
    buildBoardUI, 
    removeBoardUI, 
    showSquareValue, 
    playGameButton, 
    nextGameButtons, 
    changeGameInformation, 
    changePlayerTurnInformation, 
    markWinningSequence
  };
}

GameUI().playGameButton();