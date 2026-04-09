import axios from "axios";
import API_BASE_URL from "../config";
import type { WorkspaceSession, WorkspaceSnapshot } from "../types/workspace";

const normalizedApiBaseUrl = API_BASE_URL.replace(/\/$/, "");
const apiBaseUrl = import.meta.env.DEV
  ? "/api"
  : normalizedApiBaseUrl.endsWith("/api")
    ? normalizedApiBaseUrl
    : `${normalizedApiBaseUrl}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
});

export interface Versiculo {
  referencia: string;
  texto: string;
  versao?: string;
}

export type BibleVersion = "ARA" | "ARC" | "ARCF" | "KING_JAMES";

export const BIBLE_VERSION_OPTIONS: Array<{
  value: BibleVersion;
  label: string;
}> = [
  { value: "ARA", label: "ARA" },
  { value: "ARC", label: "ARC" },
  { value: "ARCF", label: "ARCF" },
  { value: "KING_JAMES", label: "King James" },
];

export interface SermonOutlineResponse {
  sucesso: boolean;
  esboco: string;
}

export interface SermonOutlineOptions {
  exegese?: boolean;
  ilustracao?: boolean;
  aplicacaoPratica?: boolean;
}

export interface PastoralLetterResponse {
  sucesso: boolean;
  carta: string;
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
  versaoBiblica?: BibleVersion;
}

export interface SermonScheduleResponse {
  sucesso: boolean;
  cronograma: string;
}

export const sermonAPI = {
  generateOutline: (
    tema: string,
    estilo?: string,
    duracao?: number,
    versaoBiblica?: BibleVersion,
    secoesOpcionais?: SermonOutlineOptions,
  ) =>
    api.post<SermonOutlineResponse>("/sermons/outline", {
      tema,
      estilo,
      duracao,
      versaoBiblica,
      secoesOpcionais,
    }),

  analyzeTheologically: ({
    tema,
    passagem,
    profundidade,
    versaoBiblica,
  }: TheologicalAnalysisRequest) =>
    api.post<TheologicalAnalysis>("/analysis/theological", {
      tema,
      passagem,
      profundidade,
      versaoBiblica,
    }),

  explainPassage: (referencia: string, versaoBiblica?: BibleVersion) =>
    api.post<PassageExplanation>("/sermons/explain", {
      referencia,
      versaoBiblica,
    }),

  createSchedule: (
    mes: number,
    ano: number,
    temas: string[],
    estilo?: string,
    versaoBiblica?: BibleVersion,
  ) =>
    api.post<SermonScheduleResponse>("/sermons/schedule", {
      mes,
      ano,
      temas,
      estilo,
      versaoBiblica,
    }),

  createPastoralLetter: (
    tema: string,
    objetivo: string,
    publicoAlvo: string,
    tom: string,
    versaoBiblica?: BibleVersion,
  ) =>
    api.post<PastoralLetterResponse>("/sermons/pastoral-letter", {
      tema,
      objetivo,
      publicoAlvo,
      tom,
      versaoBiblica,
    }),
};

export const versesAPI = {
  suggest: (tema: string, limite?: number, versaoBiblica?: BibleVersion) =>
    api.get<VersesSuggestion>("/verses/suggest", {
      params: { tema, limite, versaoBiblica },
    }),

  getVerse: (referencia: string, versaoBiblica?: BibleVersion) =>
    api.get(`/verses/${referencia}`, { params: { versaoBiblica } }),
};

export interface ConcordanceResponse {
  sucesso: boolean;
  palavra: string;
  total: number;
  resultados: Versiculo[];
}

export interface WorkspaceStatusResponse {
  sucesso: boolean;
  configured: boolean;
}

export interface WorkspaceSessionResponse {
  sucesso: boolean;
  session: WorkspaceSession;
}

export interface WorkspaceSnapshotResponse {
  sucesso: boolean;
  snapshot: WorkspaceSnapshot;
}

export const concordanceAPI = {
  search: (
    palavra: string,
    limite?: number,
    versaoBiblica?: BibleVersion,
  ) =>
    api.get<ConcordanceResponse>("/concordance/search", {
      params: { palavra, limite, versaoBiblica },
    }),
};

export const analysisAPI = {
  theological: (
    tema: string,
    profundidade?: "basico" | "medio" | "avancado",
    passagem?: string,
    versaoBiblica?: BibleVersion,
  ) =>
    api.post<TheologicalAnalysis>("/analysis/theological", {
      tema,
      profundidade,
      passagem,
      versaoBiblica,
  }),
};

export const workspaceSyncAPI = {
  getStatus: () => api.get<WorkspaceStatusResponse>("/workspace/status"),

  register: (displayName: string, passphrase: string) =>
    api.post<WorkspaceSessionResponse>("/workspace/register", {
      displayName,
      passphrase,
    }),

  login: (workspaceId: string, passphrase: string) =>
    api.post<WorkspaceSessionResponse>("/workspace/login", {
      workspaceId,
      passphrase,
    }),

  getSession: (token: string) =>
    api.get<WorkspaceSessionResponse>("/workspace/session", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getSnapshot: (token: string) =>
    api.get<WorkspaceSnapshotResponse>("/workspace/snapshot", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  saveSnapshot: (token: string, snapshot: WorkspaceSnapshot) =>
    api.put<WorkspaceSnapshotResponse>("/workspace/snapshot", snapshot, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default api;
