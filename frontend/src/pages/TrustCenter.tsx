import React from "react";
import "./TrustCenter.css";

const TRUST_ITEMS = [
  {
    title: "Transparência de uso",
    text: "Sugestões de versículos, concordância e rascunhos usam IA como apoio de descoberta e preparação, nunca como substituta de revisão bíblica.",
  },
  {
    title: "Responsabilidade pastoral",
    text: "O app ajuda a organizar e acelerar o preparo, mas não substitui leitura do texto, oração, critério ministerial nem estudo sério.",
  },
  {
    title: "Privacidade local",
    text: "A biblioteca fica salva localmente no navegador. Sem conta, não existe sincronização automática entre aparelhos.",
  },
];

const PRACTICES = [
  "Confira referências e citações em sua fonte bíblica de confiança.",
  "Ajuste o tom do texto ao contexto real da igreja local.",
  "Use as respostas como base de trabalho, não como versão final automática.",
];

export const TrustCenter: React.FC = () => {
  return (
    <div className="trust-center-page">
      <section className="trust-center-hero">
        <div>
          <p className="section-kicker">Confiança</p>
          <h1>Como o Scriptura trata limites, responsabilidade e privacidade</h1>
          <p>
            Esta página existe para deixar claro o papel da IA no produto e o
            que continua exigindo revisão humana antes de ensino, publicação ou
            pregação.
          </p>
        </div>
        <div className="trust-center-note">
          <span>Posicionamento</span>
          <strong>IA como apoio de preparo. Critério pastoral como decisão final.</strong>
          <p>
            O produto foi desenhado para acelerar organização e pesquisa sem
            esconder seus limites nem romantizar automação.
          </p>
        </div>
      </section>

      <section className="trust-center-grid">
        {TRUST_ITEMS.map((item) => (
          <article key={item.title} className="trust-center-card">
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="trust-center-practices">
        <div>
          <p className="section-kicker">Boas práticas</p>
          <h2>Como usar o app com mais segurança ministerial</h2>
        </div>
        <div className="trust-center-practice-list">
          {PRACTICES.map((item, index) => (
            <article key={item} className="trust-center-practice">
              <span>0{index + 1}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
