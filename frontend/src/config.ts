// API Configuration for different environments

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "production"
    ? "https://pregador-ia-backend.onrender.com" // Backend em produção
    : "http://localhost:3001"); // Backend em desenvolvimento

export const API_ENDPOINTS = {
  SERMONS: {
    OUTLINE: `${API_BASE_URL}/api/sermons/outline`,
    ANALYSIS: `${API_BASE_URL}/api/sermons/analysis`,
    EXPLAIN: `${API_BASE_URL}/api/sermons/explain`,
  },
  VERSES: {
    SUGGEST: `${API_BASE_URL}/api/verses/suggest`,
  },
  CONCORDANCE: {
    SEARCH: `${API_BASE_URL}/api/concordance/search`,
  },
  ANALYSIS: {
    THEOLOGICAL: `${API_BASE_URL}/api/analysis/theological`,
  },
  HEALTH: `${API_BASE_URL}/health`,
};

export default API_BASE_URL;
