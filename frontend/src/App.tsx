import { useCallback, useEffect, useState } from "react";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { AppProvider } from "./context/AppContext";
import { API_ENDPOINTS } from "./config";
import { BrandLogo } from "./components/BrandLogo";
import "./App.css";

type PageType = "home" | "about";

type ApiStatus = "checking" | "online" | "offline";

interface HealthResponse {
  status: string;
  message: string;
  groqConfigured?: boolean;
}

const GITHUB_REPO_URL = "https://github.com/NinsegaMasterJr/Gerador.P-Web";

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const [groqConfigured, setGroqConfigured] = useState(true);
  const [lastCheckedAt, setLastCheckedAt] = useState<string>("");

  const checkHealth = useCallback(async () => {
    setApiStatus((currentStatus) =>
      currentStatus === "online" ? currentStatus : "checking",
    );

    try {
      const response = await fetch(API_ENDPOINTS.HEALTH, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Health check falhou");
      }

      const data = (await response.json()) as HealthResponse;
      setApiStatus(data.status === "OK" ? "online" : "offline");
      setGroqConfigured(data.groqConfigured !== false);
      setLastCheckedAt(new Date().toLocaleTimeString("pt-BR"));
    } catch (error) {
      void error;
      setApiStatus("offline");
      setGroqConfigured(false);
      setLastCheckedAt(new Date().toLocaleTimeString("pt-BR"));
    }
  }, []);

  useEffect(() => {
    void checkHealth();

    const intervalId = window.setInterval(() => {
      void checkHealth();
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [checkHealth]);

  const statusMessage =
    apiStatus === "checking"
      ? "Verificando conexao com a API..."
      : apiStatus === "offline"
        ? "API offline. Inicie o backend para gerar conteudo."
        : groqConfigured
          ? "API online e pronta para gerar conteudo."
          : "API online, mas a GROQ_API_KEY nao esta configurada no backend.";

  const statusClass =
    apiStatus === "online" && groqConfigured
      ? "status-ok"
      : apiStatus === "checking"
        ? "status-warn"
        : "status-error";

  return (
    <AppProvider>
      <div className="app">
        <nav className="app-navbar">
          <div className="navbar-content">
            <button className="logo" onClick={() => setCurrentPage("home")}>
              <span className="logo-mark">
                <BrandLogo className="brand-logo" />
              </span>
              <span className="logo-copy">
                <strong>Pregador IA</strong>
                <small>Esbocos, analise e estudo biblico com identidade propria</small>
              </span>
            </button>
            <div className="nav-links">
              <button
                className={`nav-link ${currentPage === "home" ? "active" : ""}`}
                onClick={() => setCurrentPage("home")}
              >
                Inicio
              </button>
              <button
                className={`nav-link ${currentPage === "about" ? "active" : ""}`}
                onClick={() => setCurrentPage("about")}
              >
                Sobre
              </button>
              <a
                href={GITHUB_REPO_URL}
                className="nav-link"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
          <div className={`api-status ${statusClass}`}>
            <span>{statusMessage}</span>
            <div className="api-status-actions">
              {lastCheckedAt && (
                <span className="api-status-meta">
                  Ultima verificacao: {lastCheckedAt}
                </span>
              )}
              <button
                type="button"
                className="api-status-button"
                onClick={() => void checkHealth()}
              >
                Atualizar status
              </button>
            </div>
          </div>
        </nav>

        <main className="app-main">
          {currentPage === "home" && <Home />}
          {currentPage === "about" && (
            <About
              onBackHome={() => setCurrentPage("home")}
              githubUrl={GITHUB_REPO_URL}
            />
          )}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
