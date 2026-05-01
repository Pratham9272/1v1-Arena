import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { MatchCard } from "../components/MatchCard";

export const HomePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await apiClient.get("/games");
        setGames(data.games);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Skill-based 1v1 battles</span>
          <div className="headline-kicker">Fast rounds. Small stakes. Clean wins.</div>
          <h1>Play sharp one-versus-one matches built for speed, focus, and payout clarity.</h1>
          <p>
            Join fast one versus one contests with Rs 5 or Rs 10 entry, get a Rs 50
            welcome bonus, and track everything from your wallet and profile.
          </p>
          <div className="hero-cta-row">
            <a className="primary-button" href="#games">
              Explore Games
            </a>
            <a className="ghost-button hero-ghost" href="#format">
              See Payout Format
            </a>
          </div>
          <div className="hero-metrics">
            <div>
              <strong>75%</strong>
              <span>Winner gets seventy five percent of the total pool.</span>
            </div>
            <div>
              <strong>25%</strong>
              <span>Losing player receives a refund slice back to wallet.</span>
            </div>
            <div>
              <strong>35s</strong>
              <span>Short match duration keeps every round intense.</span>
            </div>
          </div>
        </div>
        <div className="hero-panel">
          <p className="panel-label">Tonight's board</p>
          <div className="hero-board">
            <div className="board-topline">
              <span>Live launch modes</span>
              <span>2 games</span>
            </div>
            <div className="board-rows">
              <div className="board-row">
                <strong>Speed Math</strong>
                <span>35s sprint</span>
              </div>
              <div className="board-row">
                <strong>Typing Race</strong>
                <span>same prompt</span>
              </div>
            </div>
          </div>
          <div className="payout-showcase" id="format">
            <div className="payout-card winner-card">
              <h3>Rs 5 vs Rs 5</h3>
              <p>Total pool: Rs 10</p>
              <p>Winner receives: Rs 7.5</p>
              <p>Loser receives: Rs 2.5</p>
            </div>
            <div className="payout-card refund-card">
              <h3>Rs 10 vs Rs 10</h3>
              <p>Total pool: Rs 20</p>
              <p>Winner receives: Rs 15</p>
              <p>Loser receives: Rs 5</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block" id="games">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Launch games</span>
            <h2>Start with two clean, competitive game modes.</h2>
          </div>
        </div>

        {loading ? <p>Loading games...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        <div className="games-grid">
          {games.map((game) => (
            <MatchCard game={game} key={game.key} />
          ))}
        </div>
      </section>

      <section className="section-block info-grid">
        <article className="info-panel">
          <span className="eyebrow">Why this feels fair</span>
          <h2>Every match follows the same simple payout rule.</h2>
          <div className="format-steps">
            <div className="format-step">
              <strong>01</strong>
              <p>Two players join the same entry amount.</p>
            </div>
            <div className="format-step">
              <strong>02</strong>
              <p>The total pool is created instantly from both entries.</p>
            </div>
            <div className="format-step">
              <strong>03</strong>
              <p>The winner gets 75% and the other player gets 25% back.</p>
            </div>
          </div>
        </article>

        <article className="info-panel contrast-panel">
          <span className="eyebrow">Launch notes</span>
          <h2>Built for short matches and repeat play.</h2>
          <div className="launch-points">
            <div>
              <strong>Speed Math</strong>
              <p>Difficulty ramps up every five questions so strong players pull away late.</p>
            </div>
            <div>
              <strong>Typing Race</strong>
              <p>Both users receive the same 20 to 30 word sentence for a balanced race.</p>
            </div>
            <div>
              <strong>Welcome Bonus</strong>
              <p>Every new player starts with Rs 50 in wallet to begin immediately.</p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
};
