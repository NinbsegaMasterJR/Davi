import React from "react";
import "./Contact.css";

interface ContactProps {
  githubUrl: string;
}

export const Contact: React.FC<ContactProps> = ({ githubUrl }) => {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <p className="section-kicker">Contato e roadmap</p>
        <h1>O repositorio e hoje o melhor lugar para acompanhar a evolucao do projeto</h1>
        <p>
          Se voce quer sugerir uma melhoria, relatar um problema ou acompanhar
          proximos passos como autenticacao e integracoes externas, o GitHub e o
          canal principal.
        </p>
      </section>

      <section className="contact-grid">
        <article className="contact-card">
          <h2>Reportar melhoria</h2>
          <p>Abra uma issue com contexto, impacto e, se puder, prints ou exemplos.</p>
          <a href={`${githubUrl}/issues`} target="_blank" rel="noreferrer">
            Abrir issues
          </a>
        </article>
        <article className="contact-card">
          <h2>Acompanhar codigo</h2>
          <p>Veja releases, commits e documentacao diretamente no repositorio.</p>
          <a href={githubUrl} target="_blank" rel="noreferrer">
            Abrir GitHub
          </a>
        </article>
        <article className="contact-card">
          <h2>Infra futura</h2>
          <p>
            Autenticacao em nuvem, sincronizacao e analytics reais dependem de
            banco, provedor de identidade e deploy com observabilidade.
          </p>
        </article>
      </section>
    </div>
  );
};
