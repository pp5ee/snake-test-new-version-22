import './SidePanel.css';

function SidePanel({
  selectedType,
  setSelectedType,
  gameStatus,
  score,
  onStart,
  onPause,
  onRestart,
  snakeTypes,
}) {
  return (
    <div className="side-panel">
      <div className="panel-header">
        <h1>CYBER SNAKE</h1>
        <div className="score-display">
          <span className="score-label">SCORE</span>
          <span className="score-value">{score}</span>
        </div>
      </div>

      <div className="snake-selection">
        <h2>Select Snake Type</h2>
        <div className="snake-types">
          {Object.entries(snakeTypes).map(([key, type]) => (
            <button
              key={key}
              className={`snake-type-btn ${selectedType === key ? 'active' : ''}`}
              onClick={() => setSelectedType(key)}
              style={{
                '--primary': type.color,
                '--secondary': type.secondary,
              }}
            >
              <div className="snake-preview">
                <div
                  className="preview-segment"
                  style={{ backgroundColor: type.color }}
                />
                <div
                  className="preview-segment"
                  style={{ backgroundColor: type.secondary }}
                />
                <div
                  className="preview-segment"
                  style={{ backgroundColor: type.color }}
                />
              </div>
              <span className="snake-name">{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="game-controls">
        {gameStatus === 'idle' || gameStatus === 'gameover' ? (
          <button className="control-btn start-btn" onClick={onStart}>
            START GAME
          </button>
        ) : (
          <>
            <button
              className="control-btn pause-btn"
              onClick={onPause}
            >
              {gameStatus === 'paused' ? 'RESUME' : 'PAUSE'}
            </button>
            <button className="control-btn restart-btn" onClick={onRestart}>
              RESTART
            </button>
          </>
        )}
      </div>

      <div className="controls-info">
        <h3>Controls</h3>
        <p>Arrow Keys - Move</p>
        <p>Space / P - Pause</p>
      </div>
    </div>
  );
}

export default SidePanel;