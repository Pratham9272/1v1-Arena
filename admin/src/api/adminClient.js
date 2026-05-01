const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const ADMIN_ACCESS_KEY = import.meta.env.VITE_ADMIN_ACCESS_KEY || "admin123";

export const getDashboard = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    headers: {
      "x-admin-key": ADMIN_ACCESS_KEY
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Failed to load admin dashboard");
  }

  return data;
};
