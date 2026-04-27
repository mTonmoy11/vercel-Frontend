export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE}/api/login`,
  REGISTER: `${API_BASE}/registers`,

  // Reports
  REPORTS: `${API_BASE}/reports`,

  // Dashboard
  DASHBOARD_STATS: `${API_BASE}/api/dashboard/statistics`,

  // Government Spending
  GOVT_SPENDING: `${API_BASE}/api/govt-spending`,
  GOVT_SPENDING_YEARLY: `${API_BASE}/api/govt-spending/yearly`,
  GOVT_SPENDING_STATS: `${API_BASE}/api/govt-spending/stats/overview`,

  // Education
  TRAINERS: `${API_BASE}/trainers`,
  EVENTS: `${API_BASE}/education-events`,

  // Uploads
  UPLOADS: `${API_BASE}/uploads`,
};

export default API_BASE;
