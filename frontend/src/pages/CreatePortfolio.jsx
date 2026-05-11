import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { portfolio as portfolioApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CreatePortfolio() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    materials: "",
    production_time_days: "",
    tags: "",
  });
  const [error, setError] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = {
        title: form.title,
        description: form.description || null,
        materials: form.materials || null,
        production_time_days: form.production_time_days
          ? parseInt(form.production_time_days)
          : null,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };
      await portfolioApi.create(data);
      navigate("/portfolio");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="section">
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "1.6rem",
            marginBottom: 8,
            color: "var(--slate-900)",
          }}
        >
          Додати роботу
        </h1>
        <p style={{ color: "var(--slate-500)", marginBottom: 32 }}>
          Покажіть свої кращі роботи потенційним замовникам
        </p>

        <form className="card" style={{ padding: 32 }} onSubmit={submit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label>Назва роботи</label>
            <input
              className="form-input"
              name="title"
              value={form.title}
              onChange={handle}
              placeholder="Наприклад: Дистиляційна колона з нержавіючої сталі"
              required
            />
          </div>

          <div className="form-group">
            <label>Опис</label>
            <textarea
              className="form-input"
              name="description"
              value={form.description}
              onChange={handle}
              placeholder="Опишіть роботу, її особливості та характеристики..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Матеріали</label>
            <input
              className="form-input"
              name="materials"
              value={form.materials}
              onChange={handle}
              placeholder="Нержавіюча сталь AISI 304, мідь"
            />
          </div>

          <div className="form-group">
            <label>Термін виготовлення (днів)</label>
            <input
              className="form-input"
              type="number"
              name="production_time_days"
              value={form.production_time_days}
              onChange={handle}
              placeholder="14"
            />
          </div>

          <div className="form-group">
            <label>Теги (через кому)</label>
            <input
              className="form-input"
              name="tags"
              value={form.tags}
              onChange={handle}
              placeholder="дистиляція, нержавійка, крафтове обладнання"
            />
          </div>

          <button
            className="btn btn-primary btn-large"
            style={{ width: "100%", marginTop: 8 }}
            type="submit"
          >
            Опублікувати
          </button>
        </form>
      </div>
    </div>
  );
}
