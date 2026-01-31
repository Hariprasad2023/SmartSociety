// src/api/api.js
const BASE_URL = import.meta?.env?.VITE_API_URL || "http://localhost:5000";

export const apiRequest = async (url, method = "GET", body) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Try to parse JSON, else keep raw text
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      data?.raw ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
};
