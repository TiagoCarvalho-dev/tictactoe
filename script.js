const Board = function() {
  const rows = 3;
  const column = 3;
  const board = [];
  const buildBoard = function() {
    for(let i = 0; i < rows; i++) {
      board.push([]);
      for(let j = 0; j < column; j++) {
        board[i].push('0');
      }
    }
  }
  console.log(board);
  return {buildBoard};
}

Board().buildBoard();