const player = document.getElementById('player');
const bullet = document.getElementById('bullet');
const enemy = document.getElementById('enemy');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');

let playerSpeed = 5;
let bulletSpeed = 10;
let enemySpeed = 2;
let score = 0;
let time = 0;
let bulletFired = false;
let gameTimeInterval;
let enemyInterval;
let enemyTimer = 0;
let enemyDirection = 1; // 1 untuk bergerak ke bawah, -1 untuk bergerak ke atas
let moveLeft = false;
let moveRight = false;

// Fungsi untuk menggerakkan pemain secara berkelanjutan
function movePlayer() {
    let playerPos = parseInt(player.style.left);
    if (moveLeft && playerPos > 0) {
        player.style.left = playerPos - playerSpeed + 'px';
    }
    if (moveRight && playerPos < gameContainer.offsetWidth - player.offsetWidth) {
        player.style.left = playerPos + playerSpeed + 'px';
    }
}

// Gerakkan pemain dengan tombol
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveLeft = true;
    }
    if (e.key === 'ArrowRight') {
        moveRight = true;
    }
    if (e.key === ' ' && !bulletFired) { // Tombol spasi untuk menembak
        fireBullet();
    }
});

// Berhentikan pergerakan pemain jika tombol dilepas
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        moveLeft = false;
    }
    if (e.key === 'ArrowRight') {
        moveRight = false;
    }
});

// Menembakkan peluru
function fireBullet() {
    bullet.style.left = player.offsetLeft + player.offsetWidth / 2 - bullet.offsetWidth / 2 + 'px';
    bullet.style.bottom = player.offsetHeight + 'px';
    bullet.style.display = 'block';
    bulletFired = true;
    moveBullet();
}

// Menggerakkan peluru
function moveBullet() {
    let bulletInterval = setInterval(() => {
        let bulletBottom = parseInt(bullet.style.bottom);
        if (bulletBottom > gameContainer.offsetHeight) {
            bullet.style.display = 'none';
            bulletFired = false;
            clearInterval(bulletInterval);
        } else {
            bullet.style.bottom = bulletBottom + bulletSpeed + 'px';
        }
    }, 20);
}

// Gerakkan musuh secara vertikal
function moveEnemy() {
    let enemyPosition = parseInt(enemy.style.top);
    if (enemyPosition > gameContainer.offsetHeight || enemyPosition < 0) {
        enemyDirection *= -1;
    }
    enemy.style.top = enemyPosition + enemySpeed * enemyDirection + 'px';
}

// Menambah skor saat peluru mengenai musuh
function checkCollision() {
    const bulletRect = bullet.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    if (
        bulletRect.left < enemyRect.right &&
        bulletRect.right > enemyRect.left &&
        bulletRect.top < enemyRect.bottom &&
        bulletRect.bottom > enemyRect.top
    ) {
        enemy.style.top = 0;
        enemy.style.left = Math.random() * (gameContainer.offsetWidth - enemy.offsetWidth) + 'px';
        bullet.style.display = 'none';
        bulletFired = false;
        score++;
        scoreDisplay.textContent = score;
    }
}

// Update waktu permainan
function updateTime() {
    time++;
    timeDisplay.textContent = time + "s";
}

// Main game loop
function gameLoop() {
    movePlayer();
    moveEnemy();
    checkCollision();
    updateTime();

    if (time % 10 === 0) {  // Setiap 10 detik
        enemySpeed += 0.1; // Meningkatkan kecepatan musuh
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();

// Start game timer
gameTimeInterval = setInterval(() => {
    time++;
}, 1000);
