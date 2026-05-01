import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-badge">1v1</span>
        <span className="brand-copy">
          <strong>Arena</strong>
          <small>Cash skill battles</small>
        </span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <a href="#games">Games</a>
        <a href="#format">Format</a>
      </nav>

      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <div className="wallet-pill">Wallet: Rs {user.walletBalance?.toFixed(2)}</div>
            <button
              className="profile-chip"
              onClick={() => navigate("/profile")}
              type="button"
            >
              {user.fullName}
            </button>
            <button className="ghost-button" onClick={logout} type="button">
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="ghost-button" onClick={() => navigate("/auth?mode=login")}>
              Login
            </button>
            <button className="primary-button" onClick={() => navigate("/auth?mode=signup")}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};
