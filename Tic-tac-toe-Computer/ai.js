const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("resetButton");
const easyBtn = document.getElementById("easyBtn");
const expertBtn = document.getElementById("expertBtn");
const cells = document.querySelectorAll(".cell");
const notification = document.getElementById("notification");

let currentPlayer = "X";
let boardState = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;
let aiLevel = "easy"; // Default level

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// ✅ Fungsi cek pemenang untuk game utama
function checkWinner() {
  for (const condition of winningConditions) {
    const [a, b, c] = condition;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      statusText.textContent = `${boardState[a]} wins! 🎉`;
      isGameActive = false;
      return;
    }
  }
  if (!boardState.includes("")) {
    statusText.textContent = "Draw!";
    isGameActive = false;
  }
}

// ✅ Fungsi cek pemenang untuk AI (Minimax)
function checkWinnerForAI(board, player) {
  for (const condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] === player && board[b] === player && board[c] === player) {
      return player;
    }
  }
  if (!board.includes("")) {
    return "draw";
  }
  return null;
}

// ✅ Pemain (user) melakukan gerakan
function handleCellClick(event) {
  const index = event.target.getAttribute("data-index");
  if (boardState[index] !== "" || !isGameActive || currentPlayer === "O") return;

  boardState[index] = "X";
  event.target.textContent = "X";

  checkWinner();

  if (isGameActive) {
    currentPlayer = "O";
    setTimeout(aiMove, 500);
  }
}

// ✅ AI melakukan gerakan
function aiMove() {
  if (aiLevel === "easy") {
    easyMove();
  } else {
    expertMove(); // Pakai Minimax untuk Expert
  }
}

// ✅ LEVEL EASY → Gerakan acak
function easyMove() {
  let emptyCells = boardState.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  if (emptyCells.length > 0) {
    let index = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    boardState[index] = "O";
    cells[index].textContent = "O";
  }
  checkWinner();
  currentPlayer = "X";
}

// ✅ LEVEL EXPERT → Pakai Algoritma Minimax (Bikin susah dikalahkan)
function expertMove() {
  let bestMove = minimax(boardState, "O").index;
  if (bestMove !== -1) {
    boardState[bestMove] = "O";
    cells[bestMove].textContent = "O";
  }
  checkWinner();
  currentPlayer = "X";
}

// ✅ Algoritma Minimax
function minimax(newBoard, player) {
  let availableCells = newBoard.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);

  // Cek hasil akhir untuk simulasi AI
  let result = checkWinnerForAI(newBoard, player === "X" ? "O" : "X");
  if (result === "X") return { score: -1 };
  if (result === "O") return { score: 1 };
  if (result === "draw") return { score: 0 };

  let moves = [];

  for (let index of availableCells) {
    newBoard[index] = player;

    let score = minimax(newBoard, player === "X" ? "O" : "X").score;

    newBoard[index] = ""; // Reset posisi

    moves.push({ index, score });
  }

  // Pilih gerakan terbaik
  let bestMove = player === "O"
    ? moves.reduce((best, move) => (move.score > best.score ? move : best), { score: -Infinity })
    : moves.reduce((best, move) => (move.score < best.score ? move : best), { score: Infinity });

  return bestMove;
}

// ✅ Reset Game
function resetGame() {
  boardState.fill("");
  isGameActive = true;
  currentPlayer = "X";
  statusText.textContent = "";
  cells.forEach(cell => cell.textContent = "");
}

// ✅ Pilih Level
easyBtn.onclick = () => setLevel("easy");
expertBtn.onclick = () => setLevel("expert");

function setLevel(level) {
  aiLevel = level;
  notification.textContent = `Level set to: ${level === 'easy' ? 'Easy' : 'Expert'}`;
  
  // Highlight tombol aktif
  easyBtn.classList.toggle('active', level === "easy");
  expertBtn.classList.toggle('active', level === "expert");

  resetGame(); // Reset otomatis setelah pilih level
}

// ✅ Event Listener
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);
