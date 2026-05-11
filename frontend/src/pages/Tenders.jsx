import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Plus, MapPin, Clock, Gavel } from "lucide-react";
import { tenders as tendersApi, categories as categoriesApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Tenders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState(searchParams.get("category_id") || "");

  useEffect(() => {
    const urlCat = searchParams.get("category_id") || "";
    if (urlCat !== catFilter) setCatFilter(urlCat);
  }, [searchParams]);

  useEffect(() => {
    categoriesApi.list().then(setCats).catch(() => {});
  }, []);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (catFilter) params.category_id = catFilter;
    tendersApi.list(params).then(setItems).catch(() => {});
  }, [search, catFilter]);

  return (
    <div className="section">
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.8rem", color: "var(--slate-900)" }}>
              Тендери
            </h1>
            <p style={{ color: "var(--slate-500)" }}>
              Знайдіть замовлення або оголосіть свій тендер
            </p>
          </div>
          {user && (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/tenders/create")}
            >
              <Plus size={18} /> Створити тендер
            </button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flex: "1 1 300px" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--slate-400)",
              }}
            />
            <input
              className="form-input"
              style={{ paddingLeft: 38 }}
              placeholder="Пошук тендерів..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-input"
            style={{ width: "auto", minWidth: 200 }}
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
          >
            <option value="">Усі категорії</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>Тендерів поки немає</h3>
            <p>Створіть перший тендер або змініть фільтри</p>
          </div>
        ) : (
          <div className="tenders-grid">
            {items.map((t) => (
              <Link
                to={`/tenders/${t.id}`}
                key={t.id}
                className="card tender-card"
                style={{ textDecoration: "none", color: "inherit", padding: 0, overflow: "hidden" }}
              >
                {t.image_url && (
                  <div className="tender-image">
                    <img src={t.image_url} alt={t.title} />
                  </div>
                )}
                <div style={{ padding: 20 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <span className={`badge badge-${t.status}`}>
                      {t.status === "active"
                        ? "Активний"
                        : t.status === "in_progress"
                        ? "В роботі"
                        : t.status}
                    </span>
                    {t.category_name && (
                      <span className="tag">{t.category_name}</span>
                    )}
                  </div>
                  <h3>{t.title}</h3>
                  <p className="description">{t.description}</p>
                  <div className="tender-meta">
                    {t.location && (
                      <span>
                        <MapPin size={14} /> {t.location}
                      </span>
                    )}
                    {t.deadline && (
                      <span>
                        <Clock size={14} />{" "}
                        {new Date(t.deadline).toLocaleDateString("uk-UA")}
                      </span>
                    )}
                    <span>
                      <Gavel size={14} /> {t.bids_count} ставок
                    </span>
                  </div>
                  <div className="tender-footer">
                    <span className="tender-budget">
                      {t.budget_min && t.budget_max
                        ? `${t.budget_min.toLocaleString()} – ${t.budget_max.toLocaleString()} ${t.currency}`
                        : "Договірна"}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--slate-400)" }}>
                      {t.owner_name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
