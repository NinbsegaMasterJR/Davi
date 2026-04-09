import React, { useState } from "react";
import { BrandLogo } from "../components/BrandLogo";
import "./About.css";

interface AboutProps {
  onBackHome: () => void;
  githubUrl: string;
}

export const About: React.FC<AboutProps> = ({ onBackHome, githubUrl }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      pergunta: "Como funciona o Pregador IA?",
      resposta:
        "O Pregador IA usa inteligencia artificial para gerar esbocos de pregacoes, analises teologicas e sugestoes de versiculos. Voce informa um tema ou passagem, e a plataforma devolve uma base estruturada em segundos.",
    },
    {
      pergunta: "E realmente gratis?",
      resposta:
        "Sim. A proposta atual do projeto e oferecer uso simples e direto, sem cadastro obrigatorio e sem barreiras para comecar.",
    },
    {
      pergunta: "Posso usar com celular?",
      resposta:
        "Sim. O site funciona em qualquer navegador: computador, tablet ou celular. E totalmente responsivo.",
    },
    {
      pergunta: "Como posso salvar meus esbocos?",
      resposta:
        "Voce pode salvar na biblioteca local do navegador, copiar o resultado ou exportar em mais de um formato.",
    },
    {
      pergunta: "A IA substitui estudo biblico?",
      resposta:
        "Nao. O produto foi desenhado para apoiar o preparo, acelerar organizacao e sugerir caminhos, mas a revisao pastoral continua indispensavel.",
    },
  ];

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-brand">
          <div className="about-logo-shell">
            <BrandLogo className="about-logo" />
          </div>
          <div>
            <span className="about-kicker">Ministerio, estudo e preparo</span>
            <h1>Pregador IA</h1>
          </div>
        </div>
        <p>
          Uma plataforma pensada para apoiar pregadores, pastores e lideres na
          construcao de mensagens biblicas com mais clareza, profundidade e
          direcao.
        </p>
      </div>

      <div className="about-container">
        <section className="about-section">
          <h2>O que e o projeto</h2>
          <p>
            Pregador IA e uma ferramenta de apoio ministerial criada para ajudar
            pregadores, pastores, lideres e servos que desejam preparar
            mensagens com base biblica, organizacao e aplicacao pratica.
          </p>
          <p>
            Com ajuda de inteligencia artificial, a plataforma acelera o preparo
            sem substituir a sensibilidade espiritual, entregando esbocos,
            analises, explicacoes e referencias que servem como base para
            desenvolver uma mensagem mais consistente.
          </p>
        </section>

        <section className="about-section">
          <h2>Como comecar</h2>
          <div className="steps">
            {[
              "Escolha a ferramenta",
              "Informe tema, passagem ou foco ministerial",
              "Ajuste estilo, profundidade e opcoes",
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
          <h2>Perguntas frequentes</h2>
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
          <h2>Acompanhar evolucao</h2>
          <p>
            O repositorio no GitHub e hoje o canal principal para acompanhar o
            roadmap, sugerir melhorias e relatar pontos que ainda podemos
            fortalecer.
          </p>
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
              Voltar ao app
            </button>
          </div>
        </section>
      </div>

      <footer className="about-footer">
        <p>2026 Pregador IA - Preparacao inteligente para mensagens biblicas</p>
        <p>Desenvolvido para apoiar pregadores, pastores e lideres em seu preparo</p>
      </footer>
    </div>
  );
};
