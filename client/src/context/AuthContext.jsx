import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { apiClient } from "../api/client";

const AuthContext = createContext(null);
const storageKey = "one-v-one-auth";

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : { token: "", user: null };
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(authState));
  }, [authState]);

  const refreshProfile = async () => {
    if (!authState.token) return;
    const data = await apiClient.get("/auth/me", authState.token);
    setAuthState((current) => ({ ...current, user: data.user }));
  };

  const signup = async (payload) => {
    const data = await apiClient.post("/auth/signup", payload);
    setAuthState(data);
    return data;
  };

  const login = async (payload) => {
    const data = await apiClient.post("/auth/login", payload);
    setAuthState(data);
    return data;
  };

  const logout = () => {
    setAuthState({ token: "", user: null });
  };

  const updateWalletBalance = (walletBalance) => {
    setAuthState((current) => ({
      ...current,
      user: current.user ? { ...current.user, walletBalance } : current.user
    }));
  };

  const value = useMemo(
    () => ({
      token: authState.token,
      user: authState.user,
      isAuthenticated: Boolean(authState.token && authState.user),
      signup,
      login,
      logout,
      refreshProfile,
      updateWalletBalance
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
