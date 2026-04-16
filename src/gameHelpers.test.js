import { describe, it, expect } from 'vitest';
import {
  GRID_SIZE,
  SNAKE_TYPES,
  DIRECTIONS,
  isValidSpawnPosition,
  canChangeDirection,
  getSafeDirections,
  resolveCombat,
  calculateScore,
  spawnEnemies,
} from './gameHelpers';

describe('isValidSpawnPosition', () => {
  it('returns true for valid positions within bounds', () => {
    const body = [{ x: 5, y: 5 }, { x: 5, y: 6 }];
    const occupied = new Set();
    expect(isValidSpawnPosition(body, occupied, GRID_SIZE)).toBe(true);
  });

  it('returns false for out-of-bounds positions', () => {
    const body = [{ x: -1, y: 5 }];
    const occupied = new Set();
    expect(isValidSpawnPosition(body, occupied, GRID_SIZE)).toBe(false);
  });

  it('returns false for positions outside upper bounds', () => {
    const body = [{ x: 30, y: 5 }];
    const occupied = new Set();
    expect(isValidSpawnPosition(body, occupied, GRID_SIZE)).toBe(false);
  });

  it('returns false for overlapping positions', () => {
    const body = [{ x: 5, y: 5 }];
    const occupied = new Set(['5,5']);
    expect(isValidSpawnPosition(body, occupied, GRID_SIZE)).toBe(false);
  });

  it('returns true for valid positions not overlapping', () => {
    const body = [{ x: 5, y: 5 }];
    const occupied = new Set(['10,10']);
    expect(isValidSpawnPosition(body, occupied, GRID_SIZE)).toBe(true);
  });
});

describe('canChangeDirection', () => {
  it('allows UP to LEFT', () => {
    expect(canChangeDirection('UP', 'LEFT')).toBe(true);
  });

  it('allows UP to RIGHT', () => {
    expect(canChangeDirection('UP', 'RIGHT')).toBe(true);
  });

  it('allows same direction UP to UP', () => {
    expect(canChangeDirection('UP', 'UP')).toBe(true);
  });

  it('prevents UP to DOWN reversal', () => {
    expect(canChangeDirection('UP', 'DOWN')).toBe(false);
  });

  it('prevents DOWN to UP reversal', () => {
    expect(canChangeDirection('DOWN', 'UP')).toBe(false);
  });

  it('prevents LEFT to RIGHT reversal', () => {
    expect(canChangeDirection('LEFT', 'RIGHT')).toBe(false);
  });

  it('prevents RIGHT to LEFT reversal', () => {
    expect(canChangeDirection('RIGHT', 'LEFT')).toBe(false);
  });
});

describe('resolveCombat', () => {
  it('returns eat when player is larger', () => {
    expect(resolveCombat(5, 3)).toBe('eat');
  });

  it('returns die when player is smaller', () => {
    expect(resolveCombat(3, 5)).toBe('die');
  });

  it('returns die when sizes are equal', () => {
    expect(resolveCombat(5, 5)).toBe('die');
  });

  it('returns eat when player is longer by one', () => {
    expect(resolveCombat(4, 3)).toBe('eat');
  });
});

describe('calculateScore', () => {
  it('returns enemy size as points', () => {
    expect(calculateScore(3)).toBe(3);
    expect(calculateScore(7)).toBe(7);
    expect(calculateScore(5)).toBe(5);
  });
});

describe('getSafeDirections', () => {
  const gridSize = GRID_SIZE;

  it('returns all directions when space is clear', () => {
    const enemy = { id: 1, body: [{ x: 10, y: 10 }], direction: 'UP' };
    const allEnemies = [enemy];
    const reserved = new Set();
    const safe = getSafeDirections(enemy, allEnemies, gridSize, reserved);
    expect(safe.length).toBe(4);
  });

  it('excludes directions that go out of bounds', () => {
    const enemy = { id: 1, body: [{ x: 0, y: 0 }], direction: 'UP' };
    const allEnemies = [enemy];
    const reserved = new Set();
    const safe = getSafeDirections(enemy, allEnemies, gridSize, reserved);
    expect(safe).not.toContain('UP');
    expect(safe).not.toContain('LEFT');
  });

  it('excludes directions that hit own body', () => {
    const enemy = {
      id: 1,
      body: [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }],
      direction: 'UP'
    };
    const allEnemies = [enemy];
    const reserved = new Set();
    const safe = getSafeDirections(enemy, allEnemies, gridSize, reserved);
    expect(safe).not.toContain('DOWN');
  });

  it('excludes directions that hit other enemies', () => {
    const enemy = { id: 1, body: [{ x: 5, y: 5 }], direction: 'UP' };
    const otherEnemy = { id: 2, body: [{ x: 6, y: 5 }], direction: 'LEFT' };
    const allEnemies = [enemy, otherEnemy];
    const reserved = new Set();
    const safe = getSafeDirections(enemy, allEnemies, gridSize, reserved);
    expect(safe).not.toContain('RIGHT');
  });

  it('excludes reserved cells', () => {
    const enemy = { id: 1, body: [{ x: 5, y: 5 }], direction: 'UP' };
    const allEnemies = [enemy];
    const reserved = new Set(['6,5']);
    const safe = getSafeDirections(enemy, allEnemies, gridSize, reserved);
    expect(safe).not.toContain('RIGHT');
  });
});

describe('spawnEnemies', () => {
  it('returns 3-8 enemies', () => {
    const playerBody = [{ x: 15, y: 15 }];
    const enemies = spawnEnemies(playerBody, GRID_SIZE, SNAKE_TYPES);
    expect(enemies.length).toBeGreaterThanOrEqual(3);
    expect(enemies.length).toBeLessThanOrEqual(8);
  });

  it('returns enemies within grid bounds', () => {
    const playerBody = [{ x: 15, y: 15 }];
    const enemies = spawnEnemies(playerBody, GRID_SIZE, SNAKE_TYPES);
    enemies.forEach(enemy => {
      enemy.body.forEach(seg => {
        expect(seg.x).toBeGreaterThanOrEqual(0);
        expect(seg.x).toBeLessThan(GRID_SIZE);
        expect(seg.y).toBeGreaterThanOrEqual(0);
        expect(seg.y).toBeLessThan(GRID_SIZE);
      });
    });
  });

  it('does not spawn on player position', () => {
    const playerBody = [{ x: 10, y: 10 }, { x: 10, y: 11 }];
    const enemies = spawnEnemies(playerBody, GRID_SIZE, SNAKE_TYPES);
    const playerCells = new Set(playerBody.map(s => `${s.x},${s.y}`));
    enemies.forEach(enemy => {
      enemy.body.forEach(seg => {
        expect(playerCells.has(`${seg.x},${seg.y}`)).toBe(false);
      });
    });
  });

  it('does not spawn enemies overlapping each other', () => {
    const playerBody = [{ x: 15, y: 15 }];
    const enemies = spawnEnemies(playerBody, GRID_SIZE, SNAKE_TYPES);
    const allCells = new Set();
    enemies.forEach(enemy => {
      enemy.body.forEach(seg => {
        const key = `${seg.x},${seg.y}`;
        expect(allCells.has(key)).toBe(false);
        allCells.add(key);
      });
    });
  });

  it('assigns valid direction to each enemy', () => {
    const playerBody = [{ x: 15, y: 15 }];
    const enemies = spawnEnemies(playerBody, GRID_SIZE, SNAKE_TYPES);
    const dirKeys = Object.keys(DIRECTIONS);
    enemies.forEach(enemy => {
      expect(dirKeys).toContain(enemy.direction);
    });
  });

  it('assigns valid snake type to each enemy', () => {
    const playerBody = [{ x: 15, y: 15 }];
    const enemies = spawnEnemies(playerBody, GRID_SIZE, SNAKE_TYPES);
    const typeKeys = Object.keys(SNAKE_TYPES);
    enemies.forEach(enemy => {
      expect(typeKeys).toContain(enemy.type);
    });
  });
});