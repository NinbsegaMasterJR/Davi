const envApiUrl = (import.meta.env.VITE_API_URL?.trim() || "").replace(/\/$/, "");

function resolveApiBaseUrl(): string {
  if (import.meta.env.DEV) {
    return "";
  }

  if (typeof window !== "undefined") {
    const isLocalHost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (isLocalHost) {
      return "http://localhost:3001";
    }
  }

  return envApiUrl;
}

function buildEndpoint(path: string): string {
  const apiBaseUrl = resolveApiBaseUrl();
  return apiBaseUrl ?`${apiBaseUrl}${path}` : path;
}

const API_BASE_URL = resolveApiBaseUrl();

export const API_ENDPOINTS = {
  SERMONS: {
    OUTLINE: buildEndpoint("/api/sermons/outline"),
    ANALYSIS: buildEndpoint("/api/sermons/analysis"),
    EXPLAIN: buildEndpoint("/api/sermons/explain"),
  },
  VERSES: {
    SUGGEST: buildEndpoint("/api/verses/suggest"),
  },
  CONCORDANCE: {
    SEARCH: buildEndpoint("/api/concordance/search"),
  },
  ANALYSIS: {
    THEOLOGICAL: buildEndpoint("/api/analysis/theological"),
  },
  HEALTH: buildEndpoint("/health"),
};

export default API_BASE_URL;
