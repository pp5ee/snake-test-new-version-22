import { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from './components/GameBoard';
import SidePanel from './components/SidePanel';
import Leaderboard from './components/Leaderboard';
import './App.css';
import {
  GRID_SIZE,
  SNAKE_TYPES,
  DIRECTIONS,
  canChangeDirection,
  getSafeDirections,
  resolveCombat,
  calculateScore,
  spawnEnemies,
} from './gameHelpers';

const TICK_RATE = 120;

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

  const saveScore = (finalScore, snakeTypeUsed) => {
    const newEntry = {
      score: finalScore,
      date: new Date().toISOString(),
      snakeType: snakeTypeUsed,
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

    const newEnemies = spawnEnemies(player.body, GRID_SIZE, SNAKE_TYPES);

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
    const snakeTypeUsed = playerSnake?.type || selectedType;
    setGameStatus('gameover');
    if (score > 0) {
      saveScore(score, snakeTypeUsed);
    }
  }, [score, playerSnake, selectedType]);

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
        // Process enemies sequentially to reserve cells and prevent simultaneous collision
        const newEnemies = [];
        const reservedCells = new Set();

        for (const enemy of prevEnemies) {
          const safeDirs = getSafeDirections(enemy, prevEnemies, GRID_SIZE, reservedCells);

          let chosenDir;
          if (safeDirs.length > 0) {
            // Bias toward continuing in the current direction (40% of the time)
            // to make movement look more natural, but still randomise freely.
            if (Math.random() < 0.4 && safeDirs.includes(enemy.direction)) {
              chosenDir = enemy.direction;
            } else {
              chosenDir = safeDirs[Math.floor(Math.random() * safeDirs.length)];
            }
          } else {
            // No safe direction – pick any direction that is not the direct opposite
            // (avoids 180° reversal into own neck as a last resort).
            const fallback = Object.keys(DIRECTIONS).filter((d) =>
              canChangeDirection(enemy.direction, d)
            );
            chosenDir = fallback[Math.floor(Math.random() * fallback.length)];
          }

          const delta = DIRECTIONS[chosenDir];
          const newEnemyHead = {
            x: enemy.body[0].x + delta.x,
            y: enemy.body[0].y + delta.y,
          };
          const movedBody = [newEnemyHead, ...enemy.body.slice(0, -1)];

          // Reserve the new head cell to prevent later enemies from moving there
          reservedCells.add(`${newEnemyHead.x},${newEnemyHead.y}`);
          newEnemies.push({ ...enemy, direction: chosenDir, body: movedBody });
        }

        // Now check combat with the NEW enemy positions (after all enemies have moved)
        return newEnemies.filter((enemy) => {
          const playerSize = newBody.length;
          const enemySize = enemy.body.length;

          // Check collision with ANY enemy body segment, not just the head
          const hitEnemy = enemy.body.some(
            (seg) => seg.x === newHead.x && seg.y === newHead.y
          );
          if (hitEnemy) {
            const outcome = resolveCombat(playerSize, enemySize);
            if (outcome === 'die') {
              handleGameOver();
              return true;
            } else {
              // Player eats the enemy – accumulate growth equal to enemy size
              playerGrowth += enemySize;
              setScore((s) => s + calculateScore(enemySize));
              return false;
            }
          }
          return true;
        });
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

        if (canChangeDirection(lastDirectionRef.current, newDir)) {
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