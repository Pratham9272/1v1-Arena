import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/auth?mode=login&redirect=${encodeURIComponent(
          `${location.pathname}${location.search}`
        )}`}
        replace
      />
    );
  }

  return children;
};
