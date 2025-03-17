const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("start-btn");

const gridSize = 20;
const tileSize = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let gameInterval = null;

// ✅ Gambar Ular dan Makanan di Canvas
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gambar tubuh ular
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#00ff00" : "#00cc00"; // Kepala lebih terang
    ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    ctx.strokeStyle = "#003300";
    ctx.strokeRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
  });

  // Gambar makanan
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

// ✅ Pergerakan Ular
function moveSnake() {
  const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(newHead);

  // Jika ular memakan makanan
  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    generateFood();
  } else {
    snake.pop(); // Jika tidak makan, ekor dipotong
  }

  // Cek tabrakan
  if (
    newHead.x < 0 || newHead.x >= gridSize ||
    newHead.y < 0 || newHead.y >= gridSize ||
    isCollision(newHead)
  ) {
    gameOver();
  }
}

// ✅ Cek jika ular menabrak tubuh sendiri
function isCollision(position) {
  return snake.slice(1).some(segment => segment.x === position.x && segment.y === position.y);
}

// ✅ Bikin makanan di lokasi random
function generateFood() {
  food = {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize)
  };

  if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    generateFood();
  }
}

// ✅ Game Over
function gameOver() {
  clearInterval(gameInterval);
  alert(`Game Over! Your score: ${score}`);
  resetGame();
}

// ✅ Reset Game
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  generateFood();
}

// ✅ Start Game
function startGame() {
  resetGame();
  gameInterval = setInterval(() => {
    moveSnake();
    drawGame();
  }, 100); // Kecepatan mirip Nokia
}

// ✅ Kontrol dengan Keyboard
function changeDirection(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y !== 1) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y !== -1) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x !== 1) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x !== -1) direction = { x: 1, y: 0 };
      break;
  }
}

// ✅ Event Listener
document.addEventListener("keydown", changeDirection);
startButton.addEventListener("click", startGame);

generateFood();
drawGame();
