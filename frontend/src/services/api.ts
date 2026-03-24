import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
});

export interface SermonOutlineResponse {
  sucesso: boolean;
  esboço: string;
}

export interface VersesSuggestion {
  sucesso: boolean;
  tema: string;
  versiculos: Array<{
    referencia: string;
    texto: string;
    versao?: string;
  }>;
}

export interface PassageExplanation {
  sucesso: boolean;
  explicacao: string;
}

export interface TheologicalAnalysis {
  sucesso: boolean;
  analise: string;
}

// Sermon endpoints
export const sermonAPI = {
  generateOutline: (tema: string, estilo?: string, duracao?: number) =>
    api.post<SermonOutlineResponse>("/sermons/outline", {
      tema,
      estilo,
      duracao,
    }),

  analyzeTheologically: (tema: string, passagem?: string) =>
    api.post<TheologicalAnalysis>("/sermons/analysis", { tema, passagem }),

  explainPassage: (referencia: string) =>
    api.post<PassageExplanation>("/sermons/explain", { referencia }),

  createSchedule: (
    mes: number,
    ano: number,
    temas: string[],
    estilo?: string,
  ) => api.post("/sermons/schedule", { mes, ano, temas, estilo }),
};

// Verses endpoints
export const versesAPI = {
  suggest: (tema: string, limite?: number) =>
    api.get<VersesSuggestion>("/verses/suggest", { params: { tema, limite } }),

  getVerse: (referencia: string) => api.get(`/verses/${referencia}`),
};

// Concordance endpoints
export const concordanceAPI = {
  search: (palavra: string, limite?: number) =>
    api.get("/concordance/search", { params: { palavra, limite } }),
};

// Analysis endpoints
export const analysisAPI = {
  theological: (tema: string, profundidade?: "basico" | "medio" | "avancado") =>
    api.post("/analysis/theological", { tema, profundidade }),
};

export default api;
