import React, { useEffect, useState, ReactNode } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { SavedDocument, SaveDocumentInput } from "../types/library";

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
}

const STORAGE_KEY = "pregador-ia-library-v1";
const MAX_LIBRARY_ITEMS = 30;

function loadInitialLibrary(): SavedDocument[] {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored) as SavedDocument[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    void error;
    return [];
  }
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

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }, [library]);

  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

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
      }}
    >
      {children}
      <ToastContainer position="bottom-right" newestOnTop />
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
