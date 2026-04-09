import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import type { ActiveTab } from "./pages/Home";
import { AppProvider } from "./context/AppContext";
import { API_ENDPOINTS } from "./config";
import { BrandLogo } from "./components/BrandLogo";
import "./App.css";

const Landing = lazy(() =>
  import("./pages/Landing").then((module) => ({ default: module.Landing })),
);
const Home = lazy(() =>
  import("./pages/Home").then((module) => ({ default: module.Home })),
);
const About = lazy(() =>
  import("./pages/About").then((module) => ({ default: module.About })),
);
const Resources = lazy(() =>
  import("./pages/Resources").then((module) => ({ default: module.Resources })),
);
const TrustCenter = lazy(() =>
  import("./pages/TrustCenter").then((module) => ({
    default: module.TrustCenter,
  })),
);
const Contact = lazy(() =>
  import("./pages/Contact").then((module) => ({ default: module.Contact })),
);

type PageType = "landing" | "app" | "resources" | "about" | "trust" | "contact";
type ApiStatus = "checking" | "online" | "offline";

interface HealthResponse {
  status: string;
  message: string;
  groqConfigured?: boolean;
}

const GITHUB_REPO_URL = "https://github.com/NinsegaMasterJr/Gerador.P-Web";
const DEFAULT_TAB: ActiveTab = "outline";

const TAB_TITLES: Record<ActiveTab, string> = {
  outline: "Esboco de Pregacao",
  verses: "Versiculos por Tema",
  analysis: "Analise Teologica",
  explain: "Explicar Passagem",
  concordance: "Concordancia Biblica",
  schedule: "Cronograma de Pregacoes",
  "pastoral-letter": "Carta Pastoral",
};

function isActiveTab(value: string): value is ActiveTab {
  return value in TAB_TITLES;
}

function parseHash(hash: string): { page: PageType; tab: ActiveTab } {
  const cleanedHash = hash.replace(/^#/, "").replace(/^\/?/, "");

  if (!cleanedHash || cleanedHash === "inicio" || cleanedHash === "landing") {
    return { page: "landing", tab: DEFAULT_TAB };
  }

  if (cleanedHash === "recursos") {
    return { page: "resources", tab: DEFAULT_TAB };
  }

  if (cleanedHash === "sobre" || cleanedHash === "about") {
    return { page: "about", tab: DEFAULT_TAB };
  }

  if (cleanedHash === "confianca") {
    return { page: "trust", tab: DEFAULT_TAB };
  }

  if (cleanedHash === "contato") {
    return { page: "contact", tab: DEFAULT_TAB };
  }

  if (cleanedHash.startsWith("app/") || cleanedHash.startsWith("ferramenta/")) {
    const tab = cleanedHash.split("/")[1];
    return {
      page: "app",
      tab: tab && isActiveTab(tab) ? tab : DEFAULT_TAB,
    };
  }

  return { page: "landing", tab: DEFAULT_TAB };
}

function buildHash(page: PageType, tab: ActiveTab): string {
  switch (page) {
    case "about":
      return "#/sobre";
    case "resources":
      return "#/recursos";
    case "trust":
      return "#/confianca";
    case "contact":
      return "#/contato";
    case "app":
      return `#/app/${tab}`;
    case "landing":
    default:
      return "#/inicio";
  }
}

function App() {
  const initialRoute = parseHash(window.location.hash);
  const [currentPage, setCurrentPage] = useState<PageType>(initialRoute.page);
  const [currentTab, setCurrentTab] = useState<ActiveTab>(initialRoute.tab);
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
    const handleHashChange = () => {
      const route = parseHash(window.location.hash);
      setCurrentPage(route.page);
      setCurrentTab(route.tab);
    };

    window.addEventListener("hashchange", handleHashChange);
    if (!window.location.hash) {
      window.location.hash = buildHash(initialRoute.page, initialRoute.tab);
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [initialRoute.page, initialRoute.tab]);

  useEffect(() => {
    void checkHealth();

    const intervalId = window.setInterval(() => {
      void checkHealth();
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [checkHealth]);

  useEffect(() => {
    document.title =
      currentPage === "about"
        ? "Pregador IA | Sobre o projeto"
        : currentPage === "resources"
          ? "Pregador IA | Recursos"
          : currentPage === "trust"
            ? "Pregador IA | Confianca e privacidade"
            : currentPage === "contact"
              ? "Pregador IA | Contato"
              : currentPage === "landing"
                ? "Pregador IA | Preparacao biblica com apoio inteligente"
                : `Pregador IA | ${TAB_TITLES[currentTab]}`;
  }, [currentPage, currentTab]);

  const navigateToPage = (page: PageType, nextTab: ActiveTab = currentTab) => {
    setCurrentPage(page);
    setCurrentTab(nextTab);
    window.location.hash = buildHash(page, nextTab);
  };

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
        <a href="#main-content" className="skip-link">
          Pular para o conteudo principal
        </a>
        <nav className="app-navbar">
          <div className="navbar-content">
            <button className="logo" onClick={() => navigateToPage("landing")}>
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
                className={`nav-link ${currentPage === "landing" ? "active" : ""}`}
                onClick={() => navigateToPage("landing")}
              >
                Inicio
              </button>
              <button
                className={`nav-link ${currentPage === "app" ? "active" : ""}`}
                onClick={() => navigateToPage("app")}
              >
                App
              </button>
              <button
                className={`nav-link ${currentPage === "resources" ? "active" : ""}`}
                onClick={() => navigateToPage("resources")}
              >
                Recursos
              </button>
              <button
                className={`nav-link ${currentPage === "about" ? "active" : ""}`}
                onClick={() => navigateToPage("about")}
              >
                Sobre
              </button>
              <button
                className={`nav-link ${currentPage === "trust" ? "active" : ""}`}
                onClick={() => navigateToPage("trust")}
              >
                Confianca
              </button>
              <button
                className={`nav-link ${currentPage === "contact" ? "active" : ""}`}
                onClick={() => navigateToPage("contact")}
              >
                Contato
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
              <span className="api-status-badge">
                {currentPage === "app"
                  ? TAB_TITLES[currentTab]
                  : currentPage === "landing"
                    ? "Landing page"
                    : "Pagina institucional"}
              </span>
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

        <main className="app-main" id="main-content">
          <Suspense fallback={<div className="page-loading">Carregando pagina...</div>}>
            {currentPage === "landing" && (
              <Landing
                onEnterApp={() => navigateToPage("app")}
                onOpenResources={() => navigateToPage("resources")}
                onOpenTrust={() => navigateToPage("trust")}
              />
            )}
            {currentPage === "app" && (
              <Home
                activeTab={currentTab}
                onTabChange={(tab) => navigateToPage("app", tab)}
              />
            )}
            {currentPage === "resources" && (
              <Resources onOpenApp={() => navigateToPage("app")} />
            )}
            {currentPage === "about" && (
              <About
                onBackHome={() => navigateToPage("app")}
                githubUrl={GITHUB_REPO_URL}
              />
            )}
            {currentPage === "trust" && <TrustCenter />}
            {currentPage === "contact" && (
              <Contact githubUrl={GITHUB_REPO_URL} />
            )}
          </Suspense>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
