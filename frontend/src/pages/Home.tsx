import React, { Suspense, lazy } from "react";
import { BrandLogo } from "../components/BrandLogo";
import { LibraryPanel } from "../components/LibraryPanel";
import "./Home.css";

const SermonOutline = lazy(() =>
  import("../components/SermonOutline").then((module) => ({
    default: module.SermonOutline,
  })),
);
const VersesSuggestion = lazy(() =>
  import("../components/VersesSuggestion").then((module) => ({
    default: module.VersesSuggestion,
  })),
);
const TheologicalAnalysis = lazy(() =>
  import("../components/TheologicalAnalysis").then((module) => ({
    default: module.TheologicalAnalysis,
  })),
);
const ExplicarPassagem = lazy(() =>
  import("../components/ExplicarPassagem").then((module) => ({
    default: module.ExplicarPassagem,
  })),
);
const Concordancia = lazy(() =>
  import("../components/Concordancia").then((module) => ({
    default: module.Concordancia,
  })),
);
const CronogramaPregacoes = lazy(() =>
  import("../components/CronogramaPregacoes").then((module) => ({
    default: module.CronogramaPregacoes,
  })),
);
const PastoralLetter = lazy(() =>
  import("../components/PastoralLetter").then((module) => ({
    default: module.PastoralLetter,
  })),
);

export type ActiveTab =
  | "outline"
  | "verses"
  | "analysis"
  | "explain"
  | "concordance"
  | "schedule"
  | "pastoral-letter";

interface HomeProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const TOOL_CARDS: Array<{
  id: ActiveTab;
  title: string;
  eyebrow: string;
  description: string;
}> = [
  {
    id: "outline",
    title: "Montar esboco",
    eyebrow: "Mais usado",
    description: "Estruture uma mensagem com base, fluxo e secoes opcionais antes de pregar.",
  },
  {
    id: "analysis",
    title: "Aprofundar tema",
    eyebrow: "Doutrina",
    description: "Abra contexto, implicacoes teologicas e aplicacao para ensino e pregacao.",
  },
  {
    id: "verses",
    title: "Mapear referencias",
    eyebrow: "Apoio biblico",
    description: "Levante textos ligados ao assunto para ampliar o estudo rapidamente.",
  },
  {
    id: "schedule",
    title: "Planejar serie",
    eyebrow: "Organizacao",
    description: "Monte um cronograma mensal de ministracoes com mais coerencia e ritmo.",
  },
];

function renderTool(activeTab: ActiveTab) {
  switch (activeTab) {
    case "outline":
      return <SermonOutline />;
    case "verses":
      return <VersesSuggestion />;
    case "analysis":
      return <TheologicalAnalysis />;
    case "explain":
      return <ExplicarPassagem />;
    case "concordance":
      return <Concordancia />;
    case "schedule":
      return <CronogramaPregacoes />;
    case "pastoral-letter":
      return <PastoralLetter />;
    default:
      return <SermonOutline />;
  }
}

export const Home: React.FC<HomeProps> = ({ activeTab, onTabChange }) => {
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
          <div className="hero-actions">
            <button
              type="button"
              className="hero-action primary"
              onClick={() => onTabChange("outline")}
            >
              Comecar pelo esboco
            </button>
            <button
              type="button"
              className="hero-action"
              onClick={() => onTabChange("analysis")}
            >
              Abrir analise teologica
            </button>
          </div>
          <div className="hero-highlights">
            <span>Esbocos prontos para desenvolver</span>
            <span>Analise teologica com contexto</span>
            <span>Aplicacao fiel para a igreja</span>
          </div>
        </div>
      </header>

      <section className="tool-overview">
        <div className="tool-overview-copy">
          <p className="section-kicker">Fluxo recomendado</p>
          <h2>Entre pela necessidade, nao pela tela</h2>
          <p>
            O app destaca os caminhos mais comuns para facilitar escolha,
            retomada por URL e continuidade do estudo.
          </p>
        </div>
        <div className="tool-card-grid">
          {TOOL_CARDS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              className={`tool-card ${activeTab === tool.id ? "active" : ""}`}
              onClick={() => onTabChange(tool.id)}
            >
              <span className="tool-card-eyebrow">{tool.eyebrow}</span>
              <strong>{tool.title}</strong>
              <span>{tool.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="trust-panel">
        <div>
          <p className="section-kicker">Confianca e revisao</p>
          <h2>Use a IA como apoio pastoral, nao como substituta da conferencia biblica</h2>
        </div>
        <p>
          Ferramentas de sugestao de referencias usam IA para acelerar ideias.
          Revise citacoes e textos biblicos antes de ministrar ou publicar.
        </p>
      </section>

      <nav
        className="nav-tabs"
        aria-label="Ferramentas do Pregador IA"
        role="tablist"
      >
        <button
          className={`tab ${activeTab === "outline" ? "active" : ""}`}
          onClick={() => onTabChange("outline")}
          role="tab"
          aria-selected={activeTab === "outline"}
        >
          Esboco
        </button>
        <button
          className={`tab ${activeTab === "verses" ? "active" : ""}`}
          onClick={() => onTabChange("verses")}
          role="tab"
          aria-selected={activeTab === "verses"}
        >
          Versiculos
        </button>
        <button
          className={`tab ${activeTab === "analysis" ? "active" : ""}`}
          onClick={() => onTabChange("analysis")}
          role="tab"
          aria-selected={activeTab === "analysis"}
        >
          Analise
        </button>
        <button
          className={`tab ${activeTab === "explain" ? "active" : ""}`}
          onClick={() => onTabChange("explain")}
          role="tab"
          aria-selected={activeTab === "explain"}
        >
          Passagem
        </button>
        <button
          className={`tab ${activeTab === "concordance" ? "active" : ""}`}
          onClick={() => onTabChange("concordance")}
          role="tab"
          aria-selected={activeTab === "concordance"}
        >
          Concordancia
        </button>
        <button
          className={`tab ${activeTab === "schedule" ? "active" : ""}`}
          onClick={() => onTabChange("schedule")}
          role="tab"
          aria-selected={activeTab === "schedule"}
        >
          Cronograma
        </button>
        <button
          className={`tab ${activeTab === "pastoral-letter" ? "active" : ""}`}
          onClick={() => onTabChange("pastoral-letter")}
          role="tab"
          aria-selected={activeTab === "pastoral-letter"}
        >
          Carta GCEU
        </button>
      </nav>

      <main className="main-content">
        <Suspense fallback={<div className="tool-loader">Carregando ferramenta...</div>}>
          {renderTool(activeTab)}
        </Suspense>
      </main>

      <LibraryPanel />

      <footer className="footer">
        <p>2026 Pregador IA - Preparacao inteligente para mensagens biblicas</p>
      </footer>
    </div>
  );
};
