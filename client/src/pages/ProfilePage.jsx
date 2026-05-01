import { useAuth } from "../context/AuthContext";

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <main className="page-shell">
      <section className="profile-grid">
        <article className="profile-card">
          <span className="eyebrow">Player profile</span>
          <h1>{user.fullName}</h1>
          <p>{user.email}</p>
          <div className="wallet-big">Rs {user.walletBalance?.toFixed(2)}</div>
          <p className="muted-text">
            Welcome bonus: {user.bonusGranted ? "Rs 50 credited" : "Not credited"}
          </p>
        </article>

        <article className="history-card">
          <span className="eyebrow">Wallet history</span>
          <h2>Recent transactions</h2>
          <div className="history-list">
            {user.walletTransactions?.map((item, index) => (
              <div className="history-row" key={`${item.note}-${index}`}>
                <div>
                  <strong>{item.note}</strong>
                  <p>{new Date(item.createdAt || Date.now()).toLocaleString()}</p>
                </div>
                <span className={item.amount >= 0 ? "amount-positive" : "amount-negative"}>
                  Rs {item.amount}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
};
