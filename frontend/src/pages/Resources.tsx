import React from "react";
import "./Resources.css";

interface ResourcesProps {
  onOpenApp: () => void;
}

const RESOURCE_CARDS = [
  {
    title: "Esboco de pregacao",
    text: "Monte rapidamente uma base com titulo, texto-chave, desenvolvimento e conclusao.",
  },
  {
    title: "Analise teologica",
    text: "Explore contexto historico, fundamento biblico e implicacoes doutrinarias.",
  },
  {
    title: "Explicacao de passagem",
    text: "Receba uma leitura mais acessivel para ensino, devocional e pregacao.",
  },
  {
    title: "Versiculos por tema",
    text: "Levante referencias relacionadas ao assunto da mensagem para ampliar a pesquisa.",
  },
  {
    title: "Concordancia",
    text: "Procure palavras e conceitos que ajudam a costurar um estudo mais amplo.",
  },
  {
    title: "Cronograma e carta pastoral",
    text: "Organize series, meses de ministracao e comunicacoes pastorais com mais consistencia.",
  },
];

export const Resources: React.FC<ResourcesProps> = ({ onOpenApp }) => {
  return (
    <div className="resources-page">
      <section className="resources-hero">
        <p className="section-kicker">Recursos</p>
        <h1>Uma caixa de ferramentas para preparar, aprofundar e organizar</h1>
        <p>
          O foco do Pregador IA e reunir fluxos que normalmente ficam espalhados
          entre papel, anotações, buscas e documentos soltos.
        </p>
      </section>

      <section className="resources-grid">
        {RESOURCE_CARDS.map((card) => (
          <article key={card.title} className="resources-card">
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </section>

      <section className="resources-cta">
        <div>
          <p className="section-kicker">Proximo passo</p>
          <h2>Abra o app e experimente o fluxo que faz mais sentido para sua rotina</h2>
        </div>
        <button type="button" className="landing-btn primary" onClick={onOpenApp}>
          Ir para o app
        </button>
      </section>
    </div>
  );
};
