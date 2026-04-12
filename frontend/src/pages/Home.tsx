import React, { Suspense, lazy, useEffect, useMemo } from "react";
import { BrandLogo } from "../components/BrandLogo";
import { LibraryPanel } from "../components/LibraryPanel";
import { WorkspaceSyncPanel } from "../components/WorkspaceSyncPanel";
import { useApp } from "../context/AppContext";
import "./Home.css";

const SermonOutline = lazy(() =>
  import("../components/SermonOutline").then((module) => ({
    default: module.SermonOutline,
  })),
);
const VersesSuggestion = lazy(() =>
  import("../components/VersesSuggestion").then((module) => ({
    default: module.VersesSuggestion,
  })),
);
const TheologicalAnalysis = lazy(() =>
  import("../components/TheologicalAnalysis").then((module) => ({
    default: module.TheologicalAnalysis,
  })),
);
const ExplicarPassagem = lazy(() =>
  import("../components/ExplicarPassagem").then((module) => ({
    default: module.ExplicarPassagem,
  })),
);
const Concordancia = lazy(() =>
  import("../components/Concordancia").then((module) => ({
    default: module.Concordancia,
  })),
);
const CronogramaPregacoes = lazy(() =>
  import("../components/CronogramaPregacoes").then((module) => ({
    default: module.CronogramaPregacoes,
  })),
);
const PastoralLetter = lazy(() =>
  import("../components/PastoralLetter").then((module) => ({
    default: module.PastoralLetter,
  })),
);

export type ActiveTab =
  | "outline"
  | "verses"
  | "analysis"
  | "explain"
  | "concordance"
  | "schedule"
  | "pastoral-letter";

interface HomeProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  focusToolOnOpen?: boolean;
  onToolFocused?: () => void;
}

const TOOL_CARDS: Array<{
  id: ActiveTab;
  title: string;
  eyebrow: string;
  description: string;
  outcome: string;
}> = [
  {
    id: "outline",
    title: "Montar esboço",
    eyebrow: "Púlpito",
    description:
      "Abra a mensagem com tema, texto, objetivos, tese, exegese por tópico e aplicação prática.",
    outcome: "Entrega um esboço pronto para revisar e adaptar.",
  },
  {
    id: "analysis",
    title: "Aprofundar tema",
    eyebrow: "Doutrina",
    description:
      "Contexto, implicações e leitura teológica para ensino, estudo em grupo e preparo de série.",
    outcome: "Entrega uma análise mais robusta e argumentada.",
  },
  {
    id: "verses",
    title: "Mapear referências",
    eyebrow: "Apoio bíblico",
    description:
      "Encontre passagens relacionadas ao assunto para sustentar a mensagem e abrir novas linhas de estudo.",
    outcome: "Entrega uma lista de referências para apoio e comparação.",
  },
  {
    id: "explain",
    title: "Explicar passagem",
    eyebrow: "Texto base",
    description:
      "Traga contexto, significado e aplicação para uma passagem específica antes de ensinar ou pregar.",
    outcome: "Entrega uma leitura comentada com aplicação prática.",
  },
  {
    id: "concordance",
    title: "Pesquisar termos",
    eyebrow: "Pesquisa",
    description:
      "Busque ocorrências e versículos ligados a uma palavra, ideia ou eixo temático do sermão.",
    outcome: "Entrega um painel de ocorrências e referências relacionadas.",
  },
  {
    id: "schedule",
    title: "Planejar série",
    eyebrow: "Calendário",
    description:
      "Monte um cronograma mensal de ministrações com continuidade, ritmo e variedade pastoral.",
    outcome: "Entrega uma agenda de mensagens organizada por período.",
  },
  {
    id: "pastoral-letter",
    title: "Escrever carta GCEU",
    eyebrow: "Comunicação",
    description:
      "Transforme um tema e um objetivo pastoral em uma carta madura, clara e pronta para adaptar.",
    outcome: "Entrega uma carta pastoral estruturada para leitura ou envio.",
  },
];

const FLOW_STEPS: Array<{
  title: string;
  text: string;
  actionLabel: string;
  actionTab: ActiveTab;
}> = [
  {
    title: "Escolha o ponto de partida",
    text: "Comece pelo formato que destrava sua preparação: esboço, análise, passagem ou pesquisa temática.",
    actionLabel: "Abrir esboço",
    actionTab: "outline",
  },
  {
    title: "Aprofunde e refine",
    text: "Use referências, concordância e análise teológica para ampliar o estudo sem perder o foco pastoral.",
    actionLabel: "Abrir análise",
    actionTab: "analysis",
  },
  {
    title: "Revise, salve e reaproveite",
    text: "Confronte o texto bíblico, ajuste o tom ministerial e guarde o material na biblioteca local.",
    actionLabel: "Ver biblioteca",
    actionTab: "pastoral-letter",
  },
];

const ACTIVE_TAB_COPY: Record<
  ActiveTab,
  {
    title: string;
    eyebrow: string;
    description: string;
    useCase: string;
    outcome: string;
  }
> = {
  outline: {
    title: "Esboço orientado para pregação",
    eyebrow: "Mais usado",
    description:
      "Ideal quando você já tem o tema e precisa sair da página em branco com fluxo, peso bíblico e aplicação.",
    useCase: "Mensagem principal, estudo de culto e ensino temático",
    outcome: "Estrutura completa em markdown pronta para lapidar",
  },
  verses: {
    title: "Referências para sustentar o argumento",
    eyebrow: "Apoio bíblico",
    description:
      "Bom para quando o tema está claro, mas você ainda quer ampliar a base bíblica e comparar passagens.",
    useCase: "Introduções, desenvolvimento e versículos de apoio",
    outcome: "Lista objetiva de textos relacionados ao tema",
  },
  analysis: {
    title: "Leitura teológica mais profunda",
    eyebrow: "Doutrina",
    description:
      "Funciona melhor quando a demanda pede doutrina, contexto e mais densidade de interpretação.",
    useCase: "Escola bíblica, série doutrinária e aprofundamento ministerial",
    outcome: "Análise estruturada com contexto, interpretação e aplicação",
  },
  explain: {
    title: "Passagem explicada com aplicação",
    eyebrow: "Texto base",
    description:
      "Escolha esta ferramenta quando o texto já está definido e você quer clareza expositiva antes da ministração.",
    useCase: "Pregação expositiva, devocional guiado e estudo de passagem",
    outcome: "Explicação comentada com pontos de leitura e aplicação",
  },
  concordance: {
    title: "Pesquisa por palavra e conceito",
    eyebrow: "Pesquisa",
    description:
      "Ajuda quando você está seguindo uma palavra-chave e precisa enxergar seu campo de referências.",
    useCase: "Séries temáticas, estudos por conceito e apoio lexical inicial",
    outcome: "Painel pesquisável de referências ligadas a um termo",
  },
  schedule: {
    title: "Calendário de mensagens com ritmo",
    eyebrow: "Planejamento",
    description:
      "Ideal para organizar o ministério do mês, evitar repetição e visualizar a jornada de ensino.",
    useCase: "Série mensal, escala pastoral e alinhamento de ministérios",
    outcome: "Cronograma pronto para adaptar ao calendário da igreja",
  },
  "pastoral-letter": {
    title: "Carta pastoral com tom definido",
    eyebrow: "Comunicação",
    description:
      "Use quando a igreja precisa de direção escrita, alinhamento ou encorajamento com linguagem pastoral.",
    useCase: "Comunicados, orientações, mobilização e cuidado congregacional",
    outcome: "Carta completa com saudação, desenvolvimento e fechamento",
  },
};

function isActiveTabId(value: string): value is ActiveTab {
  return value in ACTIVE_TAB_COPY;
}

function renderTool(activeTab: ActiveTab) {
  switch (activeTab) {
    case "outline":
      return <SermonOutline />;
    case "verses":
      return <VersesSuggestion />;
    case "analysis":
      return <TheologicalAnalysis />;
    case "explain":
      return <ExplicarPassagem />;
    case "concordance":
      return <Concordancia />;
    case "schedule":
      return <CronogramaPregacoes />;
    case "pastoral-letter":
      return <PastoralLetter />;
    default:
      return <SermonOutline />;
  }
}

export const Home: React.FC<HomeProps> = ({
  activeTab,
  onTabChange,
  focusToolOnOpen = false,
  onToolFocused,
}) => {
  const {
    library,
    drafts,
    onboardingDismissed,
    dismissOnboarding,
    resetOnboarding,
  } = useApp();
  const activeTool = ACTIVE_TAB_COPY[activeTab];
  const favoriteCount = useMemo(
    () => library.filter((item) => item.favorite).length,
    [library],
  );
  const recentDrafts = useMemo(
    () =>
      drafts
        .filter((item) => isActiveTabId(item.toolId))
        .slice(0, 3)
        .map((item) => ({
          ...item,
          tab: item.toolId as ActiveTab,
        })),
    [drafts],
  );
  const recentHistory = useMemo(
    () =>
      library
        .filter((item) => isActiveTabId(item.toolId))
        .slice(0, 3)
        .map((item) => ({
          ...item,
          tab: item.toolId as ActiveTab,
        })),
    [library],
  );
  const toolUsage = useMemo(() => {
    const counts = new Map<ActiveTab, number>();

    library.forEach((item) => {
      if (!isActiveTabId(item.toolId)) {
        return;
      }

      counts.set(item.toolId, (counts.get(item.toolId) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 4)
      .map(([toolId, count]) => ({
        toolId,
        count,
        label: ACTIVE_TAB_COPY[toolId].title,
      }));
  }, [library]);
  const latestDocument = library[0] ?? null;
  const hasDraftForActiveTool = drafts.some((item) => item.toolId === activeTab);
  const resumeItems = useMemo(
    () =>
      recentDrafts.length > 0
        ? recentDrafts.map((item) => ({
            key: `${item.tab}-${item.updatedAt}`,
            label: "Rascunho",
            title: item.title,
            meta: `Atualizado em ${new Date(item.updatedAt).toLocaleString("pt-BR")}`,
            tab: item.tab,
          }))
        : recentHistory.map((item) => ({
            key: `${item.tab}-${item.id}`,
            label: item.toolLabel,
            title: item.title,
            meta: `Salvo em ${new Date(item.createdAt).toLocaleString("pt-BR")}`,
            tab: item.tab,
          })),
    [recentDrafts, recentHistory],
  );

  const scrollToLibrary = () => {
    document.getElementById("biblioteca-local")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (!focusToolOnOpen) {
      return;
    }

    document.getElementById("workspace-tool-area")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    onToolFocused?.();
  }, [focusToolOnOpen, onToolFocused]);

  return (
    <div className="home">
      <header className="workspace-hero">
        <div className="workspace-hero-copy">
          <div className="hero-brand">
            <div className="hero-logo-shell">
              <BrandLogo className="hero-logo" />
            </div>
            <div>
              <span className="hero-kicker">Workspace ministerial</span>
              <h1>Entre pela necessidade do preparo, não pela aba.</h1>
            </div>
          </div>
          <p className="workspace-lead">
            Organize estudo, mensagem, série e comunicação pastoral em um fluxo
            que ajuda a decidir o próximo passo antes mesmo de abrir a ferramenta.
          </p>
          <div className="workspace-meta">
            <span>Fluxo guiado para estudo e pregação</span>
            <span>Resultados salvos na biblioteca local</span>
            <span>Ferramentas pensadas para uso ministerial real</span>
          </div>
        </div>

        <aside className="workspace-focus-card">
          <p className="section-kicker">Ferramenta em foco</p>
          <h2>{activeTool.title}</h2>
          <p>{activeTool.description}</p>
          <div className="workspace-focus-grid">
            <div>
              <span>Use quando</span>
              <strong>{activeTool.useCase}</strong>
            </div>
            <div>
              <span>Entrega</span>
              <strong>{activeTool.outcome}</strong>
            </div>
          </div>
          <button
            type="button"
            className="workspace-focus-action"
            onClick={() => onTabChange(activeTab)}
          >
            Abrir esta ferramenta
          </button>
        </aside>
      </header>

      <section className="workspace-shell" id="workspace-tool-area">
        <div className="workspace-shell-header">
          <div>
            <p className="section-kicker">Área de trabalho</p>
            <h2>Abra a ferramenta certa e avance sem perder contexto</h2>
          </div>
          <div className="workspace-shell-meta">
            <span className="workspace-shell-chip">{activeTool.eyebrow}</span>
            <span className="workspace-shell-chip muted">{activeTool.outcome}</span>
          </div>
        </div>

        <nav
          className="nav-tabs"
          aria-label="Ferramentas do Scriptura"
          role="tablist"
        >
          <button
            className={`tab ${activeTab === "outline" ? "active" : ""}`}
            onClick={() => onTabChange("outline")}
            role="tab"
            aria-selected={activeTab === "outline"}
          >
            Esboço
          </button>
          <button
            className={`tab ${activeTab === "verses" ? "active" : ""}`}
            onClick={() => onTabChange("verses")}
            role="tab"
            aria-selected={activeTab === "verses"}
          >
            Versículos
          </button>
          <button
            className={`tab ${activeTab === "analysis" ? "active" : ""}`}
            onClick={() => onTabChange("analysis")}
            role="tab"
            aria-selected={activeTab === "analysis"}
          >
            Análise
          </button>
          <button
            className={`tab ${activeTab === "explain" ? "active" : ""}`}
            onClick={() => onTabChange("explain")}
            role="tab"
            aria-selected={activeTab === "explain"}
          >
            Passagem
          </button>
          <button
            className={`tab ${activeTab === "concordance" ? "active" : ""}`}
            onClick={() => onTabChange("concordance")}
            role="tab"
            aria-selected={activeTab === "concordance"}
          >
            Concordância
          </button>
          <button
            className={`tab ${activeTab === "schedule" ? "active" : ""}`}
            onClick={() => onTabChange("schedule")}
            role="tab"
            aria-selected={activeTab === "schedule"}
          >
            Cronograma
          </button>
          <button
            className={`tab ${activeTab === "pastoral-letter" ? "active" : ""}`}
            onClick={() => onTabChange("pastoral-letter")}
            role="tab"
            aria-selected={activeTab === "pastoral-letter"}
          >
            Carta GCEU
          </button>
        </nav>

        <main className="main-content">
          <Suspense fallback={<div className="tool-loader">Carregando ferramenta...</div>}>
            {renderTool(activeTab)}
          </Suspense>
        </main>
      </section>

      <section className="workspace-flow">
        <div className="workspace-flow-copy">
          <p className="section-kicker">Fluxo recomendado</p>
          <h2>Do tema bruto ao material pronto em três movimentos</h2>
          <p>
            O app passa a funcionar melhor como percurso de trabalho: escolha um
            ponto de partida, aprofunde o estudo e finalize com revisão e reuso.
          </p>
        </div>
        <div className="workspace-step-grid">
          {FLOW_STEPS.map((step, index) => (
            <article key={step.title} className="workspace-step">
              <span className="workspace-step-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <button
                type="button"
                className="workspace-step-action"
                onClick={() => onTabChange(step.actionTab)}
              >
                {step.actionLabel}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="workspace-pulse">
        <article className="workspace-guide-card">
          <div className="workspace-guide-copy">
            <p className="section-kicker">
              {onboardingDismissed ? "Retomada inteligente" : "Onboarding rápido"}
            </p>
            <h2>
              {onboardingDismissed
                ? "Entre pelo que ficou aberto, não do zero"
                : "Primeiros 5 minutos dentro do workspace"}
            </h2>
            <p>
              {onboardingDismissed
                ? "Seu navegador agora lembra a ferramenta mais recente, os rascunhos por formulário e os últimos resultados da biblioteca."
                : "A fase 4 adiciona um fluxo mais assistido: escolha a ferramenta, deixe o formulário evoluir com autosave local e volte depois sem perder o ponto de partida."}
            </p>
          </div>

          <div className="workspace-guide-steps">
            <div className="workspace-guide-step">
              <span>01</span>
              <strong>Abra uma tarefa concreta</strong>
              <p>Esboço, análise, passagem ou pesquisa por conceito.</p>
            </div>
            <div className="workspace-guide-step">
              <span>02</span>
              <strong>Deixe o rascunho amadurecer</strong>
              <p>O formulário fica salvo neste navegador enquanto você ajusta tema, tom e referências.</p>
            </div>
            <div className="workspace-guide-step">
              <span>03</span>
              <strong>Volte pelo histórico</strong>
              <p>Resultados, favoritos e rascunhos agora ajudam a retomar o estudo sem repetir trabalho.</p>
            </div>
          </div>

          <div className="workspace-guide-actions">
            <button
              type="button"
              className="workspace-step-action"
              onClick={() => onTabChange(activeTab)}
            >
              {hasDraftForActiveTool
                ? "Retomar ferramenta ativa"
                : "Abrir ferramenta ativa"}
            </button>
            <button
              type="button"
              className="workspace-guide-link"
              onClick={scrollToLibrary}
            >
              Ir para a biblioteca
            </button>
            <button
              type="button"
              className="workspace-guide-link"
              onClick={
                onboardingDismissed ? resetOnboarding : dismissOnboarding
              }
            >
              {onboardingDismissed
                ? "Mostrar onboarding novamente"
                : "Dispensar este guia"}
            </button>
          </div>
        </article>

        <article className="workspace-activity-card">
          <div className="workspace-guide-copy">
            <p className="section-kicker">Panorama rápido</p>
            <h2>O que já está guardado neste navegador</h2>
            <p>
              Fase 4 passa a tratar a sessão como workspace contínuo, com
              retomada por histórico, favoritos e rascunhos locais.
            </p>
          </div>

          <div className="workspace-activity-grid">
            <div className="workspace-stat-card">
              <span>Resultados</span>
              <strong>{library.length}</strong>
              <small>Itens na biblioteca local</small>
            </div>
            <div className="workspace-stat-card">
              <span>Rascunhos</span>
              <strong>{drafts.length}</strong>
              <small>Formulários com autosave</small>
            </div>
            <div className="workspace-stat-card">
              <span>Favoritos</span>
              <strong>{favoriteCount}</strong>
              <small>Resultados marcados para revisitar</small>
            </div>
            <div className="workspace-stat-card">
              <span>Última geração</span>
              <strong>{latestDocument ? latestDocument.toolLabel : "Sem atividade"}</strong>
              <small>
                {latestDocument
                  ? new Date(latestDocument.createdAt).toLocaleString("pt-BR")
                  : "Gere um material para começar"}
              </small>
            </div>
          </div>

          {toolUsage.length > 0 && (
            <div className="workspace-usage-strip">
              {toolUsage.map((item) => (
                <button
                  key={item.toolId}
                  type="button"
                  className="workspace-usage-chip"
                  onClick={() => onTabChange(item.toolId)}
                >
                  {item.label} ({item.count})
                </button>
              ))}
            </div>
          )}
        </article>

        <article className="workspace-resume-card">
          <div className="workspace-guide-copy">
            <p className="section-kicker">Retomar trabalho</p>
            <h2>
              {recentDrafts.length > 0
                ? "Rascunhos prontos para continuar"
                : "Seu histórico recente está aqui"}
            </h2>
            <p>
              {recentDrafts.length > 0
                ? "Se você saiu no meio do preparo, basta voltar pela ferramenta certa e continuar do ponto salvo."
                : "Enquanto não houver rascunhos ativos, você ainda pode retomar pelo último material gerado e salvo na biblioteca."}
            </p>
          </div>

          <div className="workspace-resume-list">
            {resumeItems.map((item) => (
              <div key={item.key} className="workspace-resume-item">
                <div>
                  <span>{item.label}</span>
                  <strong>{item.title}</strong>
                  <small>{item.meta}</small>
                </div>
                <button
                  type="button"
                  className="workspace-guide-link strong"
                  onClick={() => onTabChange(item.tab)}
                >
                  Abrir
                </button>
              </div>
            ))}
            {resumeItems.length === 0 && (
              <div className="workspace-resume-empty">
                <strong>Nenhum rastro salvo ainda</strong>
                <p>
                  Gere um primeiro material para liberar histórico, retomada e
                  biblioteca local.
                </p>
              </div>
            )}
          </div>
        </article>
      </section>

      <WorkspaceSyncPanel currentTab={activeTab} />

      <section className="tool-overview">
        <div className="tool-overview-copy">
          <p className="section-kicker">Escolha rápida</p>
          <h2>Ferramentas em linguagem de tarefa, não de menu</h2>
          <p>
            Cada cartão abaixo responde a uma intenção concreta de preparo para
            você entrar no app com menos fricção e mais critério.
          </p>
        </div>
        <div className="tool-card-grid">
          {TOOL_CARDS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              className={`tool-card ${activeTab === tool.id ? "active" : ""}`}
              onClick={() => onTabChange(tool.id)}
            >
              <span className="tool-card-eyebrow">{tool.eyebrow}</span>
              <strong>{tool.title}</strong>
              <span>{tool.description}</span>
              <small>{tool.outcome}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="trust-panel">
        <div>
          <p className="section-kicker">Confiança e revisão</p>
          <h2>Use a IA como apoio pastoral, não como atalho para substituir conferência bíblica</h2>
        </div>
        <p>
          Sugestões de referências, esboços e cartas aceleram a preparação, mas
          continuam exigindo revisão doutrinária, conferência do texto bíblico e
          adequação ao contexto da igreja local.
        </p>
        <div className="trust-points">
          <span>Confirme referências antes de ministrar</span>
          <span>Ajuste o tom ao contexto da igreja</span>
          <span>Use a biblioteca para comparar versões e rascunhos</span>
        </div>
      </section>

      <LibraryPanel />

      <footer className="footer">
        <p>2026 Scriptura - Preparação inteligente para mensagens bíblicas</p>
      </footer>
    </div>
  );
};
