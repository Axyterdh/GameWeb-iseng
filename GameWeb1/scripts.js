const box = document.getElementById("moving-box");
const container = document.getElementById("game-container");

let score = 0;
let level = 0;
let speed = 1500; // Kecepatan awal
let lives = 5; // Nyawa awal
let streak = 0; // Win streak
let gameLevel = ''; // Menyimpan pilihan level kesulitan

const scoreDisplay = document.createElement("div");
scoreDisplay.id = "score";
document.body.appendChild(scoreDisplay);

const levelDisplay = document.createElement("div");
levelDisplay.id = "level";
document.body.appendChild(levelDisplay);

const livesDisplay = document.createElement("div");
livesDisplay.id = "lives";
document.body.appendChild(livesDisplay);

function updateDisplays() {
    scoreDisplay.textContent = `Score: ${score}`;
    levelDisplay.textContent = `Level: ${level}`;
    livesDisplay.textContent = `Lives: ${lives}`; // Update nyawa dalam teks
}

function moveBox() {
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const x = Math.random() * (containerWidth - box.offsetWidth);
    const y = Math.random() * (containerHeight - box.offsetHeight);

    box.style.left = `${x}px`;
    box.style.top = `${y}px`;
}

function startGame() {
    levelSelection.style.display = 'none'; // Sembunyikan level selection
    gameContainer.style.display = 'block'; // Tampilkan game container
    moveInterval = setInterval(moveBox, speed); // Mulai permainan
    updateDisplays();
}

document.getElementById("easy").addEventListener("click", () => {
    gameLevel = 'easy';
    lives = 5;
    speed = 2000; // Kecepatan lebih lambat di level Easy
    startGame();
});

document.getElementById("medium").addEventListener("click", () => {
    gameLevel = 'medium';
    lives = 5;
    speed = 1500; // Kecepatan normal di level Medium
    startGame();
});

document.getElementById("hard").addEventListener("click", () => {
    gameLevel = 'hard';
    lives = 3; // Nyawa lebih sedikit di level Hard
    speed = 1000; // Kecepatan lebih cepat di level Hard
    startGame();
});

box.addEventListener("click", () => {
    score++;
    streak++;
    alert("Score: " + score);

    level = Math.floor(score / 5);
    speed = Math.max(800, 1500 - level * 150);

    if (streak >= 2) {
        lives++;
        streak = 0;
        alert("Lives increased!");
    }

    clearInterval(moveInterval);
    moveBox();
    moveInterval = setInterval(moveBox, speed);

    updateDisplays();
});

container.addEventListener("click", (e) => {
    if (!box.contains(e.target)) {
        lives--;
        alert("Missed! Lives: " + lives);

        if (lives <= 0) {
            alert("Game Over!");
            lives = gameLevel === 'hard' ? 3 : 5; // Nyawa sesuai level
            score = 0;
            level = 0;
            streak = 0;
            moveBox();
            clearInterval(moveInterval);
            moveInterval = setInterval(moveBox, speed);
        }
        updateDisplays();
    }
});

let moveInterval;
