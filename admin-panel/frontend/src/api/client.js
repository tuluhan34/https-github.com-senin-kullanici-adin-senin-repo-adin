const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function apiRequest(path, { method = "GET", body, csrfToken, signal } = {}) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (csrfToken) {
    headers["x-csrf-token"] = csrfToken;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal
  });

  const payload = await response.json().catch(() => ({ success: false, message: "Invalid server response" }));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}
