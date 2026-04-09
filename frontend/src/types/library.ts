export type SavedContentType = "markdown" | "text";

export interface SavedDocument {
  id: string;
  toolId: string;
  toolLabel: string;
  title: string;
  query: string;
  summary?: string;
  content: string;
  contentType: SavedContentType;
  createdAt: string;
  favorite: boolean;
}

export interface SavedDraft {
  toolId: string;
  toolLabel: string;
  title: string;
  summary?: string;
  values: Record<string, unknown>;
  updatedAt: string;
}

export interface SaveDocumentInput {
  toolId: string;
  toolLabel: string;
  title: string;
  query: string;
  summary?: string;
  content: string;
  contentType: SavedContentType;
}

export interface SaveDraftInput {
  toolId: string;
  toolLabel: string;
  title: string;
  summary?: string;
  values: Record<string, unknown>;
}
