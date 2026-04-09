import React from "react";
import { BrandLogo } from "../components/BrandLogo";
import "./Landing.css";

interface LandingProps {
  onEnterApp: () => void;
  onOpenResources: () => void;
  onOpenTrust: () => void;
}

const FEATURE_LIST = [
  "Esbocos estruturados para pregacao e ensino",
  "Analise teologica com profundidade ajustavel",
  "Explicacao de passagens com aplicacao ministerial",
  "Cronogramas e cartas pastorais prontos para adaptar",
];

const PILLARS = [
  {
    title: "Clareza",
    text: "Comece com estrutura, nao com tela em branco.",
  },
  {
    title: "Profundidade",
    text: "Ajuste a resposta para estudo, sala de aula ou pulpito.",
  },
  {
    title: "Responsabilidade",
    text: "A IA ajuda no preparo, mas o texto biblico continua pedindo revisao.",
  },
];

export const Landing: React.FC<LandingProps> = ({
  onEnterApp,
  onOpenResources,
  onOpenTrust,
}) => {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-brand">
            <div className="landing-logo-shell">
              <BrandLogo className="landing-logo" />
            </div>
            <div>
              <span className="landing-kicker">Preparacao biblica com apoio inteligente</span>
              <h1>Pregador IA</h1>
            </div>
          </div>
          <p className="landing-lead">
            Transforme temas, passagens e necessidades da igreja em estudos,
            esbocos e planos de ministracao com mais clareza, organizacao e ritmo.
          </p>
          <div className="landing-actions">
            <button type="button" className="landing-btn primary" onClick={onEnterApp}>
              Abrir o app
            </button>
            <button type="button" className="landing-btn" onClick={onOpenResources}>
              Ver recursos
            </button>
            <button type="button" className="landing-btn subtle" onClick={onOpenTrust}>
              Como tratamos confianca
            </button>
          </div>
        </div>
        <div className="landing-hero-panel">
          <p className="section-kicker">O que voce ganha</p>
          <ul className="landing-feature-list">
            {FEATURE_LIST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="landing-stat-grid">
            <div>
              <strong>7</strong>
              <span>ferramentas ministeriais</span>
            </div>
            <div>
              <strong>1</strong>
              <span>biblioteca local integrada</span>
            </div>
            <div>
              <strong>0</strong>
              <span>cadastro obrigatorio para comecar</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-copy">
          <p className="section-kicker">Direcao do produto</p>
          <h2>Feito para apoiar o preparo, nao para substituir criterio pastoral</h2>
          <p>
            O fluxo foi pensado para reduzir tempo de preparacao, organizar
            ideias e ampliar pontos de partida sem esconder os limites da IA.
          </p>
        </div>
        <div className="landing-pillars">
          {PILLARS.map((pillar) => (
            <article key={pillar.title} className="landing-card">
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-cta">
        <div>
          <p className="section-kicker">Pronto para comecar</p>
          <h2>Entre no app e monte sua proxima mensagem com mais base e menos friccao</h2>
        </div>
        <button type="button" className="landing-btn primary" onClick={onEnterApp}>
          Ir para o workspace
        </button>
      </section>
    </div>
  );
};
