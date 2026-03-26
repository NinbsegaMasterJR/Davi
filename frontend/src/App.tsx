import { useState } from "react";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { AppProvider } from "./context/AppContext";
import "./App.css";

type PageType = "home" | "about";

const GITHUB_REPO_URL = "https://github.com/NinsegaMasterJr/Gerador.P-Web";

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");

  return (
    <AppProvider>
      <div className="app">
        {/* Navigation Header */}
        <nav className="app-navbar">
          <div className="navbar-content">
            <button className="logo" onClick={() => setCurrentPage("home")}>
              <span className="logo-mark">⛪</span>
              <span className="logo-copy">
                <strong>Pregador IA</strong>
                <small>Esboços, análise e estudo bíblico</small>
              </span>
            </button>
            <div className="nav-links">
              <button
                className={`nav-link ${currentPage === "home" ? "active" : ""}`}
                onClick={() => setCurrentPage("home")}
              >
                🏠 Início
              </button>
              <button
                className={`nav-link ${currentPage === "about" ? "active" : ""}`}
                onClick={() => setCurrentPage("about")}
              >
                ℹ️ Sobre
              </button>
              <a
                href={GITHUB_REPO_URL}
                className="nav-link"
                target="_blank"
                rel="noreferrer"
              >
                🐙 GitHub
              </a>
            </div>
          </div>
        </nav>

        {/* Page Content */}
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
