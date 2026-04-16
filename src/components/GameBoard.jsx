import './GameBoard.css';

function GameBoard({ gridSize, playerSnake, enemies, gameStatus, getSnakeColor }) {
  const cells = [];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const isPlayerHead =
        playerSnake && playerSnake.body[0].x === x && playerSnake.body[0].y === y;
      const isPlayerBody =
        playerSnake &&
        playerSnake.body.slice(1).some((seg) => seg.x === x && seg.y === y);

      let isEnemyHead = false;
      let isEnemyBody = false;
      let enemyType = null;

      for (const enemy of enemies) {
        if (enemy.body[0].x === x && enemy.body[0].y === y) {
          isEnemyHead = true;
          enemyType = enemy.type;
          break;
        }
        if (enemy.body.slice(1).some((seg) => seg.x === x && seg.y === y)) {
          isEnemyBody = true;
          enemyType = enemy.type;
        }
      }

      const playerColor = playerSnake ? getSnakeColor(playerSnake.type || 'cyber') : null;
      const enemyColor = enemyType ? getSnakeColor(enemyType) : null;

      let cellClass = 'cell';
      if (isPlayerHead) cellClass += ' player-head';
      else if (isPlayerBody) cellClass += ' player-body';
      else if (isEnemyHead) cellClass += ' enemy-head';
      else if (isEnemyBody) cellClass += ' enemy-body';

      cells.push(
        <div
          key={`${x}-${y}`}
          className={cellClass}
          style={
            isPlayerHead || isPlayerBody
              ? {
                  backgroundColor: playerColor?.color,
                  boxShadow: `0 0 8px ${playerColor?.color}, 0 0 16px ${playerColor?.secondary}`,
                }
              : isEnemyHead || isEnemyBody
              ? {
                  backgroundColor: enemyColor?.color,
                  boxShadow: `0 0 6px ${enemyColor?.color}`,
                }
              : {}
          }
        />
      );
    }
  }

  return (
    <div className="game-board-wrapper">
      <div
        className="game-board"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {cells}
      </div>
      {gameStatus === 'gameover' && (
        <div className="game-over-overlay">
          <div className="game-over-text">GAME OVER</div>
        </div>
      )}
      {gameStatus === 'paused' && (
        <div className="pause-overlay">
          <div className="pause-text">PAUSED</div>
        </div>
      )}
    </div>
  );
}

export default GameBoard;