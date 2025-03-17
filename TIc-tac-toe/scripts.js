const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("resetButton");
const cells = document.querySelectorAll(".cell");

let currentPlayer = "X";
let boardState = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;

const winningConditions = [
  [0, 1, 2], // Baris atas
  [3, 4, 5], // Baris tengah
  [6, 7, 8], // Baris bawah
  [0, 3, 6], // Kolom kiri
  [1, 4, 7], // Kolom tengah
  [2, 5, 8], // Kolom kanan
  [0, 4, 8], // Diagonal kiri ke kanan
  [2, 4, 6], // Diagonal kanan ke kiri
];

// Fungsi untuk mengecek pemenang
function checkWinner() {
  let winner = null;

  winningConditions.forEach(condition => {
    const [a, b, c] = condition;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      winner = boardState[a];
    }
  });

  if (winner) {
    statusText.textContent = `${winner} wins! 🎉`;
    isGameActive = false;
  } else if (!boardState.includes("")) {
    statusText.textContent = "Draw! 😐";
    isGameActive = false;
  }
}

// Fungsi untuk menangani klik pada sel
function handleCellClick(event) {
  const cell = event.target;
  const index = cell.getAttribute("data-index");

  if (boardState[index] !== "" || !isGameActive) return;

  boardState[index] = currentPlayer;
  cell.textContent = currentPlayer;

  checkWinner();

  // Ganti pemain
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

// Fungsi untuk me-reset game
function resetGame() {
  boardState = ["", "", "", "", "", "", "", "", ""];
  isGameActive = true;
  currentPlayer = "X";
  statusText.textContent = "";
  cells.forEach(cell => (cell.textContent = ""));
}

// Event listener untuk setiap sel
cells.forEach(cell => cell.addEventListener("click", handleCellClick));

// Event listener untuk tombol reset
resetButton.addEventListener("click", resetGame);
