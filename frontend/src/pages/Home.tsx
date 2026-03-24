import React, { useState } from "react";
import { SermonOutline } from "../components/SermonOutline";
import { VersesSuggestion } from "../components/VersesSuggestion";
import { TheologicalAnalysis } from "../components/TheologicalAnalysis";
import "./Home.css";

type ActiveTab = "outline" | "verses" | "analysis";

export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("outline");

  return (
    <div className="home">
      <header className="header">
        <div className="header-content">
          <h1>⛪ Pregador IA</h1>
          <p>Seu assistente inteligente para preparação de pregações</p>
        </div>
      </header>

      <nav className="nav-tabs">
        <button
          className={`tab ${activeTab === "outline" ? "active" : ""}`}
          onClick={() => setActiveTab("outline")}
        >
          📝 Esboço
        </button>
        <button
          className={`tab ${activeTab === "verses" ? "active" : ""}`}
          onClick={() => setActiveTab("verses")}
        >
          📖 Versículos
        </button>
        <button
          className={`tab ${activeTab === "analysis" ? "active" : ""}`}
          onClick={() => setActiveTab("analysis")}
        >
          🔍 Análise
        </button>
      </nav>

      <main className="main-content">
        {activeTab === "outline" && <SermonOutline />}
        {activeTab === "verses" && <VersesSuggestion />}
        {activeTab === "analysis" && <TheologicalAnalysis />}
      </main>

      <footer className="footer">
        <p>© 2024 Pregador IA - Assistente de Pregações Inteligente</p>
      </footer>
    </div>
  );
};
