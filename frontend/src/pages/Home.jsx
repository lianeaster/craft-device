import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  FileUp,
  Gavel,
  BriefcaseBusiness,
  Shield,
  Globe,
  ArrowRight,
} from "lucide-react";
import {
  categories as categoriesApi,
  tenders as tendersApi,
  stats as statsApi,
} from "../services/api";

export default function Home() {
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [recent, setRecent] = useState([]);
  const [siteStats, setSiteStats] = useState(null);

  useEffect(() => {
    categoriesApi.list().then(setCats).catch(() => {});
    tendersApi.list({ limit: 6 }).then(setRecent).catch(() => {});
    statsApi.get().then(setSiteStats).catch(() => {});
  }, []);

  return (
    <>
      {/* ── Hero ──────────────────────────────── */}
      <section className="hero">
        <div className="hero-content">
          <h1>Крафтове обладнання на замовлення</h1>
          <p>
            Знайдіть майстра для виготовлення унікального обладнання або
            запропонуйте свої послуги. Тендери, конкурентні ціни, портфоліо
            виконавців.
          </p>
          <div className="hero-actions">
            <button
              className="btn btn-primary btn-large"
              onClick={() => navigate("/tenders")}
            >
              <Search size={18} />
              Переглянути тендери
            </button>
            <button
              className="btn btn-secondary btn-large"
              onClick={() => navigate("/constructor")}
            >
              <FileUp size={18} />
              Завантажити креслення
            </button>
          </div>
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-value">
                {siteStats ? siteStats.manufacturers : "—"}
              </div>
              <div className="stat-label">Виконавців</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {siteStats ? siteStats.tenders : "—"}
              </div>
              <div className="stat-label">Тендерів</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {siteStats ? siteStats.bids : "—"}
              </div>
              <div className="stat-label">Ставок</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {siteStats ? siteStats.portfolio_items : "—"}
              </div>
              <div className="stat-label">Робіт у портфоліо</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────── */}
      <section className="section">
        <h2 className="section-title">Як це працює</h2>
        <p className="section-subtitle">
          Три прості кроки для отримання крафтового обладнання
        </p>
        <div className="features-grid">
          <div
            className="card feature-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/constructor")}
          >
            <div className="feature-icon">
              <FileUp size={28} />
            </div>
            <h3>Завантажте креслення</h3>
            <p>
              Завантажте креслення з AutoCAD, SolidWorks, Компас-3D або
              скористайтесь нашим онлайн-конструктором
            </p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginTop: 12,
                color: "var(--blue-600)",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Перейти до конструктора <ArrowRight size={14} />
            </span>
          </div>

          <div
            className="card feature-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/tenders/create")}
          >
            <div className="feature-icon">
              <Gavel size={28} />
            </div>
            <h3>Оголосіть тендер</h3>
            <p>
              Виконавці змагаються за ваше замовлення. Обирайте найкращу
              пропозицію за ціною та якістю
            </p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginTop: 12,
                color: "var(--blue-600)",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Створити тендер <ArrowRight size={14} />
            </span>
          </div>

          <div
            className="card feature-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/how-it-works")}
          >
            <div className="feature-icon">
              <Shield size={28} />
            </div>
            <h3>Отримайте результат</h3>
            <p>
              Безпечна угода з гарантією якості. Рейтинг виконавців допоможе
              зробити правильний вибір
            </p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginTop: 12,
                color: "var(--blue-600)",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Детальніше <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────── */}
      {cats.length > 0 && (
        <section className="section" style={{ background: "var(--white)" }}>
          <h2 className="section-title">Категорії обладнання</h2>
          <p className="section-subtitle">
            Знайдіть виконавця для будь-якого типу обладнання
          </p>
          <div className="categories-grid">
            {cats.map((c) => (
              <div
                key={c.id}
                className="card category-card"
                onClick={() => navigate(`/tenders?category_id=${c.id}`)}
              >
                {c.image_url ? (
                  <div className="category-image">
                    <img src={c.image_url} alt={c.name} />
                  </div>
                ) : (
                  <div className="category-icon">{c.icon}</div>
                )}
                <div className="category-body">
                  <h4>{c.name}</h4>
                  <p>{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Recent tenders ───────────────────── */}
      {recent.length > 0 && (
        <section className="section">
          <h2 className="section-title">Останні тендери</h2>
          <p className="section-subtitle">
            Нові замовлення чекають на виконавців
          </p>
          <div className="tenders-grid">
            {recent.map((t) => (
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
                  <div className="tender-footer">
                    <span className="tender-budget">
                      {t.budget_min && t.budget_max
                        ? `${t.budget_min.toLocaleString()} – ${t.budget_max.toLocaleString()} ${t.currency}`
                        : "Договірна"}
                    </span>
                    <span className="bids-count">
                      {t.bids_count}{" "}
                      {t.bids_count === 1 ? "ставка" : "ставок"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link to="/tenders" className="btn btn-secondary">
              Усі тендери <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* ── For manufacturers ────────────────── */}
      <section className="section" style={{ background: "var(--white)" }}>
        <h2 className="section-title">Для виконавців</h2>
        <p className="section-subtitle">
          Розмістіть портфоліо та отримуйте замовлення
        </p>
        <div className="features-grid">
          <div
            className="card feature-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/portfolio")}
          >
            <div className="feature-icon">
              <BriefcaseBusiness size={28} />
            </div>
            <h3>Покажіть свої роботи</h3>
            <p>
              Створіть портфоліо з фото та описом ваших виробів. Клієнти
              оберуть вас за вашими роботами
            </p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginTop: 12,
                color: "var(--blue-600)",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Переглянути портфоліо <ArrowRight size={14} />
            </span>
          </div>

          <div
            className="card feature-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/tenders")}
          >
            <div className="feature-icon">
              <Gavel size={28} />
            </div>
            <h3>Конкурентні торги</h3>
            <p>
              Пропонуйте свою ціну на тендерах. Найкраща пропозиція отримає
              замовлення
            </p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginTop: 12,
                color: "var(--blue-600)",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Знайти тендери <ArrowRight size={14} />
            </span>
          </div>

          <div
            className="card feature-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            <div className="feature-icon">
              <Globe size={28} />
            </div>
            <h3>Міжнародний ринок</h3>
            <p>
              Платформа відкрита для виконавців з усього світу. Розширюйте
              географію замовлень
            </p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginTop: 12,
                color: "var(--blue-600)",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Зареєструватись <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
