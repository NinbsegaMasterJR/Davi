import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  concordanceAPI,
  BIBLE_VERSION_OPTIONS,
  type BibleVersion,
} from "../services/api";
import { useApp } from "../context/AppContext";
import { useToolDraft } from "../hooks/useToolDraft";
import { getErrorMessage } from "../utils/httpError";
import { formatVersesAsText } from "../utils/resultFormatting";
import { ToolDraftBar } from "./ToolDraftBar";
import "./Concordancia.css";

interface VersoResult {
  referencia: string;
  texto: string;
  versao?: string;
}

export const Concordancia: React.FC = () => {
  const [palavra, setPalavra] = useState("");
  const [limite, setLimite] = useState(10);
  const [versaoBiblica, setVersaoBiblica] = useState<BibleVersion>("ARA");
  const [resultados, setResultados] = useState<VersoResult[]>([]);
  const [totalResultados, setTotalResultados] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [jaBuscou, setJaBuscou] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const { showSuccess, showError, saveDocument } = useApp();
  const draftValues = useMemo(
    () => ({
      palavra,
      limite,
      versaoBiblica,
    }),
    [limite, palavra, versaoBiblica],
  );
  const { draftUpdatedAt, hasDraft, clearSavedDraft } = useToolDraft({
    toolId: "concordance",
    toolLabel: "Concordância",
    title: palavra.trim()
      ?`Concordância: ${palavra}`
      : "Pesquisa de concordância em andamento",
    summary: `${limite} resultados | ${versaoBiblica}`,
    values: draftValues,
    onRestore: (draft) => {
      setPalavra(typeof draft.palavra === "string" ?draft.palavra : "");
      setLimite(
        typeof draft.limite === "number"
          ?draft.limite
          : Number(draft.limite) || 10,
      );
      setVersaoBiblica(
        typeof draft.versaoBiblica === "string"
          ?(draft.versaoBiblica as BibleVersion)
          : "ARA",
      );
    },
  });
  const presets = [
    {
      label: "Graça",
      palavra: "graça",
      limite: 10,
    },
    {
      label: "Aliança",
      palavra: "aliança",
      limite: 10,
    },
    {
      label: "Perdão",
      palavra: "perdão",
      limite: 10,
    },
    {
      label: "Ressurreição",
      palavra: "ressurreição",
      limite: 10,
    },
    {
      label: "Santificação",
      palavra: "santificação",
      limite: 10,
    },
    {
      label: "Serviço",
      palavra: "serviço",
      limite: 10,
    },
    {
      label: "Esperança",
      palavra: "esperança",
      limite: 10,
    },
  ];

  useEffect(() => {
    if (resultados.length > 0) {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [resultados]);

  const buscar = async () => {
    if (!palavra.trim()) {
      showError("Por favor, informe uma palavra para buscar");
      return;
    }

    setJaBuscou(true);
    setCarregando(true);
    try {
      const response = await concordanceAPI.search(
        palavra,
        limite,
        versaoBiblica,
      );
      setResultados(response.data.resultados);
      setTotalResultados(response.data.total);
      saveDocument({
        toolId: "concordance",
        toolLabel: "Concordância",
        title: `Concordância: ${palavra}`,
        query: palavra,
        summary: `${response.data.total} resultados em ${versaoBiblica}`,
        content: formatVersesAsText(
          `Concordância: ${palavra}`,
          palavra,
          response.data.resultados,
        ),
        contentType: "text",
      });
      showSuccess(`${response.data.total} resultados encontrados!`);
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao buscar concordância"));
    } finally {
      setCarregando(false);
    }
  };

  const copiarTodos = () => {
    const texto = resultados
      .map((r) => `${r.referencia}: "${r.texto}" (${r.versao || "ARA"})`)
      .join("\n\n");
    navigator.clipboard.writeText(texto);
    showSuccess("Todos os versículos copiados!");
  };

  return (
    <div className="concordancia">
      <div className="search-section">
        <h2>Concordância Bíblica</h2>
        <p className="subtitle">
          Localize rapidamente textos ligados a uma palavra, tema ou ideia para
          fortalecer sua preparação bíblica.
        </p>

        <div className="tool-context-grid">
          <div className="tool-context-card">
            <span>Ideal para</span>
            <strong>Pesquisa por conceito</strong>
            <p>Ajuda quando você ainda está construindo a malha bíblica do estudo ou da série.</p>
          </div>
          <div className="tool-context-card">
            <span>Entrega</span>
            <strong>Painel de ocorrências</strong>
            <p>Mostra uma base de textos relacionados que pode gerar novas linhas para o desenvolvimento.</p>
          </div>
          <div className="tool-context-card">
            <span>Revisão</span>
            <strong>Uso como ponto de partida</strong>
            <p>A concordância serve para descoberta inicial e ainda pede conferência textual posterior.</p>
          </div>
        </div>

        <div className="preset-row" aria-label="Exemplos de termos para concordância">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="preset-chip"
              onClick={() => {
                setPalavra(preset.palavra);
                setLimite(preset.limite);
              }}
              disabled={carregando}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="form-row">
          <div className="form-group flex-grow">
            <label htmlFor="palavra">Palavra, tema ou conceito:</label>
            <input
              id="palavra"
              type="text"
              value={palavra}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPalavra(e.target.value)
              }
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              placeholder="Ex: amor, fé, graça, perdão, ressurreição..."
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="limite">Quantidade:</label>
            <select
              id="limite"
              value={limite}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setLimite(Number(e.target.value))
              }
              disabled={carregando}
            >
              <option value={5}>5 versículos</option>
              <option value={10}>10 versículos</option>
              <option value={15}>15 versículos</option>
              <option value={20}>20 versículos</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="versao-biblica-concordancia">Versão bíblica:</label>
            <select
              id="versao-biblica-concordancia"
              value={versaoBiblica}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setVersaoBiblica(e.target.value as BibleVersion)
              }
              disabled={carregando}
            >
              {BIBLE_VERSION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="tool-helper-row">
          <span className="tool-helper-chip">Bom para pesquisa temática inicial</span>
          <span className="tool-helper-chip">Ajuda a costurar séries e estudos</span>
          <span className="tool-helper-chip">Use como ponto de partida, não como versão final</span>
        </div>

        <ToolDraftBar
          hasDraft={hasDraft}
          draftUpdatedAt={draftUpdatedAt}
          note="O termo pesquisado, a quantidade e a versão ficam guardados para retomada rápida"
          onClearDraft={clearSavedDraft}
        />

        <button onClick={buscar} disabled={carregando} className="btn-search">
          {carregando ?"Buscando textos..." : "Buscar na Bíblia"}
        </button>

        <div className="tool-feedback-stack" aria-live="polite">
          {carregando ?(
            <div className="tool-state-card loading">
              <span className="tool-state-kicker">Pesquisa em andamento</span>
              <strong>Relacionando textos ao conceito informado</strong>
              <p>
                Estou cruzando a palavra-chave com referências que podem abrir
                caminhos para seu estudo ou desenvolvimento.
              </p>
              <div className="tool-state-points">
                <span>Termo pesquisado</span>
                <span>Quantidade de ocorrências</span>
                <span>Versão bíblica</span>
              </div>
            </div>
          ) : resultados.length === 0 ?(
            <div className="tool-state-card empty">
              <span className="tool-state-kicker">
                {jaBuscou ?"Nenhum painel pronto no momento" : "Antes da pesquisa"}
              </span>
              <strong>
                {jaBuscou
                  ?"Experimente simplificar o termo ou pesquisar por um conceito mais amplo."
                  : "Pesquise por uma palavra-chave ou conceito que ajude a abrir o estudo."}
              </strong>
              <p>
                Termos objetivos como fé, aliança, consagração, perdão ou
                ressurreição costumam render uma trilha melhor de referências.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {resultados.length > 0 && (
        <div className="results-section" ref={resultsRef}>
          <div className="tool-status tool-status-warn">
            <strong>Conferência recomendada</strong>
            Use esta concordância como ponto de partida e confirme citações e
            redações bíblicas antes de publicar ou pregar.
          </div>
          <div className="results-header">
            <h3>
              Resultados para <em>"{palavra}"</em>
              <span className="badge">{totalResultados}</span>
            </h3>
            <button onClick={copiarTodos} className="btn-copy-all">
              Copiar Todos
            </button>
          </div>

          <div className="verses-grid">
            {resultados.map((verso, index) => (
              <div key={index} className="verso-card">
                <div className="verso-header">
                  <span className="verso-ref">{verso.referencia}</span>
                  {verso.versao && (
                    <span className="verso-version">{verso.versao}</span>
                  )}
                </div>
                <p className="verso-text">"{verso.texto}"</p>
                <button
                  className="btn-copy-single"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${verso.referencia}: "${verso.texto}"`,
                    );
                    showSuccess("Versículo copiado!");
                  }}
                >
                  Copiar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
