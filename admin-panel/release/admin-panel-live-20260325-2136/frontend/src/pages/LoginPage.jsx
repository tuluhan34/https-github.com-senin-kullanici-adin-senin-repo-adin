import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  function onChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      if (mode === "register") {
        await register(form.name, form.email, form.password);
        setInfo("Registration completed. You can now login.");
        setMode("login");
      } else {
        await login(form.email, form.password);
        navigate("/dashboard", { replace: true });
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Admin Control Panel</h1>
        <p>Sign in with your credentials to manage users, data, settings and analytics.</p>
        <div className="mode-switch">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            Login
          </button>
          <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            Register
          </button>
        </div>

        {mode === "register" ? (
          <label>
            Full name
            <input name="name" value={form.name} onChange={onChange} minLength={2} required />
          </label>
        ) : null}

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={onChange} required />
        </label>

        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={onChange} minLength={8} required />
        </label>

        {error ? <p className="error">{error}</p> : null}
        {info ? <p className="ok">{info}</p> : null}

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "register" ? "Create account" : "Login"}
        </button>

        <small>Demo admin: admin@example.com / Admin123!</small>
      </form>
    </div>
  );
}
