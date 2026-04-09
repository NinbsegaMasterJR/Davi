import React from "react";
import "./Contact.css";

interface ContactProps {
  githubUrl: string;
}

const ROADMAP = [
  "Autenticação e sincronização entre dispositivos",
  "Persistência em nuvem para biblioteca e histórico",
  "Observabilidade de uso e erros em produção",
];

export const Contact: React.FC<ContactProps> = ({ githubUrl }) => {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div>
          <p className="section-kicker">Contato e roadmap</p>
          <h1>O repositório é hoje o melhor lugar para acompanhar e influenciar a evolução do projeto</h1>
          <p>
            Se você quer sugerir melhoria, relatar problema ou acompanhar os
            próximos passos do produto, o GitHub continua sendo o canal
            principal.
          </p>
        </div>
        <div className="contact-note">
          <span>Canal principal</span>
          <strong>Issues e histórico do repositório concentram feedback, correções e evolução.</strong>
          <p>
            Isso facilita contexto, rastreabilidade e priorização para as
            próximas iterações do produto.
          </p>
        </div>
      </section>

      <section className="contact-grid">
        <article className="contact-card">
          <h2>Reportar melhoria</h2>
          <p>Abra uma issue com contexto, impacto, prints ou exemplos do que pode evoluir.</p>
          <a href={`${githubUrl}/issues`} target="_blank" rel="noreferrer">
            Abrir issues
          </a>
        </article>
        <article className="contact-card">
          <h2>Acompanhar codigo</h2>
          <p>Veja releases, commits, documentação e histórico de deploy no repositório.</p>
          <a href={githubUrl} target="_blank" rel="noreferrer">
            Abrir GitHub
          </a>
        </article>
        <article className="contact-card">
          <h2>Prioridades de infra</h2>
          <p>
            Autenticação em nuvem, sincronização e analytics reais dependem de
            banco, provedor de identidade e observabilidade.
          </p>
        </article>
      </section>

      <section className="contact-roadmap">
        <div>
          <p className="section-kicker">O que vem depois</p>
          <h2>Direções naturais para a próxima camada do produto</h2>
        </div>
        <div className="contact-roadmap-list">
          {ROADMAP.map((item, index) => (
            <article key={item} className="contact-roadmap-item">
              <span>0{index + 1}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
