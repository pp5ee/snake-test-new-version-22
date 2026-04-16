import { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from './components/GameBoard';
import SidePanel from './components/SidePanel';
import Leaderboard from './components/Leaderboard';
import './App.css';

const GRID_SIZE = 30;
const TICK_RATE = 120;

const SNAKE_TYPES = {
  cyber: { name: 'Cyber', color: '#00ffff', secondary: '#ff00ff' },
  neon: { name: 'Neon', color: '#39ff14', secondary: '#ffff00' },
  plasma: { name: 'Plasma', color: '#ff0080', secondary: '#8000ff' },
  quantum: { name: 'Quantum', color: '#00ff80', secondary: '#0080ff' },
};

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

function App() {
  const [gameStatus, setGameStatus] = useState('idle');
  const [playerSnake, setPlayerSnake] = useState(null);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedType, setSelectedType] = useState('cyber');
  const [leaderboard, setLeaderboard] = useState({ top10: [], history: [] });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const gameLoopRef = useRef(null);
  const lastDirectionRef = useRef('UP');

  useEffect(() => {
    loadLeaderboard();
    initGame();
  }, []);

  const loadLeaderboard = () => {
    const saved = localStorage.getItem('cyberpunk-snake-data');
    if (saved) {
      const data = JSON.parse(saved);
      setLeaderboard(data);
    }
  };

  const saveScore = (finalScore) => {
    const newEntry = {
      score: finalScore,
      date: new Date().toISOString(),
      snakeType: selectedType,
    };
    const updated = {
      top10: [...leaderboard.top10, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10),
      history: [...leaderboard.history, newEntry],
    };
    localStorage.setItem('cyberpunk-snake-data', JSON.stringify(updated));
    setLeaderboard(updated);
  };

  const initGame = useCallback(() => {
    const center = Math.floor(GRID_SIZE / 2);
    const player = {
      body: [
        { x: center, y: center },
        { x: center, y: center + 1 },
        { x: center, y: center + 2 },
      ],
      direction: 'UP',
      type: selectedType,
    };

    // Build a set of all cells occupied by the player for exact overlap checks
    const playerCells = new Set(player.body.map((s) => `${s.x},${s.y}`));

    const numEnemies = Math.floor(Math.random() * 6) + 3;
    const newEnemies = [];

    for (let i = 0; i < numEnemies; i++) {
      let validPosition = false;
      let enemy;
      let attempts = 0;

      while (!validPosition && attempts < 100) {
        const length = Math.floor(Math.random() * 5) + 3;
        const startX = Math.floor(Math.random() * GRID_SIZE);
        const startY = Math.floor(Math.random() * GRID_SIZE);
        const direction = Object.keys(DIRECTIONS)[Math.floor(Math.random() * 4)];
        const dir = DIRECTIONS[direction];

        // Build body segments in the chosen direction, each offset opposite to movement
        // (tail segments trail behind the head)
        const body = Array.from({ length }, (_, idx) => ({
          x: startX - dir.x * idx,
          y: startY - dir.y * idx,
        }));

        // Validate every segment is within board bounds (0 to GRID_SIZE-1)
        const inBounds = body.every(
          (seg) =>
            seg.x >= 0 && seg.x < GRID_SIZE &&
            seg.y >= 0 && seg.y < GRID_SIZE
        );
        if (!inBounds) {
          attempts++;
          continue;
        }

        // Build a set of all cells occupied by existing enemies for exact overlap checks
        const existingCells = new Set(
          newEnemies.flatMap((e) => e.body.map((s) => `${s.x},${s.y}`))
        );

        // Check exact cell overlap with player and already-placed enemies
        const overlapsPlayer = body.some((seg) => playerCells.has(`${seg.x},${seg.y}`));
        const overlapsOther = body.some((seg) => existingCells.has(`${seg.x},${seg.y}`));

        if (!overlapsPlayer && !overlapsOther) {
          enemy = {
            id: i,
            body,
            direction,
            type: Object.keys(SNAKE_TYPES)[Math.floor(Math.random() * 4)],
          };
          validPosition = true;
        }
        attempts++;
      }

      if (enemy) newEnemies.push(enemy);
    }

    setPlayerSnake(player);
    setEnemies(newEnemies);
    setScore(0);
    setGameStatus('idle');
    lastDirectionRef.current = 'UP';
  }, [selectedType]);

  const startGame = () => {
    if (gameStatus === 'idle' || gameStatus === 'gameover') {
      initGame();
    }
    setGameStatus('playing');
  };

  const pauseGame = () => {
    if (gameStatus === 'playing') {
      setGameStatus('paused');
    } else if (gameStatus === 'paused') {
      setGameStatus('playing');
    }
  };

  const restartGame = () => {
    initGame();
    setGameStatus('playing');
  };

  const handleGameOver = useCallback(() => {
    setGameStatus('gameover');
    if (score > 0) {
      saveScore(score);
    }
  }, [score]);

  const gameTick = useCallback(() => {
    if (gameStatus !== 'playing') return;

    setPlayerSnake((prev) => {
      if (!prev) return prev;

      const dir = DIRECTIONS[prev.direction];
      const head = prev.body[0];
      const newHead = { x: head.x + dir.x, y: head.y + dir.y };

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        handleGameOver();
        return prev;
      }

      if (prev.body.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
        handleGameOver();
        return prev;
      }

      // Start with a non-growing move (tail removed); growth is applied below if
      // the player eats an enemy this tick.
      const newBody = [newHead, ...prev.body.slice(0, -1)];

      // Track how many segments the player should grow this tick.
      let playerGrowth = 0;

      setEnemies((prevEnemies) => {
        // Build occupation sets so enemies can avoid the player and each other.
        const playerCellSet = new Set(newBody.map((s) => `${s.x},${s.y}`));
        const enemyCellSet = new Set(
          prevEnemies.flatMap((e) => e.body.map((s) => `${s.x},${s.y}`))
        );

        // Determine whether a candidate next-head position is safe for a given enemy.
        const isSafe = (pos, enemy, reserved = new Set()) => {
          // Out of bounds
          if (pos.x < 0 || pos.x >= GRID_SIZE || pos.y < 0 || pos.y >= GRID_SIZE)
            return false;
          const key = `${pos.x},${pos.y}`;
          // Collides with player
          if (playerCellSet.has(key)) return false;
          // Collides with own body (excluding the tail which will move away)
          const ownBodyExcludingTail = enemy.body.slice(0, -1);
          if (ownBodyExcludingTail.some((s) => s.x === pos.x && s.y === pos.y))
            return false;
          // Collides with other enemies (previous positions)
          const otherEnemyCells = new Set(
            prevEnemies
              .filter((e) => e.id !== enemy.id)
              .flatMap((e) => e.body.map((s) => `${s.x},${s.y}`))
          );
          if (otherEnemyCells.has(key)) return false;
          // Collides with cells reserved by already-moved enemies this tick
          if (reserved.has(key)) return false;
          return true;
        };

        // Process enemies sequentially to reserve cells and prevent simultaneous collision
        const newEnemies = [];
        const reservedCells = new Set();

        for (const enemy of prevEnemies) {
            const enemyHead = enemy.body[0];
            const allDirKeys = Object.keys(DIRECTIONS);

            // Evaluate every direction and classify as safe or unsafe.
            const safeDirs = allDirKeys.filter((d) => {
              const delta = DIRECTIONS[d];
              return isSafe(
                { x: enemyHead.x + delta.x, y: enemyHead.y + delta.y },
                enemy,
                reservedCells
              );
            });

            // Choose a direction: prefer safe ones; if none exist fall back to any
            // non-opposite direction (least-bad option to avoid instant self-death).
            let chosenDir;
            if (safeDirs.length > 0) {
              // Bias toward continuing in the current direction (40 % of the time)
              // to make movement look more natural, but still randomise freely.
              const continueChance = Math.random();
              if (continueChance < 0.4 && safeDirs.includes(enemy.direction)) {
                chosenDir = enemy.direction;
              } else {
                chosenDir = safeDirs[Math.floor(Math.random() * safeDirs.length)];
              }
            } else {
              // No safe direction – pick any direction that is not the direct opposite
              // (avoids 180° reversal into own neck as a last resort).
              const opposite = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
              const fallback = allDirKeys.filter((d) => d !== opposite[enemy.direction]);
              chosenDir = fallback[Math.floor(Math.random() * fallback.length)];
            }

            const delta = DIRECTIONS[chosenDir];
            const newEnemyHead = {
              x: enemyHead.x + delta.x,
              y: enemyHead.y + delta.y,
            };

            const movedBody = [newEnemyHead, ...enemy.body.slice(0, -1)];

            // Reserve the new head cell to prevent later enemies from moving there
            reservedCells.add(`${newEnemyHead.x},${newEnemyHead.y}`);

            // Add to new enemies array
            newEnemies.push({ ...enemy, direction: chosenDir, body: movedBody });
        }

        // Now check combat with the NEW enemy positions (after all enemies have moved)
        return newEnemies.filter((enemy) => {
            const playerSize = newBody.length;
            const enemySize = enemy.body.length;

            // Check collision with ANY enemy body segment, not just the head
            const hitEnemy = enemy.body.some(seg => seg.x === newHead.x && seg.y === newHead.y);
            if (hitEnemy) {
              if (enemySize >= playerSize) {
                handleGameOver();
                return true;
              } else {
                // Player eats the enemy – accumulate growth equal to enemy size
                playerGrowth += enemySize;
                setScore((s) => s + enemySize);
                return false;
              }
            }
            return true;
        });

        return newEnemies;
      });

      // Grow the player by re-appending tail segments for each growth point earned.
      // newBody already has the tail removed once; add back (growthPoints + 1) segments
      // so the net change is +enemySize segments.
      if (playerGrowth > 0) {
        const tail = newBody[newBody.length - 1];
        for (let g = 0; g < playerGrowth; g++) {
          newBody.push({ ...tail });
        }
      }

      return { ...prev, body: newBody };
    });
  }, [gameStatus, handleGameOver]);

  useEffect(() => {
    if (gameStatus === 'playing') {
      gameLoopRef.current = setInterval(gameTick, TICK_RATE);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStatus, gameTick]);

  // Sync selected snake type with player snake when idle
  useEffect(() => {
    if (gameStatus === 'idle' && playerSnake) {
      setPlayerSnake((prev) => (prev ? { ...prev, type: selectedType } : prev));
    }
  }, [selectedType, gameStatus]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatus !== 'playing' && gameStatus !== 'paused') return;

      const keyMap = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      };

      if (keyMap[e.key]) {
        e.preventDefault();
        const newDir = keyMap[e.key];
        const opposite = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };

        if (lastDirectionRef.current !== opposite[newDir]) {
          setPlayerSnake((prev) => (prev ? { ...prev, direction: newDir } : prev));
          lastDirectionRef.current = newDir;
        }
      }

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        pauseGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus]);

  const getSnakeColor = (type) => SNAKE_TYPES[type] || SNAKE_TYPES.cyber;

  return (
    <div className="app">
      <div className="grid-bg" />
      <div className="particles">
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>
      <div className="game-container">
        <div className="game-wrapper">
          <SidePanel
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            gameStatus={gameStatus}
            score={score}
            onStart={startGame}
            onPause={pauseGame}
            onRestart={restartGame}
            snakeTypes={SNAKE_TYPES}
          />
          <GameBoard
            gridSize={GRID_SIZE}
            playerSnake={playerSnake}
            enemies={enemies}
            gameStatus={gameStatus}
            getSnakeColor={getSnakeColor}
          />
        </div>
        {showLeaderboard && (
          <Leaderboard
            data={leaderboard}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </div>
      <button
        className="leaderboard-btn"
        onClick={() => setShowLeaderboard(true)}
      >
        Leaderboard
      </button>
    </div>
  );
}

export default App;