const API = "/api";

function getHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function request(url, options = {}) {
  const res = await fetch(API + url, {
    headers: getHeaders(),
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Помилка сервера" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const auth = {
  register: (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  me: () => request("/auth/me"),
};

export const tenders = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/tenders${qs ? "?" + qs : ""}`);
  },
  get: (id) => request(`/tenders/${id}`),
  create: (data) => request("/tenders", { method: "POST", body: JSON.stringify(data) }),
  getBids: (id) => request(`/tenders/${id}/bids`),
  placeBid: (id, data) => request(`/tenders/${id}/bids`, { method: "POST", body: JSON.stringify(data) }),
  acceptBid: (tenderId, bidId) => request(`/tenders/${tenderId}/bids/${bidId}/accept`, { method: "POST" }),
};

export const portfolio = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/portfolio${qs ? "?" + qs : ""}`);
  },
  create: (data) => request("/portfolio", { method: "POST", body: JSON.stringify(data) }),
  uploadImage: async (itemId, file) => {
    const form = new FormData();
    form.append("file", file);
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/portfolio/${itemId}/upload-image`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    return res.json();
  },
};

export const categories = {
  list: () => request("/categories"),
};

export const stats = {
  get: () => request("/stats"),
};

export const upload = {
  file: async (file) => {
    const form = new FormData();
    form.append("file", file);
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    return res.json();
  },
};
