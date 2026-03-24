import { useState } from "react";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { AppProvider } from "./context/AppContext";
import "./App.css";

type PageType = "home" | "about";

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");

  return (
    <AppProvider>
      <div className="app">
        {/* Navigation Header */}
        <nav className="app-navbar">
          <div className="navbar-content">
            <div
              className="logo"
              onClick={() => setCurrentPage("home")}
              style={{ cursor: "pointer" }}
            >
              <h2>⛪ Pregador IA</h2>
            </div>
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
                href="https://github.com/seu-usuario/Gerador.P-Web"
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
          {currentPage === "about" && <About />}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
