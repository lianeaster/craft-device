import { Link } from "react-router-dom";
import {
  FileUp,
  Gavel,
  Shield,
  UserCheck,
  Search,
  Star,
  ArrowRight,
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <UserCheck size={32} />,
      title: "1. Зареєструйтесь",
      desc: "Створіть акаунт як замовник або виконавець. Заповніть профіль — це підвищить довіру до вас на платформі.",
    },
    {
      icon: <FileUp size={32} />,
      title: "2. Опишіть замовлення",
      desc: "Завантажте креслення з AutoCAD, SolidWorks, Компас-3D або опишіть потрібне обладнання текстом. Вкажіть бюджет і терміни.",
    },
    {
      icon: <Gavel size={32} />,
      title: "3. Отримайте пропозиції",
      desc: "Виконавці переглянуть ваш тендер і запропонують свою ціну. Чим детальніший опис — тим точніші пропозиції.",
    },
    {
      icon: <Search size={32} />,
      title: "4. Порівняйте виконавців",
      desc: "Оцініть портфоліо, рейтинг, відгуки та ціну кожного виконавця. Зверніть увагу на терміни виготовлення.",
    },
    {
      icon: <Shield size={32} />,
      title: "5. Оберіть найкращого",
      desc: "Прийміть ставку, яка найбільше підходить. Домовтесь про деталі безпосередньо з виконавцем.",
    },
    {
      icon: <Star size={32} />,
      title: "6. Оцініть результат",
      desc: "Після отримання обладнання залишіть відгук. Це допоможе іншим замовникам та мотивує виконавців.",
    },
  ];

  return (
    <div className="section">
      <div className="container">
        <h1
          style={{
            fontSize: "2rem",
            textAlign: "center",
            marginBottom: 12,
            color: "var(--slate-900)",
          }}
        >
          Як працює Craft-Device
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "var(--slate-500)",
            marginBottom: 48,
            maxWidth: 600,
            margin: "0 auto 48px",
          }}
        >
          Від ідеї до готового обладнання — шість простих кроків
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            marginBottom: 64,
          }}
        >
          {steps.map((s, i) => (
            <div key={i} className="card" style={{ padding: 32 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "var(--radius-lg)",
                  background: "var(--blue-100)",
                  color: "var(--blue-600)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {s.icon}
              </div>
              <h3 style={{ marginBottom: 8 }}>{s.title}</h3>
              <p style={{ color: "var(--slate-500)", fontSize: "0.9rem" }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, var(--blue-900), var(--blue-700))",
            borderRadius: "var(--radius-xl)",
            padding: "48px 32px",
            textAlign: "center",
            color: "var(--white)",
          }}
        >
          <h2 style={{ marginBottom: 12 }}>Готові почати?</h2>
          <p
            style={{
              color: "var(--blue-200)",
              marginBottom: 24,
              maxWidth: 500,
              margin: "0 auto 24px",
            }}
          >
            Зареєструйтесь безкоштовно та створіть свій перший тендер вже сьогодні
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/register"
              className="btn btn-large"
              style={{ background: "var(--white)", color: "var(--blue-700)" }}
            >
              Реєстрація <ArrowRight size={18} />
            </Link>
            <Link
              to="/tenders"
              className="btn btn-large"
              style={{
                background: "transparent",
                color: "var(--white)",
                border: "1.5px solid rgba(255,255,255,0.4)",
              }}
            >
              Переглянути тендери
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
