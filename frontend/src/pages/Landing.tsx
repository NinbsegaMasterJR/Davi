import React from "react";
import { BrandLogo } from "../components/BrandLogo";
import "./Landing.css";

interface LandingProps {
  onEnterApp: () => void;
  onCreateOutline: () => void;
  onOpenResources: () => void;
  onOpenTrust: () => void;
}

const FEATURE_LIST = [
  "Esboços estruturados para pregação, ensino e estudo em grupo",
  "Análise teológica ajustável para sala de aula ou púlpito",
  "Explicação de passagens com contexto e aplicação ministerial",
  "Cronogramas e cartas pastorais prontos para adaptar",
];

const PILLARS = [
  {
    title: "Clareza",
    text: "Comece com uma direção de trabalho em vez de enfrentar uma tela em branco.",
  },
  {
    title: "Profundidade",
    text: "Ajuste a resposta para estudo doutrinário, pregação expositiva ou série temática.",
  },
  {
    title: "Responsabilidade",
    text: "A IA ajuda no preparo, mas a conferência bíblica continua sendo parte do processo.",
  },
];

const JOURNEY = [
  {
    title: "Comece por uma necessidade real",
    text: "Tema, passagem, palavra-chave, cronograma ou carta pastoral.",
  },
  {
    title: "Abra um fluxo guiado",
    text: "O produto orienta o usuário por objetivo de preparo, não por nomenclatura técnica.",
  },
  {
    title: "Revise e reaproveite",
    text: "Salve resultados, exporte e retome rascunhos na biblioteca local.",
  },
];

export const Landing: React.FC<LandingProps> = ({
  onEnterApp,
  onCreateOutline,
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
              <span className="landing-kicker">Preparação bíblica com apoio inteligente</span>
              <h1>Scriptura</h1>
            </div>
          </div>

          <p className="landing-lead">
            Um ateliê digital para transformar tema, texto e necessidade
            ministerial em estudo, esboço e comunicação pastoral com mais
            critério visual, menos fricção e ritmo de preparo.
          </p>

          <div className="landing-actions">
            <button type="button" className="landing-btn primary" onClick={onCreateOutline}>
              Criar esboço agora
            </button>
            <button type="button" className="landing-btn" onClick={onEnterApp}>
              Abrir o workspace
            </button>
            <button type="button" className="landing-btn" onClick={onOpenResources}>
              Ver recursos
            </button>
            <button type="button" className="landing-btn subtle" onClick={onOpenTrust}>
              Confiança e revisão
            </button>
          </div>

          <div className="landing-editorial-strip">
            <span>Feito para pregação, ensino e alinhamento pastoral</span>
            <span>Sem cadastro obrigatório para começar</span>
            <span>Com biblioteca local para retomar rascunhos</span>
          </div>
        </div>

        <div className="landing-hero-panel">
          <div className="landing-panel-card landing-panel-featured">
            <span className="landing-panel-label">Ateliê ministerial</span>
            <strong>Do tema bruto ao material pregável com mais direção</strong>
            <p>
              A proposta não é terceirizar critério pastoral, e sim encurtar o
              caminho entre intuição, estudo, estrutura e revisão.
            </p>
          </div>

          <p className="section-kicker">O que você ganha</p>
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
              <span>workspace com biblioteca local</span>
            </div>
            <div>
              <strong>0</strong>
              <span>cadastro obrigatório para iniciar</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-journey">
        <div className="landing-section-copy">
          <p className="section-kicker">Jornada do produto</p>
          <h2>Projetado para parecer ferramenta de preparo, não repositório de prompts</h2>
          <p>
            A experiência foi desenhada para acompanhar a lógica do ministério:
            partir de uma necessidade concreta, aprofundar o texto e fechar com
            revisão pastoral e reaproveitamento.
          </p>
        </div>

        <div className="landing-journey-grid">
          {JOURNEY.map((step, index) => (
            <article key={step.title} className="landing-journey-card">
              <span className="landing-journey-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-copy">
          <p className="section-kicker">Direção do produto</p>
          <h2>Feito para apoiar o preparo, não para substituir critério pastoral</h2>
          <p>
            O fluxo reduz tempo de preparação, organiza ideias e amplia pontos
            de partida sem esconder os limites da IA nem enfraquecer a
            responsabilidade de revisão bíblica.
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

      <section className="landing-section landing-manifesto">
        <div className="landing-manifesto-copy">
          <p className="section-kicker">Assinatura visual</p>
          <h2>Editorial por fora, workspace por dentro</h2>
          <p>
            A landing apresenta o projeto como ferramenta com voz própria. O
            app, por sua vez, prioriza foco, hierarquia e continuidade do
            preparo para que o conteúdo apareça mais rápido do que a interface.
          </p>
        </div>
        <div className="landing-manifesto-note">
          <span>Direção visual</span>
          <strong>Textura, contraste de superfícies e tipografia com mais assinatura</strong>
          <p>
            O objetivo é fazer o produto parecer intencional, confiável e
            memorável antes mesmo do primeiro clique.
          </p>
        </div>
      </section>

      <section className="landing-section landing-cta">
        <div>
          <p className="section-kicker">Pronto para começar</p>
          <h2>Entre no workspace e monte sua próxima mensagem com mais base e menos fricção</h2>
        </div>
        <button type="button" className="landing-btn primary" onClick={onEnterApp}>
          Ir para o workspace
        </button>
      </section>
    </div>
  );
};
