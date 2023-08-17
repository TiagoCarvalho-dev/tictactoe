const Board = function() {
  const rows = 3;
  const column = 3;
  const board = [];

  for(let i = 0; i < rows; i++) {
    board.push([]);
    for(let j = 0; j < column; j++) {
      board[i].push('0');
    }
  }

  const getBoard = () => board;

  const markSquare = function(playerMarker, row, column, board) {
    board[row][column] = playerMarker;
  }

  return {getBoard, markSquare};
}

const GameLoop = function() {
  const board = Board();

  const players = [{
    name: 'PlayerOne',
    marker: '1'
  },
  {
    name: 'PlayerTwo',
    marker: '2'
  }];

  let activePlayer = players[0];

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const playGame = () => {
    console.log('Hello, let\'s play');
    for(let i = 0; i < 4; i++) {
      console.log(JSON.stringify(board.getBoard()));
      console.log(`It\'s ${activePlayer.name}'s turn!`);
      let row = prompt('Please choose the row');
      let column = prompt('Please choose the column');
      board.markSquare(activePlayer.marker, row, column, board.getBoard());
      switchActivePlayer();
    }
  }

  const getActivePlayer = () => activePlayer;

  return {playGame, getActivePlayer};
}