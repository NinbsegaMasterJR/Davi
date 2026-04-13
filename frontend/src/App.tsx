import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import type { ActiveTab } from "./pages/Home";
import { AppProvider } from "./context/AppContext";
import { API_ENDPOINTS } from "./config";
import { BrandLogo } from "./components/BrandLogo";
import {
  LAST_TAB_STORAGE_KEY,
  LEGACY_LAST_TAB_STORAGE_KEY,
  readStorageItem,
} from "./utils/workspaceSnapshot";
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
const HowTo = lazy(() =>
  import("./pages/HowTo").then((module) => ({ default: module.HowTo })),
);
const TrustCenter = lazy(() =>
  import("./pages/TrustCenter").then((module) => ({
    default: module.TrustCenter,
  })),
);
const Contact = lazy(() =>
  import("./pages/Contact").then((module) => ({ default: module.Contact })),
);

type PageType =
  | "landing"
  | "app"
  | "resources"
  | "howto"
  | "about"
  | "trust"
  | "contact";
type ApiStatus = "checking" | "online" | "offline";

interface HealthResponse {
  status: string;
  message: string;
  groqConfigured?: boolean;
}

const GITHUB_REPO_URL = "https://github.com/NinbsegaMasterJR/Davi";
const DEFAULT_TAB: ActiveTab = "outline";

const TAB_TITLES: Record<ActiveTab, string> = {
  outline: "Esboço de Pregação",
  verses: "Versículos por Tema",
  analysis: "Análise Teológica",
  explain: "Explicar Passagem",
  concordance: "Concordância Bíblica",
  schedule: "Cronograma de Pregações",
  "pastoral-letter": "Carta Pastoral",
};

function isActiveTab(value: string): value is ActiveTab {
  return value in TAB_TITLES;
}

function loadLastVisitedTab(): ActiveTab {
  const stored = readStorageItem(
    LAST_TAB_STORAGE_KEY,
    LEGACY_LAST_TAB_STORAGE_KEY,
  );
  return stored && isActiveTab(stored) ?stored : DEFAULT_TAB;
}

function parseHash(hash: string): { page: PageType; tab: ActiveTab } {
  const cleanedHash = hash.replace(/^#/, "").replace(/^\/?/, "");
  const lastVisitedTab = loadLastVisitedTab();

  if (!cleanedHash || cleanedHash === "inicio" || cleanedHash === "landing") {
    return { page: "landing", tab: lastVisitedTab };
  }

  if (cleanedHash === "recursos") {
    return { page: "resources", tab: lastVisitedTab };
  }

  if (cleanedHash === "como-usar" || cleanedHash === "guia") {
    return { page: "howto", tab: lastVisitedTab };
  }

  if (cleanedHash === "sobre" || cleanedHash === "about") {
    return { page: "about", tab: lastVisitedTab };
  }

  if (cleanedHash === "confianca") {
    return { page: "trust", tab: lastVisitedTab };
  }

  if (cleanedHash === "contato") {
    return { page: "contact", tab: lastVisitedTab };
  }

  if (cleanedHash === "app" || cleanedHash === "workspace") {
    return { page: "app", tab: lastVisitedTab };
  }

  if (cleanedHash.startsWith("app/") || cleanedHash.startsWith("ferramenta/")) {
    const tab = cleanedHash.split("/")[1];
    return {
      page: "app",
      tab: tab && isActiveTab(tab) ?tab : lastVisitedTab,
    };
  }

  return { page: "landing", tab: lastVisitedTab };
}

function buildHash(page: PageType, tab: ActiveTab): string {
  switch (page) {
    case "about":
      return "#/sobre";
    case "resources":
      return "#/recursos";
    case "howto":
      return "#/como-usar";
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
  const [focusToolOnOpen, setFocusToolOnOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const checkHealth = useCallback(async () => {
    setApiStatus((currentStatus) =>
      currentStatus === "online" ?currentStatus : "checking",
    );

    try {
      const response = await fetch(API_ENDPOINTS.HEALTH, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Health check falhou");
      }

      const data = (await response.json()) as HealthResponse;
      setApiStatus(data.status === "OK" ?"online" : "offline");
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
      setMobileMenuOpen(false);
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
        ?"Scriptura | Sobre o projeto"
        : currentPage === "resources"
          ?"Scriptura | Recursos"
          : currentPage === "howto"
            ?"Scriptura | Como usar"
            : currentPage === "trust"
            ?"Scriptura | Confiança e privacidade"
            : currentPage === "contact"
              ?"Scriptura | Contato"
              : currentPage === "landing"
                ?"Scriptura | Preparação bíblica com apoio inteligente"
                : `Scriptura | ${TAB_TITLES[currentTab]}`;
  }, [currentPage, currentTab]);

  useEffect(() => {
    window.localStorage.setItem(LAST_TAB_STORAGE_KEY, currentTab);
  }, [currentTab]);

  const navigateToPage = (page: PageType, nextTab: ActiveTab = currentTab) => {
    setCurrentPage(page);
    setCurrentTab(nextTab);
    setMobileMenuOpen(false);
    window.location.hash = buildHash(page, nextTab);
  };

  const openOutlineCreator = () => {
    setFocusToolOnOpen(true);
    navigateToPage("app", "outline");
  };

  const clearToolFocusRequest = useCallback(() => {
    setFocusToolOnOpen(false);
  }, []);

  const statusMessage =
    apiStatus === "checking"
      ?"Verificando conexão com a API..."
      : apiStatus === "offline"
        ?"API offline. Inicie o backend para gerar conteúdo."
        : groqConfigured
          ?"API online e pronta para gerar conteúdo."
          : "API online, mas a GROQ_API_KEY não está configurada no backend.";

  const statusClass =
    apiStatus === "online" && groqConfigured
      ?"status-ok"
      : apiStatus === "checking"
        ?"status-warn"
        : "status-error";
  const apiReady = apiStatus === "online" && groqConfigured;

  const pageLabel =
    currentPage === "app"
      ?TAB_TITLES[currentTab]
      : currentPage === "landing"
        ?"Landing editorial"
        : currentPage === "howto"
          ?"Guia de uso"
          : "Página institucional";

  return (
    <AppProvider>
      <div className="app">
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo principal
        </a>
        <nav className="app-navbar">
          <div className="navbar-content">
            <div className="navbar-primary">
              <button className="logo" onClick={() => navigateToPage("landing")}>
                <span className="logo-mark">
                  <BrandLogo className="brand-logo" />
                </span>
                <span className="logo-copy">
                  <strong>Scriptura</strong>
                  <small>Preparo bíblico com critério, ritmo e profundidade</small>
                </span>
              </button>
              <button
                type="button"
                className="nav-menu-toggle"
                aria-controls="primary-navigation"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
              >
                Menu
              </button>
              <div
                className={`nav-links ${mobileMenuOpen ? "open" : ""}`}
                id="primary-navigation"
              >
                <button
                  className={`nav-link ${currentPage === "landing" ?"active" : ""}`}
                  onClick={() => navigateToPage("landing")}
                >
                  Início
                </button>
                <button
                  className={`nav-link ${currentPage === "app" ?"active" : ""}`}
                  onClick={() => navigateToPage("app")}
                >
                  Workspace
                </button>
                <button
                  className={`nav-link ${currentPage === "resources" ?"active" : ""}`}
                  onClick={() => navigateToPage("resources")}
                >
                  Recursos
                </button>
                <button
                  className={`nav-link ${currentPage === "howto" ?"active" : ""}`}
                  onClick={() => navigateToPage("howto")}
                >
                  Como usar
                </button>
                <button
                  className={`nav-link ${currentPage === "about" ?"active" : ""}`}
                  onClick={() => navigateToPage("about")}
                >
                  Sobre
                </button>
                <button
                  className={`nav-link ${currentPage === "trust" ?"active" : ""}`}
                  onClick={() => navigateToPage("trust")}
                >
                  Confiança
                </button>
                <button
                  className={`nav-link ${currentPage === "contact" ?"active" : ""}`}
                  onClick={() => navigateToPage("contact")}
                >
                  Contato
                </button>
              </div>
            </div>
            <div className={`nav-side ${mobileMenuOpen ? "open" : ""}`}>
              {apiReady && (
                <span className="nav-health-pill">
                  <span className="status-dot" aria-hidden="true" />
                  API online
                </span>
              )}
              <button
                type="button"
                className="nav-link nav-link-secondary nav-link-cta"
                onClick={openOutlineCreator}
              >
                Criar esboço
              </button>
              <a
                href={GITHUB_REPO_URL}
                className="nav-link nav-link-secondary"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
          {!apiReady && (
            <div className={`api-status ${statusClass}`}>
              <div className="api-status-copy">
                <span className="api-status-label">
                  <span className="status-dot" aria-hidden="true" />
                  Ambiente publicado
                </span>
                <strong>{statusMessage}</strong>
              </div>
              <div className="api-status-actions">
                <span className="api-status-badge">{pageLabel}</span>
                {lastCheckedAt && (
                  <span className="api-status-meta">
                    Última verificação: {lastCheckedAt}
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
          )}
        </nav>

        <main className="app-main" id="main-content">
          <Suspense fallback={<div className="page-loading">Carregando página...</div>}>
            {currentPage === "landing" && (
              <Landing
                onEnterApp={() => navigateToPage("app")}
                onCreateOutline={openOutlineCreator}
                onOpenTool={(tab) => navigateToPage("app", tab)}
                onOpenResources={() => navigateToPage("resources")}
                onOpenTrust={() => navigateToPage("trust")}
              />
            )}
            {currentPage === "app" && (
              <Home
                activeTab={currentTab}
                onTabChange={(tab) => navigateToPage("app", tab)}
                focusToolOnOpen={focusToolOnOpen}
                onToolFocused={clearToolFocusRequest}
              />
            )}
            {currentPage === "resources" && (
              <Resources onOpenApp={() => navigateToPage("app")} />
            )}
            {currentPage === "howto" && (
              <HowTo
                onOpenApp={() => navigateToPage("app")}
                onOpenResources={() => navigateToPage("resources")}
                onOpenTrust={() => navigateToPage("trust")}
              />
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
