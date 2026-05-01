import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const MatchCard = ({ game }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isMath = game.key === "speed-math";

  const handlePlay = () => {
    if (!isAuthenticated) {
      navigate(`/auth?mode=signup&redirect=${encodeURIComponent(`/lobby/${game.key}`)}`);
      return;
    }

    navigate(`/lobby/${game.key}`);
  };

  return (
    <article className={isMath ? "game-card math-card" : "game-card typing-card"}>
      <div className="game-card-top">
        <span className="status-chip">{game.status}</span>
        <span className="matches-chip">{game.matchesPlayed} matches</span>
      </div>
      <div className="game-art">{isMath ? "01" : "02"}</div>
      <h3>{game.title}</h3>
      <p>{game.description}</p>
      <div className="card-meta">
        <span>{game.durationSeconds}s format</span>
        <span>{isMath ? "Rising difficulty" : "Same prompt for both"}</span>
      </div>
      <div className="fee-row">
        {game.supportedEntryFees.map((fee) => (
          <span key={fee} className="fee-pill">
            Rs {fee}
          </span>
        ))}
      </div>
      <button className="primary-button full-width" onClick={handlePlay} type="button">
        Enter Arena
      </button>
    </article>
  );
};
