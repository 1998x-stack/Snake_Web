/* Browser-only controller; rules live in the testable SnakeLogic module. */
"use strict";
(() => {
  const { newGame, turn, step, togglePause } = window.SnakeLogic;
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const score = document.getElementById("score");
  const status = document.getElementById("gameStatus");
  const playButton = document.getElementById("playButton");
  const resetButton = document.getElementById("resetButton");
  const SIZE = 20;
  let game = newGame();
  let touchStart = null;
  const names = {ready:"准备就绪 · 点击开始或按空格",running:"游戏中 · 方向键 / WASD 转向",
    paused:"已暂停 · 按空格继续",lost:"游戏结束 · 点击重新开始",won:"胜利！棋盘已经填满"};

  function paint() {
    ctx.fillStyle = "#101b30";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#21304c";
    for (let n = 0; n <= 20; n++) {
      ctx.beginPath(); ctx.moveTo(n * SIZE, 0); ctx.lineTo(n * SIZE, 400); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, n * SIZE); ctx.lineTo(400, n * SIZE); ctx.stroke();
    }
    game.snake.forEach(({x, y}, index) => {
      ctx.fillStyle = index === 0 ? "#b4fbcf" : "#41d7b4";
      ctx.fillRect(x * SIZE + 2, y * SIZE + 2, SIZE - 4, SIZE - 4);
    });
    if (game.food) {
      ctx.fillStyle = "#ff738d";
      ctx.beginPath();
      ctx.arc(game.food.x * SIZE + SIZE/2, game.food.y * SIZE + SIZE/2, SIZE * .39, 0, Math.PI * 2);
      ctx.fill();
    }
    score.textContent = String(game.score);
    status.textContent = names[game.status];
    playButton.textContent = game.status === "running" ? "暂停" :
      game.status === "paused" ? "继续" : "开始";
    playButton.disabled = game.status === "lost" || game.status === "won";
  }

  function changeDirection(value) {
    game = turn(game, value);
    paint();
  }

  const keys = {ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",
    w:"up",W:"up",s:"down",S:"down",a:"left",A:"left",d:"right",D:"right"};
  document.addEventListener("keydown", event => {
    if (keys[event.key]) {
      event.preventDefault();
      changeDirection(keys[event.key]);
    } else if (event.code === "Space") {
      event.preventDefault();
      game = togglePause(game);
      paint();
    } else if (event.key === "r" || event.key === "R") {
      game = newGame();
      paint();
    }
  });
  document.querySelectorAll("[data-direction]").forEach(button => {
    button.addEventListener("click", () => changeDirection(button.dataset.direction));
  });
  canvas.addEventListener("touchstart", event => {
    if (event.touches.length === 1) {
      touchStart = {x:event.touches[0].clientX, y:event.touches[0].clientY};
    }
  }, {passive:true});
  canvas.addEventListener("touchend", event => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    event.preventDefault();
    changeDirection(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right":"left") : (dy > 0 ? "down":"up"));
  }, {passive:false});
  playButton.addEventListener("click", () => {game = togglePause(game); paint();});
  resetButton.addEventListener("click", () => {game = newGame(); paint();});
  // One authoritative timer: reset, pause and game-over cannot create duplicate loops.
  setInterval(() => {game = step(game); if (game.status === "running" || game.status === "lost" || game.status === "won") paint();}, 125);
  paint();
})();
