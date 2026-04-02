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
        "Voce pode copiar o resultado e colar em Word, Google Docs ou qualquer editor de texto. O foco atual e geracao rapida e reaproveitamento manual.",
    },
    {
      pergunta: "Qual versao da Biblia e usada?",
      resposta:
        "Voce pode escolher entre ARA, ARC, ARCF e King James nas ferramentas que usam referencias e textos biblicos.",
    },
    {
      pergunta: "A IA sempre da respostas diferentes?",
      resposta:
        "Sim. Cada pergunta gera uma resposta unica. Se quiser opcoes diferentes, pode gerar novamente com o mesmo tema.",
    },
    {
      pergunta: "Precisa de internet?",
      resposta:
        "Sim, voce precisa de conexao com a internet para usar, pois a IA processa na nuvem.",
    },
    {
      pergunta: "Posso compartilhar os esbocos?",
      resposta:
        "Sim. Os esbocos sao seus. Voce pode compartilhar, adaptar e usar como quiser. Recomendamos creditar o Pregador IA.",
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
          <h2>O que e Pregador IA?</h2>
          <p>
            Pregador IA e uma ferramenta de apoio ministerial criada para ajudar
            pregadores, pastores, lideres e servos que desejam preparar
            mensagens com base biblica, organizacao e aplicacao pratica.
          </p>
          <p>
            Com ajuda de inteligencia artificial, a plataforma acelera o
            preparo sem substituir a sensibilidade espiritual, entregando
            esbocos, analises, explicacoes e referencias que servem como base
            para desenvolver uma mensagem mais consistente.
          </p>
        </section>

        <section className="about-section">
          <h2>Como Comecar?</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Escolha uma aba</h3>
              <p>
                Selecione a ferramenta ideal para montar, aprofundar ou
                organizar sua mensagem.
              </p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Digite o tema</h3>
              <p>
                Informe um tema, uma passagem ou um foco ministerial. Exemplo:
                "Fe", "Graca" ou "Esperanca".
              </p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Customize as opcoes</h3>
              <p>
                Ajuste estilo, duracao, profundidade e secoes opcionais
                conforme a necessidade.
              </p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Clique em gerar</h3>
              <p>
                Receba uma base organizada em poucos segundos, pronta para
                leitura e adaptacao.
              </p>
            </div>
            <div className="step">
              <div className="step-number">5</div>
              <h3>Copie e adapte</h3>
              <p>
                Revise, ore, acrescente sua voz pastoral e transforme o
                material em mensagem viva.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Nossos Recursos</h2>
          <div className="features">
            <div className="feature">
              <h3>Gerar Esboco</h3>
              <p>
                Monte uma estrutura clara de mensagem com titulo, texto base,
                desenvolvimento e encerramento.
              </p>
            </div>
            <div className="feature">
              <h3>Sugerir Versiculos</h3>
              <p>
                Descubra referencias biblicas alinhadas ao tema central da
                pregacao ou estudo.
              </p>
            </div>
            <div className="feature">
              <h3>Analise Teologica</h3>
              <p>
                Aprofunde conceitos biblicos com leitura teologica, contexto e
                implicacoes para a igreja.
              </p>
            </div>
            <div className="feature">
              <h3>Explicar Passagem</h3>
              <p>
                Receba uma explicacao clara de passagens biblicas com sentido
                do texto e direcionamento ministerial.
              </p>
            </div>
            <div className="feature">
              <h3>Concordancia Biblica</h3>
              <p>
                Busque textos relacionados a palavras, temas e conceitos para
                fortalecer o estudo e a pregacao.
              </p>
            </div>
            <div className="feature">
              <h3>Cronograma de Pregacoes</h3>
              <p>
                Planeje series e agendas mensais com temas, titulos e textos
                base para cada oportunidade.
              </p>
            </div>
            <div className="feature">
              <h3>Carta Pastoral GCEU</h3>
              <p>
                Gere cartas pastorais com tom ministerial, objetivo definido e
                referencias biblicas para comunicacoes da igreja.
              </p>
            </div>
            <div className="feature">
              <h3>Fluxo Rapido</h3>
              <p>
                Respostas em segundos para ganhar tempo no preparo sem perder
                organizacao.
              </p>
            </div>
            <div className="feature">
              <h3>Uso Simples</h3>
              <p>
                Sem cadastro obrigatorio e com acesso direto para comecar a
                trabalhar imediatamente.
              </p>
            </div>
            <div className="feature">
              <h3>Acesso em Qualquer Tela</h3>
              <p>
                Disponivel no computador, no tablet e no celular com interface
                adaptada para cada contexto.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Perguntas Frequentes</h2>
          <div className="faq">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className="faq-question"
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

        <section className="about-section">
          <h2>Tecnologia</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <h4>Groq + LLM</h4>
              <p>
                Geracao veloz de conteudo para acelerar o preparo e a
                exploracao de ideias
              </p>
            </div>
            <div className="tech-item">
              <h4>React</h4>
              <p>
                Interface moderna, fluida e responsiva para uso no escritorio
                ou no campo
              </p>
            </div>
            <div className="tech-item">
              <h4>Express</h4>
              <p>
                Camada de API estavel para entregar respostas com rapidez e
                confianca
              </p>
            </div>
            <div className="tech-item">
              <h4>Cloud</h4>
              <p>
                Estrutura preparada para ambientes modernos de hospedagem e
                evolucao continua
              </p>
            </div>
          </div>
        </section>

        <section className="about-section about-contact">
          <h2>Quer Entrar em Contato?</h2>
          <p>
            O repositorio no GitHub e hoje o canal principal para acompanhar a
            evolucao do projeto, sugerir melhorias e relatar pontos que ainda
            podemos fortalecer.
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

        <section className="about-cta">
          <h2>Pronto para comecar?</h2>
          <p>
            Transforme um tema, uma passagem ou uma ideia em uma base de
            mensagem mais clara e mais pronta para servir.
          </p>
          <button type="button" className="cta-button" onClick={onBackHome}>
            Voltar para o Pregador IA
          </button>
        </section>
      </div>

      <footer className="about-footer">
        <p>© 2026 Pregador IA - Preparacao inteligente para mensagens biblicas</p>
        <p>
          Desenvolvido para apoiar pregadores, pastores e lideres em seu
          preparo
        </p>
      </footer>
    </div>
  );
};
