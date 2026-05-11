import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, FileText, Gavel, Briefcase, Clock, CheckCircle, XCircle } from "lucide-react";
import {
  tenders as tendersApi,
  portfolio as portfolioApi,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const STATUS_LABELS = {
  pending: "Очікує",
  accepted: "Прийнято",
  rejected: "Відхилено",
  withdrawn: "Відкликано",
};

const STATUS_ICONS = {
  pending: <Clock size={14} />,
  accepted: <CheckCircle size={14} />,
  rejected: <XCircle size={14} />,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState("tenders");
  const [myTenders, setMyTenders] = useState([]);
  const [myPortfolio, setMyPortfolio] = useState([]);
  const [myBids, setMyBids] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    tendersApi.list({}).then((all) => {
      setMyTenders(all.filter((t) => t.owner_id === user.id));
    }).catch(() => {});
    if (user.role === "manufacturer") {
      portfolioApi
        .list({ owner_id: user.id })
        .then(setMyPortfolio)
        .catch(() => {});
      tendersApi.myBids().then(setMyBids).catch(() => {});
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Привіт, {user.full_name}!</h1>
          <p style={{ color: "var(--slate-500)" }}>
            {user.role === "manufacturer" ? "Виконавець" : "Замовник"}
            {user.company_name && ` · ${user.company_name}`}
            {user.city && ` · ${user.city}`}
          </p>
          {user.bio && (
            <p style={{ color: "var(--slate-600)", marginTop: 8, fontSize: "0.95rem", maxWidth: 600 }}>
              {user.bio}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/tenders/create")}
          >
            <Plus size={16} /> Тендер
          </button>
          {user.role === "manufacturer" && (
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/portfolio/create")}
            >
              <Plus size={16} /> Портфоліо
            </button>
          )}
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="card dash-stat">
          <div className="value">{myTenders.length}</div>
          <div className="label">Мої тендери</div>
        </div>
        {user.role === "manufacturer" && (
          <>
            <div className="card dash-stat">
              <div className="value">{myPortfolio.length}</div>
              <div className="label">Роботи в портфоліо</div>
            </div>
            <div className="card dash-stat">
              <div className="value">{myBids.length}</div>
              <div className="label">Мої ставки</div>
            </div>
          </>
        )}
        <div className="card dash-stat">
          <div className="value">{user.rating}</div>
          <div className="label">Рейтинг</div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${tab === "tenders" ? "active" : ""}`}
          onClick={() => setTab("tenders")}
        >
          <FileText size={16} style={{ marginRight: 6, verticalAlign: -3 }} />
          Мої тендери
        </button>
        {user.role === "manufacturer" && (
          <>
            <button
              className={`tab ${tab === "bids" ? "active" : ""}`}
              onClick={() => setTab("bids")}
            >
              <Gavel size={16} style={{ marginRight: 6, verticalAlign: -3 }} />
              Мої ставки
            </button>
            <button
              className={`tab ${tab === "portfolio" ? "active" : ""}`}
              onClick={() => setTab("portfolio")}
            >
              <Briefcase size={16} style={{ marginRight: 6, verticalAlign: -3 }} />
              Портфоліо
            </button>
          </>
        )}
      </div>

      {tab === "tenders" && (
        <>
          {myTenders.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📋</div>
              <h3>У вас ще немає тендерів</h3>
              <p style={{ marginBottom: 16 }}>
                Створіть перший тендер для пошуку виконавця
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/tenders/create")}
              >
                <Plus size={16} /> Створити тендер
              </button>
            </div>
          ) : (
            <div className="tenders-grid">
              {myTenders.map((t) => (
                <Link
                  to={`/tenders/${t.id}`}
                  key={t.id}
                  className="card tender-card"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <span className={`badge badge-${t.status}`}>
                      {t.status === "active"
                        ? "Активний"
                        : t.status === "in_progress"
                        ? "В роботі"
                        : t.status}
                    </span>
                  </div>
                  <h3>{t.title}</h3>
                  <p className="description">{t.description}</p>
                  <div className="tender-footer">
                    <span className="tender-budget">
                      {t.budget_min && t.budget_max
                        ? `${t.budget_min.toLocaleString()} – ${t.budget_max.toLocaleString()} ${t.currency}`
                        : "Договірна"}
                    </span>
                    <span className="bids-count">
                      <Gavel size={14} style={{ marginRight: 4 }} />
                      {t.bids_count} ставок
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "bids" && (
        <>
          {myBids.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🎯</div>
              <h3>Ви ще не подавали ставок</h3>
              <p style={{ marginBottom: 16 }}>
                Перегляньте активні тендери та подайте свою пропозицію
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/tenders")}
              >
                Переглянути тендери
              </button>
            </div>
          ) : (
            <div className="tenders-grid">
              {myBids.map((b) => (
                <Link
                  to={`/tenders/${b.tender_id}`}
                  key={b.id}
                  className="card tender-card"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <span className={`badge badge-${b.status}`}>
                      {STATUS_ICONS[b.status]} {STATUS_LABELS[b.status] || b.status}
                    </span>
                  </div>
                  <h3>{b.tender_title}</h3>
                  <p className="description" style={{ fontStyle: "italic", color: "var(--slate-600)" }}>
                    {b.message}
                  </p>
                  <div className="tender-footer">
                    <span className="tender-budget">
                      Моя ставка: {b.amount.toLocaleString()} {b.currency}
                    </span>
                    <span className="bids-count">
                      <Clock size={14} style={{ marginRight: 4 }} />
                      {b.estimated_days} днів
                    </span>
                  </div>
                  {b.tender_budget_min && b.tender_budget_max && (
                    <div style={{ fontSize: "0.85rem", color: "var(--slate-500)", marginTop: 8 }}>
                      Бюджет тендера: {b.tender_budget_min.toLocaleString()} – {b.tender_budget_max.toLocaleString()} {b.currency}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "portfolio" && (
        <>
          {myPortfolio.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🎨</div>
              <h3>Портфоліо порожнє</h3>
              <p style={{ marginBottom: 16 }}>
                Додайте свої кращі роботи
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/portfolio/create")}
              >
                <Plus size={16} /> Додати роботу
              </button>
            </div>
          ) : (
            <div className="portfolio-grid">
              {myPortfolio.map((item) => (
                <div key={item.id} className="card portfolio-card">
                  {item.images && item.images.length > 0 && (
                    <div className="portfolio-image">
                      <img src={item.images[0]} alt={item.title} />
                    </div>
                  )}
                  <div className="portfolio-body">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    {item.materials && (
                      <div style={{ fontSize: "0.85rem", color: "var(--slate-600)", marginTop: 8 }}>
                        Матеріали: {item.materials}
                      </div>
                    )}
                    {item.production_time_days && (
                      <div style={{ fontSize: "0.85rem", color: "var(--slate-600)", marginTop: 4 }}>
                        Термін виготовлення: {item.production_time_days} днів
                      </div>
                    )}
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
        </>
      )}
    </div>
  );
}
