const Board = function() {
  const rows = 3;
  const column = 3;
  const board = [];

  for(let i = 0; i < rows; i++) {
    board.push([]);
    for(let j = 0; j < column; j++) {
      board[i].push(0);
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

  let activePlayer = players.getPlayers()[0];

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players.getPlayers()[0] ? players.getPlayers()[1] : players.getPlayers()[0];
  }

  const playGame = () => {
    console.log('Hello, let\'s play');
    while(victoriousPlayer === 0) {
      console.log(JSON.stringify(board.getBoard()));
      console.log(`It\'s ${activePlayer.name}'s turn!`);
      let row = prompt('Please choose the row');
      let column = prompt('Please choose the column');
      if(board.getBoard()[row][column] > 0) {
        console.log('Square already taken, please choose another one.');
        continue;
      }
      board.markSquare(activePlayer.marker, row, column, board.getBoard());
      checkResult();
      switchActivePlayer();
    }
    console.log(JSON.stringify(board.getBoard()));
    displayResult();
  }

  let victoriousPlayer = 0;

  const checkResult = () => {
    for(let i = 0; i < 3; i++) {
      if(board.getBoard()[i][0] === board.getBoard()[i][1] && board.getBoard()[i][1] === board.getBoard()[i][2]) {
        if(board.getBoard()[i][0] === 1) victoriousPlayer = players.getPlayers()[0];
        if(board.getBoard()[i][0] === 2) victoriousPlayer = players.getPlayers()[1];
      } else if(board.getBoard()[0][i] === board.getBoard()[1][i] && board.getBoard()[1][i] === board.getBoard()[2][i]) {
        if(board.getBoard()[0][i] === 1) victoriousPlayer = players.getPlayers()[0];
        if(board.getBoard()[0][i] === 2) victoriousPlayer = players.getPlayers()[1];
      }
    }
    if((board.getBoard()[0][0] === board.getBoard()[1][1] && board.getBoard()[1][1] === board.getBoard()[2][2]) ||
       (board.getBoard()[0][2] === board.getBoard()[1][1] && board.getBoard()[1][1] === board.getBoard()[2][0])) {
        if(board.getBoard()[1][1] === 1) victoriousPlayer = players.getPlayers()[0];
        if(board.getBoard()[1][1] === 2) victoriousPlayer = players.getPlayers()[1];
    }
    if(board.getBoard()[0][0] > 0 && board.getBoard()[0][1] > 0 && board.getBoard()[0][2] > 0 &&
       board.getBoard()[1][0] > 0 && board.getBoard()[1][1] > 0 && board.getBoard()[1][2] > 0 &&
       board.getBoard()[2][0] > 0 && board.getBoard()[2][1] > 0 && board.getBoard()[2][2] > 0) {
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

  return {playGame};
}