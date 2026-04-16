import './Leaderboard.css';

function Leaderboard({ data, onClose }) {
  return (
    <div className="leaderboard-overlay">
      <div className="leaderboard-modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2>LEADERBOARD</h2>

        <div className="leaderboard-section">
          <h3>Top 10</h3>
          {data.top10.length === 0 ? (
            <p className="empty-message">No scores yet</p>
          ) : (
            <ul className="score-list top10-list">
              {data.top10.map((entry, idx) => (
                <li key={idx} className={`rank rank-${idx + 1}`}>
                  <span className="rank-number">#{idx + 1}</span>
                  <span className="rank-score">{entry.score}</span>
                  <span className="rank-date">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="leaderboard-section">
          <h3>Match History</h3>
          {data.history.length === 0 ? (
            <p className="empty-message">No matches played</p>
          ) : (
            <ul className="score-list history-list">
              {data.history.slice(-20).reverse().map((entry, idx) => (
                <li key={idx} className="history-entry">
                  <span className="history-score">{entry.score}</span>
                  <span className="history-date">
                    {new Date(entry.date).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;