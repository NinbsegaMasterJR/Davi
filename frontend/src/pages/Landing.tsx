import React from "react";
import { BrandLogo } from "../components/BrandLogo";
import type { ActiveTab } from "./Home";
import "./Landing.css";

interface LandingProps {
  onEnterApp: () => void;
  onCreateOutline: () => void;
  onOpenTool: (tab: ActiveTab) => void;
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

const QUICK_STARTS: Array<{
  label: string;
  prompt: string;
  tab: ActiveTab;
}> = [
  {
    label: "Mensagem de domingo",
    prompt: "Fé que persevera",
    tab: "outline",
  },
  {
    label: "Texto para explicar",
    prompt: "João 15",
    tab: "explain",
  },
  {
    label: "Versículos de apoio",
    prompt: "Esperança em meio à prova",
    tab: "verses",
  },
  {
    label: "Planejar série",
    prompt: "Discipulado em 4 semanas",
    tab: "schedule",
  },
];

const DECISION_CARDS: Array<{
  title: string;
  text: string;
  action: string;
  tab: ActiveTab;
}> = [
  {
    title: "Tenho um tema",
    text: "Comece com tese, texto base, objetivos e desenvolvimento pregável.",
    action: "Montar esboço",
    tab: "outline",
  },
  {
    title: "Tenho uma passagem",
    text: "Organize contexto, sentido central, conexões bíblicas e aplicação.",
    action: "Explicar texto",
    tab: "explain",
  },
  {
    title: "Preciso planejar o mês",
    text: "Distribua temas, textos e ritmo pastoral para as próximas semanas.",
    action: "Planejar série",
    tab: "schedule",
  },
  {
    title: "Preciso falar com a igreja",
    text: "Escreva uma carta pastoral clara, bíblica e pronta para adaptar.",
    action: "Escrever carta",
    tab: "pastoral-letter",
  },
];

const DEMO_SECTIONS = [
  {
    title: "Tema",
    text: "Fé que persevera",
  },
  {
    title: "Texto base",
    text: "Hebreus 12:1-3",
  },
  {
    title: "Ideia central",
    text: "A igreja persevera quando mantém os olhos em Cristo e abandona pesos que enfraquecem a caminhada.",
  },
  {
    title: "Aplicação",
    text: "Identificar pesos, retomar disciplinas espirituais e caminhar em comunidade.",
  },
];

export const Landing: React.FC<LandingProps> = ({
  onEnterApp,
  onCreateOutline,
  onOpenTool,
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
              <h1>Comece pelo que você precisa preparar hoje.</h1>
            </div>
          </div>

          <p className="landing-lead">
            Transforme tema, passagem ou necessidade pastoral em esboço,
            explicação, referências, cronograma ou carta com menos fricção e
            mais critério para revisar.
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
          <div className="landing-quick-start" aria-label="Começos rápidos">
            {QUICK_STARTS.map((item) => (
              <button
                key={item.label}
                type="button"
                className="landing-quick-card"
                onClick={() => onOpenTool(item.tab)}
              >
                <span>{item.label}</span>
                <strong>{item.prompt}</strong>
              </button>
            ))}
          </div>

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

      <section className="landing-section landing-choice">
        <div className="landing-section-copy">
          <p className="section-kicker">Escolha guiada</p>
          <h2>O que você precisa preparar hoje?</h2>
          <p>
            Entre pelo ponto real da rotina pastoral e avance direto para a
            ferramenta mais útil.
          </p>
        </div>
        <div className="landing-choice-grid">
          {DECISION_CARDS.map((card) => (
            <article key={card.title} className="landing-choice-card">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <button
                type="button"
                className="landing-btn"
                onClick={() => onOpenTool(card.tab)}
              >
                {card.action}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-demo">
        <div className="landing-section-copy">
          <p className="section-kicker">Exemplo rápido</p>
          <h2>De um tema simples para um rascunho revisável</h2>
          <p>
            A saída nasce organizada para você conferir texto bíblico, tom,
            doutrina e aplicação antes de ministrar.
          </p>
        </div>
        <div className="landing-demo-panel">
          {DEMO_SECTIONS.map((section) => (
            <div key={section.title}>
              <span>{section.title}</span>
              <strong>{section.text}</strong>
            </div>
          ))}
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
