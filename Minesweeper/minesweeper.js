const boardSize = 10;
const mineCount = 10;
let board = [];
let gameOver = false;

const gameBoard = document.getElementById("game-board");
const statusDisplay = document.getElementById("status");
const resetButton = document.getElementById("reset-btn");

function createBoard() {
  board = Array.from({ length: boardSize }, () =>
    Array.from({ length: boardSize }, () => ({
      isMine: false,
      revealed: false,
      adjacentMines: 0,
    }))
  );

  placeMines();
  calculateNumbers();
  drawBoard();
}

function placeMines() {
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const x = Math.floor(Math.random() * boardSize);
    const y = Math.floor(Math.random() * boardSize);
    if (!board[x][y].isMine) {
      board[x][y].isMine = true;
      minesPlaced++;
    }
  }
}

function calculateNumbers() {
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      if (!board[x][y].isMine) {
        let count = 0;
        getNeighbors(x, y).forEach(([nx, ny]) => {
          if (board[nx][ny].isMine) count++;
        });
        board[x][y].adjacentMines = count;
      }
    }
  }
}

function getNeighbors(x, y) {
  const neighbors = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (
        dx === 0 && dy === 0 ||
        x + dx < 0 || x + dx >= boardSize ||
        y + dy < 0 || y + dy >= boardSize
      ) continue;
      neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
}

function drawBoard() {
  gameBoard.innerHTML = "";
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => handleCellClick(x, y));
      if (board[x][y].revealed) {
        cell.classList.add("revealed");
        if (board[x][y].isMine) {
          cell.classList.add("bomb");
          cell.textContent = "💣";
        } else if (board[x][y].adjacentMines > 0) {
          cell.textContent = board[x][y].adjacentMines;
        }
      }
      gameBoard.appendChild(cell);
    }
  }
}

function handleCellClick(x, y) {
  if (gameOver || board[x][y].revealed) return;
  
  board[x][y].revealed = true;
  if (board[x][y].isMine) {
    statusDisplay.textContent = "💥 Game Over!";
    gameOver = true;
  } else if (board[x][y].adjacentMines === 0) {
    getNeighbors(x, y).forEach(([nx, ny]) => handleCellClick(nx, ny));
  }
  
  drawBoard();
}

function resetGame() {
  gameOver = false;
  statusDisplay.textContent = "Click to Start!";
  createBoard();
}

resetButton.addEventListener("click", resetGame);

createBoard();
