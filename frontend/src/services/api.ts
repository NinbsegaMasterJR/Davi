import axios from "axios";
import API_BASE_URL from "../config";

const apiBaseUrl = import.meta.env.DEV ? "/api" : `${API_BASE_URL}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
});

export interface Versiculo {
  referencia: string;
  texto: string;
  versao?: string;
}

export interface SermonOutlineResponse {
  sucesso: boolean;
  esboço: string;
}

export interface VersesSuggestion {
  sucesso: boolean;
  tema: string;
  versiculos: Versiculo[];
}

export interface PassageExplanation {
  sucesso: boolean;
  explicacao: string;
}

export interface TheologicalAnalysis {
  sucesso: boolean;
  analise: string;
}

export interface TheologicalAnalysisRequest {
  tema: string;
  passagem?: string;
  profundidade?: "basico" | "medio" | "avancado";
}

export interface SermonScheduleResponse {
  sucesso: boolean;
  cronograma: string;
}

// Sermon endpoints
export const sermonAPI = {
  generateOutline: (tema: string, estilo?: string, duracao?: number) =>
    api.post<SermonOutlineResponse>("/sermons/outline", {
      tema,
      estilo,
      duracao,
    }),

  analyzeTheologically: ({
    tema,
    passagem,
    profundidade,
  }: TheologicalAnalysisRequest) =>
    api.post<TheologicalAnalysis>("/analysis/theological", {
      tema,
      passagem,
      profundidade,
    }),

  explainPassage: (referencia: string) =>
    api.post<PassageExplanation>("/sermons/explain", { referencia }),

  createSchedule: (
    mes: number,
    ano: number,
    temas: string[],
    estilo?: string,
  ) =>
    api.post<SermonScheduleResponse>("/sermons/schedule", {
      mes,
      ano,
      temas,
      estilo,
    }),
};

// Verses endpoints
export const versesAPI = {
  suggest: (tema: string, limite?: number) =>
    api.get<VersesSuggestion>("/verses/suggest", { params: { tema, limite } }),

  getVerse: (referencia: string) => api.get(`/verses/${referencia}`),
};

// Concordance endpoints
export interface ConcordanceResponse {
  sucesso: boolean;
  palavra: string;
  total: number;
  resultados: Versiculo[];
}

export const concordanceAPI = {
  search: (palavra: string, limite?: number) =>
    api.get<ConcordanceResponse>("/concordance/search", {
      params: { palavra, limite },
    }),
};

// Analysis endpoints
export const analysisAPI = {
  theological: (
    tema: string,
    profundidade?: "basico" | "medio" | "avancado",
    passagem?: string,
  ) =>
    api.post<TheologicalAnalysis>("/analysis/theological", {
      tema,
      profundidade,
      passagem,
    }),
};

export default api;
