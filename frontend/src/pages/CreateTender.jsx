import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tenders as tendersApi, categories as categoriesApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CreateTender() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    budget_min: "",
    budget_max: "",
    location: "",
    deadline: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
    categoriesApi.list().then(setCats).catch(() => {});
  }, [user, navigate]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = {
        title: form.title,
        description: form.description,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        budget_min: form.budget_min ? parseFloat(form.budget_min) : null,
        budget_max: form.budget_max ? parseFloat(form.budget_max) : null,
        location: form.location || null,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      };
      const tender = await tendersApi.create(data);
      navigate(`/tenders/${tender.id}`);
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
          Створити тендер
        </h1>
        <p
          style={{ color: "var(--slate-500)", marginBottom: 32 }}
        >
          Опишіть яке обладнання вам потрібно та встановіть бюджет
        </p>

        <form className="card" style={{ padding: 32 }} onSubmit={submit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label>Назва тендеру</label>
            <input
              className="form-input"
              name="title"
              value={form.title}
              onChange={handle}
              placeholder="Наприклад: Міні-пивоварня на 100л"
              required
            />
          </div>

          <div className="form-group">
            <label>Детальний опис</label>
            <textarea
              className="form-input"
              name="description"
              value={form.description}
              onChange={handle}
              placeholder="Опишіть технічні вимоги, матеріали, розміри, продуктивність..."
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label>Категорія</label>
            <select
              className="form-input"
              name="category_id"
              value={form.category_id}
              onChange={handle}
            >
              <option value="">Оберіть категорію</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div className="form-group">
              <label>Бюджет від (₴)</label>
              <input
                className="form-input"
                type="number"
                name="budget_min"
                value={form.budget_min}
                onChange={handle}
                placeholder="5000"
              />
            </div>
            <div className="form-group">
              <label>Бюджет до (₴)</label>
              <input
                className="form-input"
                type="number"
                name="budget_max"
                value={form.budget_max}
                onChange={handle}
                placeholder="15000"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Місто / Регіон</label>
            <input
              className="form-input"
              name="location"
              value={form.location}
              onChange={handle}
              placeholder="Київ"
            />
          </div>

          <div className="form-group">
            <label>Дедлайн</label>
            <input
              className="form-input"
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handle}
            />
          </div>

          <button
            className="btn btn-primary btn-large"
            style={{ width: "100%", marginTop: 8 }}
            type="submit"
          >
            Опублікувати тендер
          </button>
        </form>
      </div>
    </div>
  );
}
