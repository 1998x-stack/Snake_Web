const test = require("node:test");
const assert = require("node:assert/strict");
const {newGame, spawnFood, turn, togglePause, step} = require("../js/utils.js");

test("food never overlaps snake and is deterministic", () => {
  const snake = [{x:0,y:0},{x:1,y:0},{x:0,y:1}];
  assert.deepEqual(spawnFood(snake, 2, 2, () => 0), {x:1,y:1});
  assert.deepEqual(spawnFood(snake, 2, 2, () => 0.999), {x:1,y:1});
  assert.equal(spawnFood([...snake, {x:1,y:1}], 2, 2, () => 0), null);
});

test("initial state, pause, resume and reset have distinct transitions", () => {
  const initial = newGame({random: () => 0});
  assert.equal(initial.status, "ready");
  assert.equal(step(initial).status, "ready");
  const running = togglePause(initial);
  assert.equal(running.status, "running");
  assert.equal(togglePause(running).status, "paused");
  assert.equal(togglePause(togglePause(running)).status, "running");
  assert.equal(newGame({random: () => 0}).score, 0);
});

test("no opposite movement and only one turn per tick", () => {
  let game = togglePause(newGame({random: () => 0}));
  assert.strictEqual(turn(game, "left"), game);
  game = turn(game, "up");
  assert.equal(turn(game, "left").nextDirection, "up");
  game = step(game);
  assert.equal(game.direction, "up");
  assert.equal(turn(game, "left").nextDirection, "left");
});

test("growth and score occur only when eating", () => {
  const original = togglePause(newGame());
  const game = {...original, food:{x:6,y:5}};
  const after = step(game, () => 0);
  assert.equal(after.score, 10);
  assert.equal(after.snake.length, 2);
  assert.notDeepEqual(after.food, after.snake[0]);
  const farther = step(after);
  assert.equal(farther.snake.length, 2);
  assert.equal(farther.score, 10);
});

test("moving into old tail cell is legal when not growing", () => {
  const game = {...togglePause(newGame()), snake:[
    {x:2,y:1},{x:2,y:2},{x:1,y:2},{x:1,y:1}
  ], direction:"left", nextDirection:"left", food:{x:9,y:9}};
  const after = step(game);
  assert.equal(after.status, "running");
  assert.deepEqual(after.snake[0], {x:1,y:1});
  assert.equal(after.snake.length, 4);
});

test("moving into occupied body is fatal", () => {
  const game = {...togglePause(newGame()), snake:[
    {x:2,y:1},{x:2,y:2},{x:1,y:2},{x:1,y:1}
  ], direction:"down", nextDirection:"down", food:{x:9,y:9}};
  assert.equal(step(game).status, "lost");
});

test("wall collision ends game without moving snake further", () => {
  const game = {...togglePause(newGame()), snake:[{x:19,y:5}], food:{x:0,y:0}};
  const after = step(game);
  assert.equal(after.status, "lost");
  assert.deepEqual(after.snake, game.snake);
  assert.strictEqual(step(after), after);
});

test("filling last free cell wins", () => {
  const game = {...togglePause(newGame({cols:2,rows:1})),
    snake:[{x:0,y:0}],food:{x:1,y:0},direction:"right",nextDirection:"right"};
  const after = step(game);
  assert.equal(after.status, "won");
  assert.equal(after.food, null);
  assert.equal(after.score, 10);
  assert.equal(after.snake.length, 2);
});

test("reject invalid grids and fully occupied 1x1 is a win", () => {
  assert.throws(() => newGame({cols:0}), RangeError);
  const game = newGame({cols:1,rows:1});
  assert.equal(game.status, "won");
  assert.equal(game.food, null);
});
