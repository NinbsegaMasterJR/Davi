import React from "react";
import "./Resources.css";

interface ResourcesProps {
  onOpenApp: () => void;
}

const RESOURCE_CARDS = [
  {
    title: "Estruturar mensagem",
    eyebrow: "Esboço + passagem",
    text: "Monte base de pregação, explique o texto principal e comece com mais clareza antes de desenvolver.",
  },
  {
    title: "Aprofundar doutrina",
    eyebrow: "Análise teológica",
    text: "Explore contexto, fundamento bíblico e implicações doutrinárias para ensino e formação.",
  },
  {
    title: "Ampliar repertório bíblico",
    eyebrow: "Versículos + concordância",
    text: "Descubra referências ligadas a um tema ou conceito para sustentar melhor a mensagem.",
  },
  {
    title: "Planejar o mês",
    eyebrow: "Cronograma",
    text: "Organize séries, domingos e sequências de ensino com mais unidade e ritmo pastoral.",
  },
  {
    title: "Comunicar a igreja",
    eyebrow: "Carta pastoral",
    text: "Transforme um objetivo ministerial em um texto maduro, orientador e pronto para adaptar.",
  },
  {
    title: "Reaproveitar material",
    eyebrow: "Biblioteca local",
    text: "Retome rascunhos, compare versões e exporte o que já foi produzido sem gerar tudo de novo.",
  },
];

const STACK = [
  "Sem cadastro obrigatório para iniciar",
  "Resultados exportáveis em múltiplos formatos",
  "Biblioteca local no navegador para retomar rascunhos",
];

export const Resources: React.FC<ResourcesProps> = ({ onOpenApp }) => {
  return (
    <div className="resources-page">
      <section className="resources-hero">
        <div>
          <p className="section-kicker">Recursos</p>
          <h1>Uma caixa de ferramentas desenhada para acompanhar o preparo ministerial</h1>
          <p>
            O foco do Scriptura é reunir fluxos que normalmente ficam
            espalhados entre cadernos, buscas, notas, documentos e improviso.
          </p>
        </div>
        <div className="resources-hero-note">
          <span>Leitura rápida</span>
          <strong>Entre pela necessidade do ministério e deixe o produto sugerir o próximo passo.</strong>
          <p>
            Em vez de uma lista de prompts, você encontra percursos para
            estruturar, aprofundar, planejar e comunicar.
          </p>
        </div>
      </section>

      <section className="resources-stack">
        {STACK.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="resources-grid">
        {RESOURCE_CARDS.map((card) => (
          <article key={card.title} className="resources-card">
            <span className="resources-card-eyebrow">{card.eyebrow}</span>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </section>

      <section className="resources-cta">
        <div>
          <p className="section-kicker">Próximo passo</p>
          <h2>Abra o workspace e use o fluxo que melhor combina com sua rotina de preparo</h2>
          <p>
            Se você já sabe o que precisa, entre direto na ferramenta. Se não,
            o app ajuda a escolher um ponto de partida.
          </p>
        </div>
        <button type="button" className="landing-btn primary" onClick={onOpenApp}>
          Ir para o workspace
        </button>
      </section>
    </div>
  );
};
