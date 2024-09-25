// 获取canvas及其上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let snake = [];
let direction = { x: 1, y: 0 };  // 默认蛇初始向右移动
let food = {};
let gameInterval;
let score = 0;

// 初始状态重置函数
function resetGame() {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: 1, y: 0 };
    food = getRandomFoodPosition(canvas.width, canvas.height, gridSize);
    score = 0;
    document.getElementById('score').innerText = score;
    clearInterval(gameInterval);  // 清除现有的游戏循环
}

// 监听键盘输入事件
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// 处理Restart按钮的点击事件
document.getElementById('startButton').addEventListener('click', function () {
    resetGame();
    startGame();
});

// 更新游戏状态函数
function update() {
    const newHead = {
        x: snake[0].x + direction.x * gridSize,
        y: snake[0].y + direction.y * gridSize,
    };

    if (isCollision(newHead, snake, canvas.width, canvas.height)) {
        clearInterval(gameInterval);
        alert(`Game Over! Your score: ${score}`);
        return;
    }

    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        document.getElementById('score').innerText = score;
        food = getRandomFoodPosition(canvas.width, canvas.height, gridSize);
    } else {
        snake.pop();
    }
}

// Function to draw a rounded rectangle for snake segments (with shadow for 3D effect)
function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
}

// Function to draw a circle for the food
function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

// 绘制游戏内容
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        drawRoundedRect(segment.x, segment.y, gridSize, gridSize, gridSize / 4);
    });

    ctx.fillStyle = 'red';
    drawCircle(food.x, food.y, gridSize / 2);
}

// 游戏主循环
function gameLoop() {
    update();
    draw();
}

// 开始游戏
function startGame() {
    let speed = 100 - Math.min(score, 80); // 根据得分调整速度，最高80分时速度最快
    gameInterval = setInterval(gameLoop, speed);
}

// 初次加载时开始游戏
resetGame();
startGame();