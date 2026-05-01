import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, login, signup } = useAuth();
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

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTarget]);

  const updateField = (fieldName, value) => {
    setForm((current) => ({ ...current, [fieldName]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalizedEmail = form.email.trim().toLowerCase();
      const normalizedPassword = form.password.trim();
      const normalizedFullName = form.fullName.trim();

      if (mode === "signup") {
        await signup({
          fullName: normalizedFullName,
          email: normalizedEmail,
          password: normalizedPassword
        });
      } else {
        await login({ email: normalizedEmail, password: normalizedPassword });
      }

      navigate(redirectTarget, { replace: true });
    } catch (err) {
      if (mode === "signup" && err.message === "Email is already registered.") {
        setError("This email is already registered. Please switch to login.");
      } else if (mode === "login" && err.message === "Invalid email or password.") {
        setError("Login failed. Please check your email and password.");
      } else {
        setError(err.message);
      }
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
                onChange={(event) => updateField("fullName", event.target.value)}
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
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="Enter your email"
              required
              type="email"
            />
          </label>

          <label>
            Password
            <input
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Enter password"
              required
              type="password"
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}
          {!error ? (
            <p className="muted-text auth-tip">
              {mode === "signup"
                ? "Use a new email for signup. If you already created an account, use login instead."
                : "Login with the same email and password you used during signup."}
            </p>
          ) : null}

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
