import React, { useState, ReactNode } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AppContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
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

  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  return (
    <AppContext.Provider
      value={{ loading, setLoading, showSuccess, showError }}
    >
      {children}
      <ToastContainer position="bottom-right" />
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
