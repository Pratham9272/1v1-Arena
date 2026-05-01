import { useEffect, useState } from "react";
import { getDashboard } from "./api/adminClient";

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(setDashboard)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="admin-shell">
      <section className="admin-header">
        <span className="eyebrow">Admin panel</span>
        <h1>1v1 Arena operations dashboard</h1>
        <p>Track users, launch games, match payouts, and wallet exposure from one place.</p>
      </section>

      {error ? <p className="error-text">{error}</p> : null}
      {!dashboard ? <p>Loading dashboard...</p> : null}

      {dashboard ? (
        <>
          <section className="stats-grid">
            <article className="stat-card">
              <strong>{dashboard.stats.totalUsers}</strong>
              <span>Total users</span>
            </article>
            <article className="stat-card">
              <strong>{dashboard.stats.totalMatches}</strong>
              <span>Total matches</span>
            </article>
            <article className="stat-card">
              <strong>Rs {dashboard.stats.totalPrizeDistributed}</strong>
              <span>Prize distributed</span>
            </article>
            <article className="stat-card">
              <strong>Rs {dashboard.stats.totalRefundDistributed}</strong>
              <span>Refund distributed</span>
            </article>
          </section>

          <section className="admin-grid">
            <article className="panel-card">
              <h2>Games</h2>
              {dashboard.games.map((game) => (
                <div className="row-card" key={game.key}>
                  <strong>{game.title}</strong>
                  <p>
                    Entry: {game.supportedEntryFees.map((fee) => `Rs ${fee}`).join(", ")}
                  </p>
                </div>
              ))}
            </article>

            <article className="panel-card">
              <h2>Recent users</h2>
              {dashboard.users.slice(0, 6).map((user) => (
                <div className="row-card" key={user._id}>
                  <strong>{user.fullName}</strong>
                  <p>
                    {user.email} | Wallet: Rs {user.walletBalance}
                  </p>
                </div>
              ))}
            </article>

            <article className="panel-card wide">
              <h2>Recent matches</h2>
              {dashboard.matches.slice(0, 8).map((match) => (
                <div className="row-card" key={match._id}>
                  <strong>
                    {match.gameKey} | Entry Rs {match.entryFee}
                  </strong>
                  <p>
                    Winner payout: Rs {match.payout?.winnerAmount} | Refund: Rs{" "}
                    {match.payout?.loserRefund}
                  </p>
                </div>
              ))}
            </article>
          </section>
        </>
      ) : null}
    </main>
  );
}
