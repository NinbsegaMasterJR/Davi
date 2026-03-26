import React, { useState } from "react";
import { SermonOutline } from "../components/SermonOutline";
import { VersesSuggestion } from "../components/VersesSuggestion";
import { TheologicalAnalysis } from "../components/TheologicalAnalysis";
import { ExplicarPassagem } from "../components/ExplicarPassagem";
import { Concordancia } from "../components/Concordancia";
import { CronogramaPregacoes } from "../components/CronogramaPregacoes";
import "./Home.css";

type ActiveTab =
  | "outline"
  | "verses"
  | "analysis"
  | "explain"
  | "concordance"
  | "schedule";

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
        <button
          className={`tab ${activeTab === "explain" ? "active" : ""}`}
          onClick={() => setActiveTab("explain")}
        >
          ✝️ Passagem
        </button>
        <button
          className={`tab ${activeTab === "concordance" ? "active" : ""}`}
          onClick={() => setActiveTab("concordance")}
        >
          📚 Concordância
        </button>
        <button
          className={`tab ${activeTab === "schedule" ? "active" : ""}`}
          onClick={() => setActiveTab("schedule")}
        >
          📅 Cronograma
        </button>
      </nav>

      <main className="main-content">
        {activeTab === "outline" && <SermonOutline />}
        {activeTab === "verses" && <VersesSuggestion />}
        {activeTab === "analysis" && <TheologicalAnalysis />}
        {activeTab === "explain" && <ExplicarPassagem />}
        {activeTab === "concordance" && <Concordancia />}
        {activeTab === "schedule" && <CronogramaPregacoes />}
      </main>

      <footer className="footer">
        <p>© 2026 Pregador IA - Assistente de Pregações Inteligente</p>
      </footer>
    </div>
  );
};
