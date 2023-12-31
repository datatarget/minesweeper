// Function to generate a random integer between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create the game board
function createBoard(rows, cols, numMines) {
  const board = [];

  // Create an empty board
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push({
        isMine: false,
        neighborMines: 0,
        isRevealed: false,
        isMarked: false,
      });
    }
    board.push(row);
  }

  // Add mines to the board
  let minesPlaced = 0;
  while (minesPlaced < numMines) {
    const row = getRandomInt(0, rows - 1);
    const col = getRandomInt(0, cols - 1);

    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate the number of neighbor mines for each cell
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = board[i][j];

      if (cell.isMine) {
        // Skip calculation for mine cells
        continue;
      }

      let neighborMines = 0;

      // Check each neighbor cell
      for (let x = Math.max(i - 1, 0); x <= Math.min(i + 1, rows - 1); x++) {
        for (let y = Math.max(j - 1, 0); y <= Math.min(j + 1, cols - 1); y++) {
          if (board[x][y].isMine) {
            neighborMines++;
          }
        }
      }

      cell.neighborMines = neighborMines;
    }
  }

  return board;
}

// Function to reveal a cell
function revealCell(board, row, col) {
  const cell = board[row][col];

  if (cell.isRevealed || cell.isMarked) {
    return;
  }

  cell.isRevealed = true;

  if (cell.isMine) {
    console.log('GAME OVER');
    printBoard(board, true);
    process.exit(0);
  }

  if (cell.neighborMines === 0) {
    const directions = [
      { x: -1, y: -1 },
      { x: -1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];

    for (const direction of directions) {
      const newRow = row + direction.x;
      const newCol = col + direction.y;

      if (isValidCell(board, newRow, newCol)) {
        revealCell(board, newRow, newCol);
      }
    }
  }
}

// Function to check if a cell is valid
function isValidCell(board, row, col) {
  return (
    row >= 0 &&
    row < board.length &&
    col >= 0 &&
    col < board[0].length &&
    !board[row][col].isRevealed
  );
}

// Function to mark a cell with a question mark
function markCell(board, row, col) {
  const cell = board[row][col];

  if (cell.isRevealed) {
    return;
  }

  cell.isMarked = !cell.isMarked;
}

// Function to check if all non-mine cells have been revealed
function checkWin(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      const cell = board[i][j];
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
}

// Function to print the game board
function printBoard(board, revealMines = false) {
  console.log('Board:');
  for (let i = 0; i < board.length; i++) {
    let row = '';
    for (let j = 0; j < board[0].length; j++) {
      const cell = board[i][j];
      row += getCellDisplay(cell, revealMines) + ' ';
    }
    console.log(row);
  }
}

// Function to get the display value of a cell
function getCellDisplay(cell, revealMines) {
  if (cell.isRevealed) {
    if (cell.isMine) {
      return '*';
    } else {
      return cell.neighborMines;
    }
  } else {
    if (cell.isMarked) {
      return '?';
    } else if (revealMines && cell.isMine) {
      return '*';
    } else {
      return '.';
    }
  }
}

// Function to start the game
function startGame() {
  console.log('Enter the number of rows for the grid:');
  process.stdin.once('data', (rowsInput) => {
    const rows = parseInt(rowsInput);
    if (isNaN(rows) || rows <= 0) {
      console.log('Invalid input. Exiting the game.');
      process.exit(0);
    }

    console.log('Enter the number of columns for the grid:');
    process.stdin.once('data', (colsInput) => {
      const cols = parseInt(colsInput);
      if (isNaN(cols) || cols <= 0) {
        console.log('Invalid input. Exiting the game.');
        process.exit(0);
      }

      const minPercentage = 10;
      const maxPercentage = 20;

      // Calculate the number of mines
      const totalTiles = rows * cols;
      const minMines = Math.floor((totalTiles * minPercentage) / 100);
      const maxMines = Math.floor((totalTiles * maxPercentage) / 100);
      const numMines = getRandomInt(minMines, maxMines);

      console.log(`Number of Mines: ${numMines}`);

      const board = createBoard(rows, cols, numMines);
      printBoard(board);

      // Game logic
      console.log('Enter the row and column to reveal (e.g., 0 1), or mark/unmark a cell with "?" (e.g., 0 1 ?):');

      process.stdin.on('data', function (data) {
        const input = data.toString().trim().split(' ');
        const row = parseInt(input[0]);
        const col = parseInt(input[1]);

        if (!isNaN(row) && !isNaN(col) && row >= 0 && row < rows && col >= 0 && col < cols) {
          if (input.length === 3 && input[2] === '?') {
            markCell(board, row, col);
          } else {
            revealCell(board, row, col);
            if (checkWin(board)) {
              console.log('YOU WON');
              process.exit(0);
            }
          }
        } else {
          console.log('Invalid input. Try again.');
        }

        printBoard(board);

        console.log('Enter the row and column to reveal (e.g., 0 1), or mark/unmark a cell with "?" (e.g., 0 1 ?):');
      });
    });
  });
}

// Start the game
startGame();
