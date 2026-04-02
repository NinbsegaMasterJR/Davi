import React, { useState } from "react";
import { SermonOutline } from "../components/SermonOutline";
import { VersesSuggestion } from "../components/VersesSuggestion";
import { TheologicalAnalysis } from "../components/TheologicalAnalysis";
import { ExplicarPassagem } from "../components/ExplicarPassagem";
import { Concordancia } from "../components/Concordancia";
import { CronogramaPregacoes } from "../components/CronogramaPregacoes";
import { PastoralLetter } from "../components/PastoralLetter";
import { BrandLogo } from "../components/BrandLogo";
import "./Home.css";

type ActiveTab =
  | "outline"
  | "verses"
  | "analysis"
  | "explain"
  | "concordance"
  | "schedule"
  | "pastoral-letter";

export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("outline");

  return (
    <div className="home">
      <header className="header">
        <div className="header-content">
          <div className="hero-brand">
            <div className="hero-logo-shell">
              <BrandLogo className="hero-logo" />
            </div>
            <div>
              <span className="hero-kicker">
                Preparacao biblica com direcao e profundidade
              </span>
              <h1>Pregador IA</h1>
            </div>
          </div>
          <p>
            Construa esbocos, estudos e series de mensagens com mais clareza,
            mais profundidade biblica e mais agilidade no preparo ministerial.
          </p>
          <div className="hero-highlights">
            <span>Esbocos prontos para desenvolver</span>
            <span>Analise teologica com contexto</span>
            <span>Aplicacao fiel para a igreja</span>
          </div>
        </div>
      </header>

      <nav className="nav-tabs">
        <button
          className={`tab ${activeTab === "outline" ? "active" : ""}`}
          onClick={() => setActiveTab("outline")}
        >
          Esboco
        </button>
        <button
          className={`tab ${activeTab === "verses" ? "active" : ""}`}
          onClick={() => setActiveTab("verses")}
        >
          Versiculos
        </button>
        <button
          className={`tab ${activeTab === "analysis" ? "active" : ""}`}
          onClick={() => setActiveTab("analysis")}
        >
          Analise
        </button>
        <button
          className={`tab ${activeTab === "explain" ? "active" : ""}`}
          onClick={() => setActiveTab("explain")}
        >
          Passagem
        </button>
        <button
          className={`tab ${activeTab === "concordance" ? "active" : ""}`}
          onClick={() => setActiveTab("concordance")}
        >
          Concordancia
        </button>
        <button
          className={`tab ${activeTab === "schedule" ? "active" : ""}`}
          onClick={() => setActiveTab("schedule")}
        >
          Cronograma
        </button>
        <button
          className={`tab ${activeTab === "pastoral-letter" ? "active" : ""}`}
          onClick={() => setActiveTab("pastoral-letter")}
        >
          Carta GCEU
        </button>
      </nav>

      <main className="main-content">
        {activeTab === "outline" && <SermonOutline />}
        {activeTab === "verses" && <VersesSuggestion />}
        {activeTab === "analysis" && <TheologicalAnalysis />}
        {activeTab === "explain" && <ExplicarPassagem />}
        {activeTab === "concordance" && <Concordancia />}
        {activeTab === "schedule" && <CronogramaPregacoes />}
        {activeTab === "pastoral-letter" && <PastoralLetter />}
      </main>

      <footer className="footer">
        <p>© 2026 Pregador IA - Preparacao inteligente para mensagens biblicas</p>
      </footer>
    </div>
  );
};
