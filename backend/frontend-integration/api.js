const API_BASE_URL = "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

// Examples:
// const menu = await apiRequest("/menu");
// const categories = await apiRequest("/menu/categories");
// await apiRequest("/orders", {
//   method: "POST",
//   body: JSON.stringify({
//     customerName: "Yuragi",
//     customerPhone: "9999999999",
//     items: [{ menuItem: "MENU_ITEM_ID", quantity: 2 }]
//   })
// });
//
// Login:
// const result = await apiRequest("/auth/login", {
//   method: "POST",
//   body: JSON.stringify({ email, password })
// });
// localStorage.setItem("token", result.data.token);
