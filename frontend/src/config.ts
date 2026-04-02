const envApiUrl = import.meta.env.VITE_API_URL?.trim() || "";

const API_BASE_URL = envApiUrl || (import.meta.env.DEV ? "http://localhost:3001" : "");

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
