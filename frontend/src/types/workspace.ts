import type { SavedDocument, SavedDraft } from "./library";

export interface WorkspaceSnapshot {
  library: SavedDocument[];
  drafts: SavedDraft[];
  onboardingDismissed: boolean;
  lastTab?: string;
  syncedAt: string;
}

export interface WorkspaceSession {
  token: string;
  workspaceId: string;
  displayName: string;
  syncedAt: string;
}
