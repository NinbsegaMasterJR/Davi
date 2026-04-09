import type { SavedDocument, SavedDraft } from "../types/library";
import type { WorkspaceSnapshot } from "../types/workspace";

export const LAST_TAB_STORAGE_KEY = "scriptura-last-tab-v1";
export const LEGACY_LAST_TAB_STORAGE_KEY = "pregador-ia-last-tab-v1";
export const WORKSPACE_SESSION_STORAGE_KEY = "scriptura-cloud-session-v1";
export const LEGACY_WORKSPACE_SESSION_STORAGE_KEY =
  "pregador-ia-cloud-session-v1";

export function readStorageItem(
  primaryKey: string,
  legacyKey?: string,
): string | null {
  const primaryValue = window.localStorage.getItem(primaryKey);

  if (primaryValue) {
    return primaryValue;
  }

  if (!legacyKey) {
    return null;
  }

  const legacyValue = window.localStorage.getItem(legacyKey);

  if (!legacyValue) {
    return null;
  }

  window.localStorage.setItem(primaryKey, legacyValue);
  window.localStorage.removeItem(legacyKey);
  return legacyValue;
}

function parseTimestamp(value: string | undefined): number {
  if (!value) {
    return 0;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function mergeDocuments(
  current: SavedDocument,
  next: SavedDocument,
): SavedDocument {
  return {
    ...current,
    ...next,
    favorite: current.favorite || next.favorite,
    createdAt:
      parseTimestamp(current.createdAt) >= parseTimestamp(next.createdAt)
        ? current.createdAt
        : next.createdAt,
  };
}

function mergeLibrary(
  localLibrary: SavedDocument[],
  remoteLibrary: SavedDocument[],
): SavedDocument[] {
  const documents = new Map<string, SavedDocument>();

  [...localLibrary, ...remoteLibrary].forEach((document) => {
    const existing = documents.get(document.id);
    documents.set(
      document.id,
      existing ? mergeDocuments(existing, document) : document,
    );
  });

  return Array.from(documents.values())
    .sort(
      (left, right) =>
        parseTimestamp(right.createdAt) - parseTimestamp(left.createdAt),
    )
    .slice(0, 40);
}

function mergeDrafts(
  localDrafts: SavedDraft[],
  remoteDrafts: SavedDraft[],
): SavedDraft[] {
  const drafts = new Map<string, SavedDraft>();

  [...localDrafts, ...remoteDrafts].forEach((draft) => {
    const existing = drafts.get(draft.toolId);

    if (
      !existing ||
      parseTimestamp(draft.updatedAt) >= parseTimestamp(existing.updatedAt)
    ) {
      drafts.set(draft.toolId, draft);
    }
  });

  return Array.from(drafts.values())
    .sort(
      (left, right) =>
        parseTimestamp(right.updatedAt) - parseTimestamp(left.updatedAt),
    )
    .slice(0, 12);
}

export function createWorkspaceSnapshot({
  library,
  drafts,
  onboardingDismissed,
  lastTab,
}: Omit<WorkspaceSnapshot, "syncedAt">): WorkspaceSnapshot {
  return {
    library,
    drafts,
    onboardingDismissed,
    lastTab,
    syncedAt: new Date().toISOString(),
  };
}

export function mergeWorkspaceSnapshots(
  localSnapshot: WorkspaceSnapshot,
  remoteSnapshot: WorkspaceSnapshot,
): WorkspaceSnapshot {
  const localSync = parseTimestamp(localSnapshot.syncedAt);
  const remoteSync = parseTimestamp(remoteSnapshot.syncedAt);

  return {
    library: mergeLibrary(localSnapshot.library, remoteSnapshot.library),
    drafts: mergeDrafts(localSnapshot.drafts, remoteSnapshot.drafts),
    onboardingDismissed:
      localSnapshot.onboardingDismissed || remoteSnapshot.onboardingDismissed,
    lastTab:
      localSync >= remoteSync
        ? localSnapshot.lastTab || remoteSnapshot.lastTab
        : remoteSnapshot.lastTab || localSnapshot.lastTab,
    syncedAt: new Date().toISOString(),
  };
}

export function parseWorkspaceSnapshot(
  content: string,
): WorkspaceSnapshot | null {
  try {
    const parsed = JSON.parse(content) as WorkspaceSnapshot;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      library: Array.isArray(parsed.library) ? parsed.library : [],
      drafts: Array.isArray(parsed.drafts) ? parsed.drafts : [],
      onboardingDismissed: Boolean(parsed.onboardingDismissed),
      lastTab: typeof parsed.lastTab === "string" ? parsed.lastTab : undefined,
      syncedAt:
        typeof parsed.syncedAt === "string"
          ? parsed.syncedAt
          : new Date().toISOString(),
    };
  } catch (error) {
    void error;
    return null;
  }
}
