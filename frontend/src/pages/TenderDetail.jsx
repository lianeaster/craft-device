import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Clock, User as UserIcon, Gavel, Check } from "lucide-react";
import { tenders as tendersApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function TenderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tender, setTender] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidForm, setBidForm] = useState({
    amount: "",
    message: "",
    estimated_days: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    tendersApi.get(id).then(setTender).catch(() => {});
    tendersApi.getBids(id).then(setBids).catch(() => {});
  }, [id]);

  const submitBid = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const bid = await tendersApi.placeBid(id, {
        amount: parseFloat(bidForm.amount),
        message: bidForm.message || null,
        estimated_days: bidForm.estimated_days
          ? parseInt(bidForm.estimated_days)
          : null,
      });
      setBids([...bids, bid].sort((a, b) => a.amount - b.amount));
      setBidForm({ amount: "", message: "", estimated_days: "" });
      setSuccess("Ставку подано!");
      setTender({ ...tender, bids_count: tender.bids_count + 1 });
    } catch (err) {
      setError(err.message);
    }
  };

  const acceptBid = async (bidId) => {
    try {
      await tendersApi.acceptBid(id, bidId);
      tendersApi.get(id).then(setTender);
      tendersApi.getBids(id).then(setBids);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!tender) return <div className="section container">Завантаження...</div>;

  const isOwner = user && user.id === tender.owner_id;
  const canBid =
    user &&
    user.id !== tender.owner_id &&
    tender.status === "active" &&
    !bids.find((b) => b.bidder_id === user.id);

  return (
    <div className="detail-page">
      {tender.image_url && (
        <div
          style={{
            width: "100%",
            height: 300,
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <img
            src={tender.image_url}
            alt={tender.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}
      <div className="detail-header">
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <span className={`badge badge-${tender.status}`}>
            {tender.status === "active"
              ? "Активний"
              : tender.status === "in_progress"
              ? "В роботі"
              : tender.status === "completed"
              ? "Завершено"
              : tender.status}
          </span>
          {tender.category_name && (
            <span className="tag">{tender.category_name}</span>
          )}
        </div>
        <h1>{tender.title}</h1>
      </div>

      <div className="detail-grid">
        <div>
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 12 }}>Опис</h3>
            <p
              style={{
                whiteSpace: "pre-wrap",
                color: "var(--slate-600)",
                lineHeight: 1.8,
              }}
            >
              {tender.description}
            </p>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16 }}>
              Ставки ({bids.length})
            </h3>
            {bids.length === 0 ? (
              <p style={{ color: "var(--slate-400)" }}>
                Ще немає ставок. Будьте першим!
              </p>
            ) : (
              <div className="bids-list">
                {bids.map((b) => (
                  <div key={b.id} className="card bid-card">
                    <div className="bid-info">
                      <h4>
                        {b.bidder_name}
                        {b.bidder_company && (
                          <span
                            style={{
                              color: "var(--slate-400)",
                              fontWeight: 400,
                            }}
                          >
                            {" "}
                            · {b.bidder_company}
                          </span>
                        )}
                      </h4>
                      {b.message && <p>{b.message}</p>}
                      {b.estimated_days && (
                        <p className="bid-days">
                          Термін: ~{b.estimated_days} днів
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="bid-amount">
                        {b.amount.toLocaleString()} {b.currency}
                      </div>
                      {b.status === "accepted" && (
                        <span className="badge badge-active">Прийнято</span>
                      )}
                      {b.status === "rejected" && (
                        <span className="badge badge-draft">Відхилено</span>
                      )}
                      {isOwner &&
                        b.status === "pending" &&
                        tender.status === "active" && (
                          <button
                            className="btn btn-success"
                            style={{
                              marginTop: 8,
                              padding: "6px 14px",
                              fontSize: "0.8rem",
                            }}
                            onClick={() => acceptBid(b.id)}
                          >
                            <Check size={14} /> Прийняти
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="card">
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--slate-500)",
                  marginBottom: 4,
                }}
              >
                Бюджет
              </div>
              <div
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "var(--blue-700)",
                }}
              >
                {tender.budget_min && tender.budget_max
                  ? `${tender.budget_min.toLocaleString()} – ${tender.budget_max.toLocaleString()} ${tender.currency}`
                  : "Договірна"}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontSize: "0.9rem",
                color: "var(--slate-600)",
                marginBottom: 20,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <UserIcon size={16} /> {tender.owner_name}
              </span>
              {tender.location && (
                <span
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <MapPin size={16} /> {tender.location}
                </span>
              )}
              {tender.deadline && (
                <span
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <Clock size={16} /> до{" "}
                  {new Date(tender.deadline).toLocaleDateString("uk-UA")}
                </span>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Gavel size={16} /> {tender.bids_count} ставок
              </span>
            </div>

            {canBid && (
              <form onSubmit={submitBid}>
                <h4 style={{ marginBottom: 12 }}>Зробити ставку</h4>
                {error && <div className="alert alert-error">{error}</div>}
                {success && (
                  <div className="alert alert-success">{success}</div>
                )}
                <div className="form-group">
                  <label>Сума ({tender.currency})</label>
                  <input
                    className="form-input"
                    type="number"
                    value={bidForm.amount}
                    onChange={(e) =>
                      setBidForm({ ...bidForm, amount: e.target.value })
                    }
                    placeholder="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Термін (днів)</label>
                  <input
                    className="form-input"
                    type="number"
                    value={bidForm.estimated_days}
                    onChange={(e) =>
                      setBidForm({
                        ...bidForm,
                        estimated_days: e.target.value,
                      })
                    }
                    placeholder="14"
                  />
                </div>
                <div className="form-group">
                  <label>Повідомлення</label>
                  <textarea
                    className="form-input"
                    value={bidForm.message}
                    onChange={(e) =>
                      setBidForm({ ...bidForm, message: e.target.value })
                    }
                    placeholder="Опишіть вашу пропозицію..."
                    rows={3}
                  />
                </div>
                <button className="btn btn-primary" style={{ width: "100%" }}>
                  Подати ставку
                </button>
              </form>
            )}

            {!user && tender.status === "active" && (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--slate-500)",
                  fontSize: "0.9rem",
                }}
              >
                <a href="/login">Увійдіть</a>, щоб зробити ставку
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
