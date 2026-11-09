/* Pure, deterministic grid rules. No DOM or timer dependency. */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.SnakeLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const VECTORS = Object.freeze({
    up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
    left: { x: -1, y: 0 }, right: { x: 1, y: 0 }
  });
  const equal = (a, b) => a.x === b.x && a.y === b.y;

  function spawnFood(snake, cols, rows, random = Math.random) {
    const free = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const point = { x, y };
        if (!snake.some(segment => equal(segment, point))) free.push(point);
      }
    }
    if (!free.length) return null;
    const value = Number(random());
    const index = Math.min(free.length - 1, Math.max(0, Math.floor(
      (Number.isFinite(value) ? value : 0) * free.length
    )));
    return free[index];
  }

  function newGame({ cols = 20, rows = 20, random = Math.random } = {}) {
    if (!Number.isInteger(cols) || cols < 1 || !Number.isInteger(rows) || rows < 1) {
      throw new RangeError("Grid dimensions must be positive integers");
    }
    const snake = [{ x: Math.min(5, cols - 1), y: Math.min(5, rows - 1) }];
    const food = spawnFood(snake, cols, rows, random);
    return { cols, rows, snake, food, direction: "right", nextDirection: "right",
      turnQueued: false, score: 0, status: food ? "ready" : "won" };
  }

  function turn(game, nextDirection) {
    const current = VECTORS[game.direction], next = VECTORS[nextDirection];
    if (!next || game.turnQueued || game.status === "lost" || game.status === "won") return game;
    if (current.x + next.x === 0 && current.y + next.y === 0) return game;
    return { ...game, nextDirection, turnQueued: true };
  }

  function togglePause(game) {
    if (game.status === "running") return { ...game, status: "paused" };
    if (game.status === "ready" || game.status === "paused") return { ...game, status: "running" };
    return game;
  }

  function step(game, random = Math.random) {
    if (game.status !== "running") return game;
    const direction = game.nextDirection;
    const vector = VECTORS[direction];
    const head = { x: game.snake[0].x + vector.x, y: game.snake[0].y + vector.y };
    const eating = game.food !== null && equal(head, game.food);
    // A vacated tail cell is legal on a non-growth move.
    const occupied = eating ? game.snake : game.snake.slice(0, -1);
    if (head.x < 0 || head.y < 0 || head.x >= game.cols || head.y >= game.rows ||
        occupied.some(segment => equal(segment, head))) {
      return { ...game, direction, nextDirection: direction, turnQueued: false, status: "lost" };
    }
    const snake = [head, ...game.snake];
    if (!eating) snake.pop();
    const food = eating ? spawnFood(snake, game.cols, game.rows, random) : game.food;
    return { ...game, snake, food, direction, nextDirection: direction,
      turnQueued: false, score: game.score + (eating ? 10 : 0),
      status: food === null ? "won" : "running" };
  }

  return { newGame, spawnFood, turn, togglePause, step };
});
