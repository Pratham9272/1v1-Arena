import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { useAuth } from "../context/AuthContext";

export const LobbyPage = () => {
  const { gameKey } = useParams();
  const navigate = useNavigate();
  const { token, updateWalletBalance } = useAuth();
  const [games, setGames] = useState([]);
  const [entryFee, setEntryFee] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGames = async () => {
      const data = await apiClient.get("/games");
      setGames(data.games);
    };

    loadGames().catch((err) => setError(err.message));
  }, []);

  const game = useMemo(
    () => games.find((item) => item.key === gameKey),
    [gameKey, games]
  );

  useEffect(() => {
    if (game) {
      setEntryFee(game.defaultEntryFee);
    }
  }, [game]);

  const handleStart = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiClient.post(
        "/games/matches",
        { gameKey, entryFee },
        token
      );

      updateWalletBalance(data.userWalletBalance);

      navigate(
        gameKey === "speed-math"
          ? `/play/speed-math/${data.match.id}`
          : `/play/typing-race/${data.match.id}`,
        { state: data.match }
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!game) {
    return <main className="page-shell">Loading lobby...</main>;
  }

  return (
    <main className="page-shell">
      <section className="lobby-card">
        <span className="eyebrow">Ready for match</span>
        <h1>{game.title}</h1>
        <p>{game.description}</p>

        <div className="rules-grid">
          {game.howItWorks.map((rule) => (
            <div className="rule-card" key={rule}>
              {rule}
            </div>
          ))}
        </div>

        <div className="entry-selector">
          <p>Select entry fee</p>
          <div className="fee-row">
            {game.supportedEntryFees.map((fee) => (
              <button
                className={fee === entryFee ? "fee-pill active" : "fee-pill"}
                key={fee}
                onClick={() => setEntryFee(fee)}
                type="button"
              >
                Rs {fee}
              </button>
            ))}
          </div>
        </div>

        <div className="payout-preview">
          <p>Total pool: Rs {(entryFee * 2).toFixed(2)}</p>
          <p>Winner gets: Rs {(entryFee * 1.5).toFixed(2)}</p>
          <p>Loser refund: Rs {(entryFee * 0.5).toFixed(2)}</p>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        <button className="primary-button full-width" disabled={loading} onClick={handleStart}>
          {loading ? "Matching opponent..." : "Start Match"}
        </button>
      </section>
    </main>
  );
};
