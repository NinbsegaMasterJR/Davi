import React, { useState } from "react";
import "./About.css";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const About: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      pergunta: "Como funciona o Pregador IA?",
      resposta:
        "O Pregador IA usa inteligência artificial (Claude) para gerar esboços de pregações, análises teológicas e sugerir versículos. Você fornece um tema, e a IA estrutura uma pregação completa em segundos.",
    },
    {
      pergunta: "É realmente grátis?",
      resposta:
        "Sim! O uso é completamente grátis. Você só precisa accesar o site. Sem cadastro, sem cobrança, sem limite de uso.",
    },
    {
      pergunta: "Posso usar com celular?",
      resposta:
        "Sim! O site funciona em qualquer navegador: computador, tablet ou celular. É totalmente responsivo.",
    },
    {
      pergunta: "Como posso salvar meus esboços?",
      resposta:
        "Você pode copiar o resultado e colar em Word, Google Docs, ou qualquer editor de texto. Futuramente teremos opção de salvar na nuvem.",
    },
    {
      pergunta: "Qual versão da Bíblia é usada?",
      resposta:
        "Usamos principalmente a ARA (Almeida Revista e Atualizada). Os versículos são do acervo mais confiável.",
    },
    {
      pergunta: "A IA sempre dá respostas diferentes?",
      resposta:
        "Sim! Cada pergunta gera uma resposta única. Se quiser opções diferentes, pode gerar novamente com o mesmo tema.",
    },
    {
      pergunta: "Precisa de internet?",
      resposta:
        "Sim, você precisa de conexão com a internet para usar, pois a IA processa na nuvem.",
    },
    {
      pergunta: "Posso compartilhar os esboços?",
      resposta:
        "Sim! Os esboços são seus. Você pode compartilhar, adaptar e usar como quiser. Recomendamos creditar o Pregador IA.",
    },
  ];

  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>⛪ Pregador IA</h1>
        <p>
          Seu assistente de inteligência artificial para preparação de pregações
        </p>
      </div>

      <div className="about-container">
        {/* Seção: O que é */}
        <section className="about-section">
          <h2>O que é Pregador IA?</h2>
          <p>
            Pregador IA é um assistente inteligente desenvolvido para ajudar
            pregadores, pastores, líderes de célula e qualquer pessoa que
            precise preparar pregações teologicamente sólidas e inspiradoras.
          </p>
          <p>
            Usando inteligência artificial avançada (Claude), geramos esboços
            estruturados, análises teológicas profundas e sugestões de
            versículos em segundos.
          </p>
        </section>

        {/* Seção: Como começar */}
        <section className="about-section">
          <h2>Como Começar?</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Escolha uma aba</h3>
              <p>Esboço, Versículos ou Análise</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Digite o tema</h3>
              <p>Exemplo: "Fé", "Graça", "Esperança"</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Customize as opções</h3>
              <p>Estilo, duração, profundidade</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Clique gerar</h3>
              <p>Aguarde 30-60 segundos</p>
            </div>
            <div className="step">
              <div className="step-number">5</div>
              <h3>Copie e customize</h3>
              <p>Adicione seu toque pessoal</p>
            </div>
          </div>
        </section>

        {/* Seção: Recursos */}
        <section className="about-section">
          <h2>Nossos Recursos</h2>
          <div className="features">
            <div className="feature">
              <h3>📝 Gerar Esboço</h3>
              <p>
                Esboços estruturados com título, versículo base, introdução,
                desenvolvimento e conclusão.
              </p>
            </div>
            <div className="feature">
              <h3>📖 Sugerir Versículos</h3>
              <p>
                Encontre versículos bíblicos que se encaixam perfeitamente no
                seu tema.
              </p>
            </div>
            <div className="feature">
              <h3>🔍 Análise Teológica</h3>
              <p>
                Análises profundas de temas teológicos com contexto histórico e
                aplicação prática.
              </p>
            </div>
            <div className="feature">
              <h3>⚡ Rápido e Fácil</h3>
              <p>Resultados em segundos. Sem cadastro necessário.</p>
            </div>
            <div className="feature">
              <h3>💰 Completamente Grátis</h3>
              <p>Sem limitações, sem cobrança, sem adesão obrigatória.</p>
            </div>
            <div className="feature">
              <h3>📱 Funciona em Todos os Dispositivos</h3>
              <p>Computador, tablet, celular. Offline não funciona.</p>
            </div>
          </div>
        </section>

        {/* Seção: FAQ */}
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
                    ▼
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="faq-answer">{faq.resposta}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Seção: Tecnologia */}
        <section className="about-section">
          <h2>Tecnologia</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <h4>🤖 AI Claude</h4>
              <p>Powered by Anthropic - IA mais avançada do mercado</p>
            </div>
            <div className="tech-item">
              <h4>⚛️ React</h4>
              <p>Interface moderna e responsiva</p>
            </div>
            <div className="tech-item">
              <h4>🟨 Express</h4>
              <p>API rápida e confiável</p>
            </div>
            <div className="tech-item">
              <h4>☁️ Cloud</h4>
              <p>Hospedado em Vercel + Render (grátis)</p>
            </div>
          </div>
        </section>

        {/* Seção: Contato */}
        <section className="about-section about-contact">
          <h2>Quer Entrar em Contato?</h2>
          <p>Sugestões, feedback ou dúvidas? Adoramos ouvir de você!</p>
          <div className="contact-links">
            <a href="mailto:seu-email@example.com" className="contact-btn">
              📧 Email
            </a>
            <a
              href="https://github.com/seu-usuario/Gerador.P-Web"
              className="contact-btn"
            >
              🐙 GitHub
            </a>
            <a href="https://wa.me/seu-numero" className="contact-btn">
              💬 WhatsApp
            </a>
          </div>
        </section>

        {/* Seção: Chamada para ação */}
        <section className="about-cta">
          <h2>Pronto para começar?</h2>
          <p>Prepare sua próxima pregação em minutos, não horas.</p>
          <a href="/" className="cta-button">
            ← Voltar para o Pregador IA
          </a>
        </section>
      </div>

      <footer className="about-footer">
        <p>© 2026 Pregador IA - Assistente Inteligente para Pregações</p>
        <p>Desenvolvido com ❤️ para pregadores e pastores</p>
      </footer>
    </div>
  );
};
