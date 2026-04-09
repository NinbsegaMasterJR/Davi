import React, { useState } from "react";
import { BrandLogo } from "../components/BrandLogo";
import "./About.css";

interface AboutProps {
  onBackHome: () => void;
  githubUrl: string;
}

const VALUE_CARDS = [
  {
    title: "Clareza de preparo",
    text: "O produto ajuda a sair da página em branco com fluxo, contexto e base para revisar.",
  },
  {
    title: "Profundidade ajustável",
    text: "Cada ferramenta tenta equilibrar agilidade com leitura bíblica e densidade pastoral.",
  },
  {
    title: "Responsabilidade real",
    text: "A proposta não é automatizar o púlpito, e sim organizar melhor o trabalho ministerial.",
  },
];

export const About: React.FC<AboutProps> = ({ onBackHome, githubUrl }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      pergunta: "Como funciona o Scriptura?",
      resposta:
        "Você informa um tema, passagem ou necessidade ministerial, e a plataforma devolve uma base estruturada para revisar, adaptar e aprofundar.",
    },
    {
      pergunta: "É realmente grátis?",
      resposta:
        "Sim. Hoje a proposta é oferecer uso direto, sem cadastro obrigatório e sem barreiras para começar.",
    },
    {
      pergunta: "Posso usar com celular?",
      resposta:
        "Sim. O site foi pensado para funcionar em computador, tablet e celular, com layout responsivo.",
    },
    {
      pergunta: "Como salvo o que gerei?",
      resposta:
        "Os resultados podem ser guardados na biblioteca local do navegador, copiados ou exportados em vários formatos.",
    },
    {
      pergunta: "A IA substitui estudo bíblico?",
      resposta:
        "Não. O produto apoia organização, pesquisa e estrutura, mas a revisão pastoral continua indispensável.",
    },
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-brand">
          <div className="about-logo-shell">
            <BrandLogo className="about-logo" />
          </div>
          <div>
            <span className="about-kicker">Ministério, estudo e preparo</span>
            <h1>Scriptura</h1>
          </div>
        </div>
        <p>
          Uma plataforma criada para apoiar pregadores, pastores e líderes na
          construção de mensagens bíblicas com mais clareza, profundidade e
          direção de trabalho.
        </p>
      </section>

      <div className="about-container">
        <section className="about-section about-intro">
          <div>
            <p className="section-kicker">O que é o projeto</p>
            <h2>Um workspace ministerial para transformar intuição em material revisável</h2>
            <p>
              O Scriptura nasceu para ajudar no preparo de mensagens,
              estudos, séries e comunicações pastorais sem substituir
              sensibilidade espiritual, leitura bíblica nem critério pastoral.
            </p>
          </div>
          <div className="about-value-grid">
            {VALUE_CARDS.map((card) => (
              <article key={card.title} className="about-value-card">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section">
          <p className="section-kicker">Como começar</p>
          <h2>Do foco ministerial ao resultado em cinco passos</h2>
          <div className="steps">
            {[
              "Escolha a ferramenta",
              "Informe tema, passagem ou foco ministerial",
              "Ajuste estilo, profundidade e opções",
              "Gere o resultado",
              "Revise, ore e adapte a sua realidade",
            ].map((step, index) => (
              <div key={step} className="step">
                <div className="step-number">{index + 1}</div>
                <h3>{step}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <p className="section-kicker">Perguntas frequentes</p>
          <h2>Dúvidas comuns antes de entrar no workspace</h2>
          <div className="faq">
            {faqs.map((faq, index) => (
              <div key={faq.pergunta} className="faq-item">
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={expandedFaq === index}
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                >
                  <span>{faq.pergunta}</span>
                  <span
                    className={`arrow ${expandedFaq === index ? "open" : ""}`}
                  >
                    v
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="faq-answer">{faq.resposta}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="about-section about-contact">
          <div>
            <p className="section-kicker">Acompanhar evolução</p>
            <h2>GitHub continua sendo o centro do roadmap e do feedback</h2>
            <p>
              O repositório é hoje o melhor lugar para acompanhar o produto,
              sugerir melhorias e relatar pontos que ainda podemos fortalecer.
            </p>
          </div>
          <div className="contact-links">
            <a
              href={githubUrl}
              className="contact-btn"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              href={`${githubUrl}/issues`}
              className="contact-btn secondary"
              target="_blank"
              rel="noreferrer"
            >
              Reportar melhoria
            </a>
            <button
              type="button"
              className="contact-btn secondary"
              onClick={onBackHome}
            >
              Voltar ao workspace
            </button>
          </div>
        </section>
      </div>

      <footer className="about-footer">
        <p>2026 Scriptura - Preparação inteligente para mensagens bíblicas</p>
        <p>Desenvolvido para apoiar pregadores, pastores e líderes em seu preparo</p>
      </footer>
    </div>
  );
};
