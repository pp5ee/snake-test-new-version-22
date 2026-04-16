export const GRID_SIZE = 30;

export const SNAKE_TYPES = {
  cyber: { name: 'Cyber', color: '#00ffff', secondary: '#ff00ff' },
  neon: { name: 'Neon', color: '#39ff14', secondary: '#ffff00' },
  plasma: { name: 'Plasma', color: '#ff0080', secondary: '#8000ff' },
  quantum: { name: 'Quantum', color: '#00ff80', secondary: '#0080ff' },
};

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const OPPOSITE = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };

/**
 * Checks whether a snake body (array of {x,y} segments) is fully within bounds
 * (0 to gridSize-1) and does not overlap any cell in occupiedCells.
 *
 * @param {Array<{x:number,y:number}>} body - Segments to validate.
 * @param {Set<string>}               occupiedCells - Set of "x,y" strings already taken.
 * @param {number}                    gridSize - Width/height of the grid.
 * @returns {boolean}
 */
export function isValidSpawnPosition(body, occupiedCells, gridSize) {
  return body.every(
    (seg) =>
      seg.x >= 0 &&
      seg.x < gridSize &&
      seg.y >= 0 &&
      seg.y < gridSize &&
      !occupiedCells.has(`${seg.x},${seg.y}`)
  );
}

/**
 * Returns false when newDirection is the exact opposite of currentDirection,
 * preventing a 180° reversal that would send the snake into its own neck.
 *
 * @param {string} currentDirection - One of 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'.
 * @param {string} newDirection     - Requested next direction.
 * @returns {boolean}
 */
export function canChangeDirection(currentDirection, newDirection) {
  return OPPOSITE[currentDirection] !== newDirection;
}

/**
 * Returns the direction keys that are safe for an enemy to move into —
 * i.e. the destination cell is within bounds, not occupied by the enemy's own
 * body (excluding the tail that will vacate), not occupied by any other enemy,
 * and not in the reservedCells set (cells already claimed by enemies processed
 * earlier in the same tick).
 *
 * @param {{ id: *, body: Array<{x:number,y:number}>, direction: string }} enemy
 * @param {Array<{ id: *, body: Array<{x:number,y:number}> }>}             allEnemies
 * @param {number}  gridSize
 * @param {Set<string>} reservedCells - "x,y" strings reserved this tick.
 * @returns {string[]} Array of safe direction keys.
 */
export function getSafeDirections(enemy, allEnemies, gridSize, reservedCells) {
  const ownBodyExcludingTail = enemy.body.slice(0, -1);
  const otherEnemyCells = new Set(
    allEnemies
      .filter((e) => e.id !== enemy.id)
      .flatMap((e) => e.body.map((s) => `${s.x},${s.y}`))
  );

  return Object.keys(DIRECTIONS).filter((dirKey) => {
    const delta = DIRECTIONS[dirKey];
    const next = { x: enemy.body[0].x + delta.x, y: enemy.body[0].y + delta.y };

    if (next.x < 0 || next.x >= gridSize || next.y < 0 || next.y >= gridSize)
      return false;

    const key = `${next.x},${next.y}`;

    if (ownBodyExcludingTail.some((s) => s.x === next.x && s.y === next.y))
      return false;
    if (otherEnemyCells.has(key)) return false;
    if (reservedCells.has(key)) return false;

    return true;
  });
}

/**
 * Determines the outcome of a collision between the player and an enemy.
 *
 * @param {number} playerSize - Number of segments in the player's body.
 * @param {number} enemySize  - Number of segments in the enemy's body.
 * @returns {'eat' | 'die'}
 */
export function resolveCombat(playerSize, enemySize) {
  return playerSize > enemySize ? 'eat' : 'die';
}

/**
 * Calculates the score earned from eating an enemy.
 * Returns the enemy's body length as points.
 *
 * @param {number} enemySize - Number of segments in the eaten enemy.
 * @returns {number}
 */
export function calculateScore(enemySize) {
  return enemySize;
}

/**
 * Generates 3–8 enemy snakes at positions that do not overlap the player body
 * or each other.  Each enemy has a random type, direction, and body length
 * (3–7 segments).
 *
 * @param {Array<{x:number,y:number}>} playerBody - Current player body segments.
 * @param {number}                     gridSize    - Width/height of the grid.
 * @param {Object}                     snakeTypes  - Map of type keys to type data.
 * @returns {Array<{ id: number, body: Array<{x:number,y:number}>, direction: string, type: string }>}
 */
export function spawnEnemies(playerBody, gridSize, snakeTypes) {
  const playerCells = new Set(playerBody.map((s) => `${s.x},${s.y}`));
  const typeKeys = Object.keys(snakeTypes);
  const dirKeys = Object.keys(DIRECTIONS);

  const numEnemies = Math.floor(Math.random() * 6) + 3; // 3–8
  const enemies = [];

  for (let i = 0; i < numEnemies; i++) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      const length = Math.floor(Math.random() * 5) + 3; // 3–7
      const startX = Math.floor(Math.random() * gridSize);
      const startY = Math.floor(Math.random() * gridSize);
      const dirKey = dirKeys[Math.floor(Math.random() * dirKeys.length)];
      const dir = DIRECTIONS[dirKey];

      // Build body trailing behind the head in the chosen direction
      const body = Array.from({ length }, (_, idx) => ({
        x: startX - dir.x * idx,
        y: startY - dir.y * idx,
      }));

      // Collect cells occupied by already-placed enemies
      const existingCells = new Set(
        enemies.flatMap((e) => e.body.map((s) => `${s.x},${s.y}`))
      );

      if (isValidSpawnPosition(body, new Set([...playerCells, ...existingCells]), gridSize)) {
        enemies.push({
          id: i,
          body,
          direction: dirKey,
          type: typeKeys[Math.floor(Math.random() * typeKeys.length)],
        });
        placed = true;
      }

      attempts++;
    }
  }

  return enemies;
}
