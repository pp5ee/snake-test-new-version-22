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

        enemy = {
          id: i,
          body: Array.from({ length }, (_, idx) => ({
            x: startX,
            y: startY + idx,
          })),
          direction,
          type: Object.keys(SNAKE_TYPES)[Math.floor(Math.random() * 4)],
          length,
        };

        const overlapsPlayer = enemy.body.some(
          (seg) => Math.abs(seg.x - player.body[0].x) < 5 && Math.abs(seg.y - player.body[0].y) < 5
        );
        const overlapsOther = newEnemies.some((e) =>
          e.body.some((seg) =>
            Math.abs(seg.x - enemy.body[0].x) < 3 && Math.abs(seg.y - enemy.body[0].y) < 3
          )
        );

        if (!overlapsPlayer && !overlapsOther) {
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
  }, []);

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

      const newBody = [newHead, ...prev.body.slice(0, -1)];

      setEnemies((prevEnemies) => {
        let ateEnemy = false;
        let enemyEaten = -1;
        let growthPoints = 0;

        const newEnemies = prevEnemies
          .map((enemy) => {
            let enemyDir = DIRECTIONS[enemy.direction];
            const enemyHead = enemy.body[0];
            const newEnemyHead = {
              x: enemyHead.x + enemyDir.x,
              y: enemyHead.y + enemyDir.y,
            };

            if (
              newEnemyHead.x < 0 ||
              newEnemyHead.x >= GRID_SIZE ||
              newEnemyHead.y < 0 ||
              newEnemyHead.y >= GRID_SIZE
            ) {
              const directions = Object.keys(DIRECTIONS).filter(
                (d) => d !== enemy.direction
              );
              const newDir = directions[Math.floor(Math.random() * directions.length)];
              enemy.direction = newDir;
              enemyDir = DIRECTIONS[newDir];
              return enemy;
            }

            const movedBody = [newEnemyHead, ...enemy.body.slice(0, -1)];
            return { ...enemy, body: movedBody };
          })
          .filter((enemy) => {
            const playerSize = newBody.length;
            const enemySize = enemy.body.length;

            if (
              newHead.x === enemy.body[0].x &&
              newHead.y === enemy.body[0].y
            ) {
              if (enemySize >= playerSize) {
                handleGameOver();
                return true;
              } else {
                ateEnemy = true;
                enemyEaten = enemy.id;
                growthPoints = enemySize;
                setScore((s) => s + enemySize);
                return false;
              }
            }
            return true;
          });

        if (ateEnemy) {
          return newEnemies.map((e) => {
            if (e.body.length < 10) {
              const dir = DIRECTIONS[e.direction];
              const tail = e.body[e.body.length - 1];
              return {
                ...e,
                body: [...e.body, { x: tail.x + dir.x, y: tail.y + dir.y }],
                length: e.length + 1,
              };
            }
            return e;
          });
        }

        return newEnemies;
      });

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