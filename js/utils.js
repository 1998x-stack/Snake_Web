/**
 * Generates a random position for food on the grid.
 * @param {number} canvasWidth - Width of the canvas.
 * @param {number} canvasHeight - Height of the canvas.
 * @param {number} gridSize - Size of one grid cell.
 * @returns {{x: number, y: number}} The x and y coordinates of the food.
 */
function getRandomFoodPosition(canvasWidth, canvasHeight, gridSize) {
    return {
        x: Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize,
    };
}

/**
 * Detects collision between the snake and itself or the walls.
 * @param {{x: number, y: number}} head - The new head of the snake.
 * @param {Array<{x: number, y: number}>} snake - The current snake body.
 * @param {number} canvasWidth - Width of the canvas.
 * @param {number} canvasHeight - Height of the canvas.
 * @returns {boolean} Returns true if collision occurs.
 */
function isCollision(head, snake, canvasWidth, canvasHeight) {
    // Check if the snake hits the walls
    if (head.x < 0 || head.y < 0 || head.x >= canvasWidth || head.y >= canvasHeight) {
        return true;
    }

    // Check if the snake hits itself
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}