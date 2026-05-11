import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contacts() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

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
          Контакти
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "var(--slate-500)",
            marginBottom: 48,
            maxWidth: 500,
            margin: "0 auto 48px",
          }}
        >
          Маєте питання або пропозиції? Зв'яжіться з нами
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 32,
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                marginBottom: 32,
              }}
            >
              <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--radius-md)",
                    background: "var(--blue-100)",
                    color: "var(--blue-600)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Mail size={22} />
                </div>
                <div>
                  <h4 style={{ marginBottom: 2 }}>Email</h4>
                  <a href="mailto:info@craft-device.ua" style={{ fontSize: "0.9rem" }}>
                    info@craft-device.ua
                  </a>
                </div>
              </div>

              <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--radius-md)",
                    background: "var(--blue-100)",
                    color: "var(--blue-600)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Phone size={22} />
                </div>
                <div>
                  <h4 style={{ marginBottom: 2 }}>Телефон</h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--slate-600)" }}>
                    +380 (44) 123-45-67
                  </p>
                </div>
              </div>

              <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--radius-md)",
                    background: "var(--blue-100)",
                    color: "var(--blue-600)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ marginBottom: 2 }}>Адреса</h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--slate-600)" }}>
                    м. Київ, вул. Хрещатик, 1
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form className="card" style={{ padding: 32 }} onSubmit={submit}>
            <h3 style={{ marginBottom: 20 }}>Напишіть нам</h3>

            {sent && (
              <div className="alert alert-success">
                Дякуємо! Ваше повідомлення надіслано.
              </div>
            )}

            <div className="form-group">
              <label>Ім'я</label>
              <input
                className="form-input"
                name="name"
                value={form.name}
                onChange={handle}
                placeholder="Ваше ім'я"
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
              <label>Повідомлення</label>
              <textarea
                className="form-input"
                name="message"
                value={form.message}
                onChange={handle}
                placeholder="Ваше питання або пропозиція..."
                rows={5}
                required
              />
            </div>

            <button className="btn btn-primary" style={{ width: "100%" }}>
              <Send size={16} /> Надіслати
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
