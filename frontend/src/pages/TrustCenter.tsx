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

const DATA_POINTS = [
  {
    title: "Biblioteca local",
    text: "Resultados e rascunhos ficam no armazenamento do navegador, a menos que você use a sincronização de workspace.",
  },
  {
    title: "Pedidos enviados à API",
    text: "Temas, passagens e instruções digitadas são enviados ao backend para gerar respostas e devem evitar dados sensíveis.",
  },
  {
    title: "Sem decisão automática",
    text: "O app não define doutrina, aconselhamento ou orientação pastoral final. Ele organiza material para revisão humana.",
  },
];

const REVIEW_CHECKLIST = [
  "Li o texto bíblico inteiro, não apenas o versículo citado.",
  "Conferi referências, nomes, datas e afirmações teológicas.",
  "Adaptei exemplos, tom e aplicações à igreja local.",
  "Removi qualquer dado pessoal ou situação sensível antes de compartilhar.",
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

      <section className="trust-center-practices">
        <div>
          <p className="section-kicker">Privacidade prática</p>
          <h2>O que acontece com o material de trabalho</h2>
        </div>
        <div className="trust-center-practice-list">
          {DATA_POINTS.map((item, index) => (
            <article key={item.title} className="trust-center-practice">
              <span>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-center-practices trust-center-checklist">
        <div>
          <p className="section-kicker">Antes de usar em público</p>
          <h2>Checklist rápido de revisão</h2>
        </div>
        <ul>
          {REVIEW_CHECKLIST.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};
