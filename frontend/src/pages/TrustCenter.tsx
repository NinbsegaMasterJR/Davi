import React from "react";
import "./TrustCenter.css";

const TRUST_ITEMS = [
  {
    title: "Transparencia",
    text: "Sugestoes de versiculos e concordancia podem usar IA como apoio de descoberta. Sempre recomendamos revisao pastoral e biblica.",
  },
  {
    title: "Responsabilidade",
    text: "O app ajuda a organizar e acelerar o preparo, mas nao substitui leitura do texto, oracao, criterio ministerial nem estudo serio.",
  },
  {
    title: "Privacidade local",
    text: "A biblioteca do navegador fica salva localmente no dispositivo. Sem conta, nao existe sincronizacao automatica entre aparelhos.",
  },
];

export const TrustCenter: React.FC = () => {
  return (
    <div className="trust-center-page">
      <section className="trust-center-hero">
        <p className="section-kicker">Confianca</p>
        <h1>Como o Pregador IA trata limites, uso responsavel e privacidade</h1>
        <p>
          Esta pagina existe para deixar claro o papel da IA no produto e o que
          ainda precisa de revisao humana antes de ensino, publicacao ou pregacao.
        </p>
      </section>

      <section className="trust-center-grid">
        {TRUST_ITEMS.map((item) => (
          <article key={item.title} className="trust-center-card">
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
};
