import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Image as ImageIcon } from "lucide-react";
import { portfolio as portfolioApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Portfolio() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    portfolioApi.list(params).then(setItems).catch(() => {});
  }, [search]);

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
              Портфоліо виконавців
            </h1>
            <p style={{ color: "var(--slate-500)" }}>
              Роботи майстрів та виробників обладнання
            </p>
          </div>
          {user && user.role === "manufacturer" && (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/portfolio/create")}
            >
              <Plus size={18} /> Додати роботу
            </button>
          )}
        </div>

        <div style={{ position: "relative", marginBottom: 24 }}>
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
            placeholder="Пошук робіт..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎨</div>
            <h3>Портфоліо порожнє</h3>
            <p>
              Виконавці ще не додали своїх робіт
            </p>
          </div>
        ) : (
          <div className="portfolio-grid">
            {items.map((item) => (
              <div key={item.id} className="card portfolio-card">
                <div className="portfolio-image">
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.title} />
                  ) : (
                    <ImageIcon size={48} />
                  )}
                </div>
                <div className="portfolio-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{ fontSize: "0.85rem", color: "var(--slate-500)" }}
                    >
                      {item.owner_name}
                      {item.owner_company && ` · ${item.owner_company}`}
                    </span>
                    {item.production_time_days && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--slate-400)",
                        }}
                      >
                        ~{item.production_time_days} днів
                      </span>
                    )}
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="portfolio-tags">
                      {item.tags.map((tag, i) => (
                        <span key={i} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
