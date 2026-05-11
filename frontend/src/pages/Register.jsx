import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "customer",
    company_name: "",
    phone: "",
    city: "",
  });
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <h2>Реєстрація</h2>
        <p className="subtitle">Створіть акаунт на Craft-Device</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="role-toggle">
          <button
            type="button"
            className={form.role === "customer" ? "active" : ""}
            onClick={() => setForm({ ...form, role: "customer" })}
          >
            Замовник
          </button>
          <button
            type="button"
            className={form.role === "manufacturer" ? "active" : ""}
            onClick={() => setForm({ ...form, role: "manufacturer" })}
          >
            Виконавець
          </button>
        </div>

        <div className="form-group">
          <label>Повне ім'я</label>
          <input
            className="form-input"
            name="full_name"
            value={form.full_name}
            onChange={handle}
            placeholder="Іван Петренко"
            required
          />
        </div>

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
            placeholder="Мінімум 6 символів"
            required
          />
        </div>

        {form.role === "manufacturer" && (
          <div className="form-group">
            <label>Назва компанії / майстерні</label>
            <input
              className="form-input"
              name="company_name"
              value={form.company_name}
              onChange={handle}
              placeholder="ФОП Петренко або Майстерня Ковалів"
            />
          </div>
        )}

        <div className="form-group">
          <label>Телефон</label>
          <input
            className="form-input"
            name="phone"
            value={form.phone}
            onChange={handle}
            placeholder="+380 XX XXX XX XX"
          />
        </div>

        <div className="form-group">
          <label>Місто</label>
          <input
            className="form-input"
            name="city"
            value={form.city}
            onChange={handle}
            placeholder="Київ"
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Зареєструватись
        </button>

        <p className="switch-link">
          Вже є акаунт? <Link to="/login">Увійти</Link>
        </p>
      </form>
    </div>
  );
}
