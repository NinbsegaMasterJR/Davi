import React from "react";
import "./HowTo.css";

interface HowToProps {
  onOpenApp: () => void;
  onOpenResources: () => void;
  onOpenTrust: () => void;
}

const START_PATHS = [
  {
    title: "Tenho um tema",
    label: "Comece pelo esboço",
    text: "Escreva o tema, informe o público e peça uma estrutura inicial. Depois refine a aplicação, a introdução e a conclusão.",
  },
  {
    title: "Tenho uma passagem",
    label: "Explique o texto",
    text: "Informe a referência bíblica e use a explicação para organizar contexto, sentido principal e pontos de ensino.",
  },
  {
    title: "Quero sustentar melhor",
    label: "Busque referências",
    text: "Use versículos por tema e concordância para ampliar repertório antes de fechar a mensagem.",
  },
  {
    title: "Preciso planejar",
    label: "Monte o cronograma",
    text: "Defina período, frequência e tema central para transformar ideias soltas em uma sequência pregável.",
  },
];

const RHYTHM = [
  "Faça uma primeira geração curta e clara.",
  "Leia com a Bíblia aberta antes de aceitar qualquer sugestão.",
  "Use os refinamentos para ajustar tom, profundidade e aplicação.",
  "Salve o material útil na biblioteca local.",
  "Exporte quando o texto estiver pronto para revisão final.",
];

const CARE_POINTS = [
  {
    title: "Critério bíblico",
    text: "A IA ajuda no rascunho, mas a responsabilidade pastoral continua sendo sua.",
  },
  {
    title: "Contexto primeiro",
    text: "Quando possível, informe público, ocasião, objetivo e tradição teológica.",
  },
  {
    title: "Revisão antes do púlpito",
    text: "Confira referências, citações, tom pastoral e aplicações sensíveis.",
  },
];

export const HowTo: React.FC<HowToProps> = ({
  onOpenApp,
  onOpenResources,
  onOpenTrust,
}) => {
  return (
    <div className="howto-page">
      <section className="howto-hero">
        <div className="howto-hero-copy">
          <p className="section-kicker">Como usar</p>
          <h1>Comece com uma necessidade ministerial, não com uma tela em branco</h1>
          <p>
            Escolha o ponto de partida mais próximo da sua rotina de preparo e
            avance em ciclos pequenos: gerar, revisar, refinar, salvar e exportar.
          </p>
          <div className="howto-actions">
            <button type="button" className="landing-btn primary" onClick={onOpenApp}>
              Abrir workspace
            </button>
            <button type="button" className="landing-btn secondary" onClick={onOpenResources}>
              Ver recursos
            </button>
          </div>
        </div>
        <aside className="howto-side-note" aria-label="Ritmo recomendado">
          <span>Ritmo recomendado</span>
          <strong>Uma boa resposta nasce de um pedido bem situado.</strong>
          <p>
            Quanto mais claro for o tema, o texto bíblico, o público e o objetivo,
            melhor será o primeiro rascunho.
          </p>
        </aside>
      </section>

      <section className="howto-paths" aria-labelledby="howto-paths-title">
        <div className="howto-section-heading">
          <p className="section-kicker">Pontos de partida</p>
          <h2 id="howto-paths-title">Escolha pelo que você já tem em mãos</h2>
        </div>
        <div className="howto-grid">
          {START_PATHS.map((path) => (
            <article className="howto-card" key={path.title}>
              <span>{path.label}</span>
              <h3>{path.title}</h3>
              <p>{path.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="howto-rhythm" aria-labelledby="howto-rhythm-title">
        <div className="howto-section-heading">
          <p className="section-kicker">Fluxo simples</p>
          <h2 id="howto-rhythm-title">Cinco passos para preparar sem se perder</h2>
        </div>
        <ol>
          {RHYTHM.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="howto-care" aria-labelledby="howto-care-title">
        <div className="howto-section-heading">
          <p className="section-kicker">Boas práticas</p>
          <h2 id="howto-care-title">Use como apoio, revise como pastor</h2>
        </div>
        <div className="howto-care-list">
          {CARE_POINTS.map((point) => (
            <article key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="howto-cta">
        <div>
          <p className="section-kicker">Confiança</p>
          <h2>Antes de usar em público, revise com calma</h2>
          <p>
            Veja os cuidados de privacidade, limites de IA e recomendações para
            manter o preparo fiel ao texto bíblico.
          </p>
        </div>
        <button type="button" className="landing-btn primary" onClick={onOpenTrust}>
          Abrir central de confiança
        </button>
      </section>
    </div>
  );
};
