import React, { useCallback, useEffect, useState, ReactNode } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type {
  SavedDocument,
  SaveDocumentInput,
  SavedDraft,
  SaveDraftInput,
} from "../types/library";
import type { WorkspaceSnapshot } from "../types/workspace";
import {
  createWorkspaceSnapshot,
  readStorageItem,
} from "../utils/workspaceSnapshot";

interface AppContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  library: SavedDocument[];
  saveDocument: (input: SaveDocumentInput) => SavedDocument;
  toggleFavorite: (id: string) => void;
  removeDocument: (id: string) => void;
  clearLibrary: () => void;
  drafts: SavedDraft[];
  saveDraft: (input: SaveDraftInput) => SavedDraft;
  getDraft: (toolId: string) => SavedDraft | null;
  clearDraft: (toolId: string) => void;
  onboardingDismissed: boolean;
  dismissOnboarding: () => void;
  resetOnboarding: () => void;
  getWorkspaceSnapshot: (lastTab?: string) => WorkspaceSnapshot;
  replaceWorkspaceState: (snapshot: WorkspaceSnapshot) => void;
}

const STORAGE_KEY = "scriptura-library-v1";
const LEGACY_STORAGE_KEY = "pregador-ia-library-v1";
const DRAFTS_STORAGE_KEY = "scriptura-drafts-v1";
const LEGACY_DRAFTS_STORAGE_KEY = "pregador-ia-drafts-v1";
const ONBOARDING_STORAGE_KEY = "scriptura-onboarding-v1";
const LEGACY_ONBOARDING_STORAGE_KEY = "pregador-ia-onboarding-v1";
const MAX_LIBRARY_ITEMS = 30;

function loadStoredJson<T>(key: string, fallback: T, legacyKey?: string): T {
  const stored = readStorageItem(key, legacyKey);

  if (!stored) {
    return fallback;
  }

  try {
    return JSON.parse(stored) as T;
  } catch (error) {
    void error;
    return fallback;
  }
}

function loadInitialLibrary(): SavedDocument[] {
  const parsed = loadStoredJson<unknown>(STORAGE_KEY, [], LEGACY_STORAGE_KEY);
  return Array.isArray(parsed) ? (parsed as SavedDocument[]) : [];
}

function loadInitialDrafts(): SavedDraft[] {
  const parsed = loadStoredJson<unknown>(
    DRAFTS_STORAGE_KEY,
    [],
    LEGACY_DRAFTS_STORAGE_KEY,
  );
  return Array.isArray(parsed) ? (parsed as SavedDraft[]) : [];
}

function loadInitialOnboardingState(): boolean {
  return loadStoredJson<boolean>(
    ONBOARDING_STORAGE_KEY,
    false,
    LEGACY_ONBOARDING_STORAGE_KEY,
  );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AppContext = React.createContext<
  AppContextType | undefined | null
>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const [library, setLibrary] = useState<SavedDocument[]>(loadInitialLibrary);
  const [drafts, setDrafts] = useState<SavedDraft[]>(loadInitialDrafts);
  const [onboardingDismissed, setOnboardingDismissed] = useState<boolean>(
    loadInitialOnboardingState,
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    window.localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      JSON.stringify(onboardingDismissed),
    );
  }, [onboardingDismissed]);

  const showSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const saveDocument = (input: SaveDocumentInput): SavedDocument => {
    const document: SavedDocument = {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      favorite: false,
    };

    setLibrary((current) => [document, ...current].slice(0, MAX_LIBRARY_ITEMS));
    return document;
  };

  const saveDraft = useCallback((input: SaveDraftInput): SavedDraft => {
    const draft: SavedDraft = {
      ...input,
      updatedAt: new Date().toISOString(),
    };

    setDrafts((current) => {
      const next = current.filter((item) => item.toolId !== input.toolId);
      return [draft, ...next];
    });

    return draft;
  }, []);

  const getDraft = useCallback(
    (toolId: string) => drafts.find((item) => item.toolId === toolId) ?? null,
    [drafts],
  );

  const toggleFavorite = (id: string) => {
    setLibrary((current) =>
      current.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item,
      ),
    );
  };

  const removeDocument = (id: string) => {
    setLibrary((current) => current.filter((item) => item.id !== id));
  };

  const clearLibrary = () => {
    setLibrary([]);
  };

  const clearDraft = useCallback((toolId: string) => {
    setDrafts((current) => current.filter((item) => item.toolId !== toolId));
  }, []);

  const dismissOnboarding = useCallback(() => {
    setOnboardingDismissed(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    setOnboardingDismissed(false);
  }, []);

  const getWorkspaceSnapshot = useCallback(
    (lastTab?: string): WorkspaceSnapshot =>
      createWorkspaceSnapshot({
        library,
        drafts,
        onboardingDismissed,
        lastTab,
      }),
    [drafts, library, onboardingDismissed],
  );

  const replaceWorkspaceState = useCallback((snapshot: WorkspaceSnapshot) => {
    setLibrary(snapshot.library);
    setDrafts(snapshot.drafts);
    setOnboardingDismissed(snapshot.onboardingDismissed);
  }, []);

  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        showSuccess,
        showError,
        library,
        saveDocument,
        toggleFavorite,
        removeDocument,
        clearLibrary,
        drafts,
        saveDraft,
        getDraft,
        clearDraft,
        onboardingDismissed,
        dismissOnboarding,
        resetOnboarding,
        getWorkspaceSnapshot,
        replaceWorkspaceState,
      }}
    >
      {children}
      <ToastContainer
        position="bottom-right"
        newestOnTop
        autoClose={2800}
        hideProgressBar
        closeButton={false}
        toastClassName="app-toast"
        bodyClassName="app-toast-body"
      />
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useApp deve ser usado dentro de AppProvider");
  }
  return context;
};
