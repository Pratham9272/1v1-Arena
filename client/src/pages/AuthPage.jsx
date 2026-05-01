import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signup, login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const mode = searchParams.get("mode") || "signup";
  const redirectTarget = useMemo(
    () => searchParams.get("redirect") || "/",
    [searchParams]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        await signup(form);
      } else {
        await login({ email: form.email, password: form.password });
      }

      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-card">
        <span className="eyebrow">Welcome to 1v1 Arena</span>
        <h1>{mode === "signup" ? "Create your player account" : "Login to continue"}</h1>
        <p>
          New players instantly receive Rs 50 bonus, and if you were redirected from a
          game we will send you right back after authentication.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <label>
              Full name
              <input
                value={form.fullName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, fullName: event.target.value }))
                }
                placeholder="Enter your full name"
                required
                type="text"
              />
            </label>
          ) : null}

          <label>
            Email
            <input
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="Enter your email"
              required
              type="email"
            />
          </label>

          <label>
            Password
            <input
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="Enter password"
              required
              type="password"
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="primary-button full-width" disabled={loading} type="submit">
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Sign Up and Continue"
                : "Login and Continue"}
          </button>
        </form>

        <button
          className="text-button"
          onClick={() =>
            setSearchParams({
              mode: mode === "signup" ? "login" : "signup",
              redirect: redirectTarget
            })
          }
          type="button"
        >
          {mode === "signup"
            ? "Already have an account? Login"
            : "New here? Create an account"}
        </button>
      </section>
    </main>
  );
};
