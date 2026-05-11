import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <h2>Вхід</h2>
        <p className="subtitle">Увійдіть у свій акаунт Craft-Device</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            value={form.email}
            onChange={handle}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Пароль</label>
          <input
            className="form-input"
            type="password"
            name="password"
            value={form.password}
            onChange={handle}
            placeholder="••••••••"
            required
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Увійти
        </button>

        <p className="switch-link">
          Немає акаунту? <Link to="/register">Зареєструватись</Link>
        </p>
      </form>
    </div>
  );
}
