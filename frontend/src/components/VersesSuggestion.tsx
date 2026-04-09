import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  versesAPI,
  BIBLE_VERSION_OPTIONS,
  type BibleVersion,
  type Versiculo,
} from "../services/api";
import { useApp } from "../context/AppContext";
import { useToolDraft } from "../hooks/useToolDraft";
import { getErrorMessage } from "../utils/httpError";
import { formatVersesAsText } from "../utils/resultFormatting";
import { ToolDraftBar } from "./ToolDraftBar";
import "./VersesSuggestion.css";

export const VersesSuggestion: React.FC = () => {
  const [tema, setTema] = useState("");
  const [limite, setLimite] = useState(5);
  const [versaoBiblica, setVersaoBiblica] = useState<BibleVersion>("ARA");
  const [versiculos, setVersiculos] = useState<Versiculo[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [jaBuscou, setJaBuscou] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const { showSuccess, showError, saveDocument } = useApp();
  const draftValues = useMemo(
    () => ({
      tema,
      limite,
      versaoBiblica,
    }),
    [limite, tema, versaoBiblica],
  );
  const { draftUpdatedAt, hasDraft, clearSavedDraft } = useToolDraft({
    toolId: "verses",
    toolLabel: "Versículos",
    title: tema.trim()
      ? `Versículos sobre: ${tema}`
      : "Busca de versículos em andamento",
    summary: `${limite} referências | ${versaoBiblica}`,
    values: draftValues,
    onRestore: (draft) => {
      setTema(typeof draft.tema === "string" ? draft.tema : "");
      setLimite(
        typeof draft.limite === "number"
          ? draft.limite
          : Number(draft.limite) || 5,
      );
      setVersaoBiblica(
        typeof draft.versaoBiblica === "string"
          ? (draft.versaoBiblica as BibleVersion)
          : "ARA",
      );
    },
  });

  useEffect(() => {
    if (versiculos.length > 0) {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [versiculos]);

  const buscar = async () => {
    if (!tema.trim()) {
      showError("Por favor, digite um tema");
      return;
    }

    setJaBuscou(true);
    setCarregando(true);
    try {
      const response = await versesAPI.suggest(tema, limite, versaoBiblica);
      setVersiculos(response.data.versiculos);
      saveDocument({
        toolId: "verses",
        toolLabel: "Versículos",
        title: `Versículos sobre: ${tema}`,
        query: tema,
        summary: `${response.data.versiculos.length} referências em ${versaoBiblica}`,
        content: formatVersesAsText(
          `Versículos sobre: ${tema}`,
          tema,
          response.data.versiculos,
        ),
        contentType: "text",
      });
      showSuccess(`${response.data.versiculos.length} versículos encontrados!`);
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao buscar versículos"));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="verses-suggestion">
      <div className="search-section">
        <h2>Sugerir Versículos por Tema</h2>
        <p className="feature-highlight">
          Encontre textos que dialogam com o foco da sua mensagem e ampliam sua
          base bíblica com rapidez.
        </p>

        <div className="tool-context-grid">
          <div className="tool-context-card">
            <span>Ideal para</span>
            <strong>Ampliar repertório bíblico</strong>
            <p>Bom quando o tema está claro, mas você quer apoiar a mensagem com mais referências.</p>
          </div>
          <div className="tool-context-card">
            <span>Entrega</span>
            <strong>Lista pronta para triagem</strong>
            <p>Versículos relacionados ao assunto para comparar, selecionar e encaixar no estudo.</p>
          </div>
          <div className="tool-context-card">
            <span>Revisão</span>
            <strong>Texto bíblico em fonte confiável</strong>
            <p>Confira redação e contexto antes de citar ou projetar durante a ministração.</p>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tema">Tema, assunto ou necessidade da igreja:</label>
          <input
            id="tema"
            type="text"
            value={tema}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTema(e.target.value)
            }
            placeholder="Ex: Consolação, Santidade, Esperança em meio à prova..."
            disabled={carregando}
          />
        </div>

        <div className="form-group">
          <label htmlFor="limite">Quantidade de referências:</label>
          <select
            id="limite"
            value={limite}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setLimite(Number(e.target.value))
            }
            disabled={carregando}
          >
            <option value={3}>3 versículos</option>
            <option value={5}>5 versículos</option>
            <option value={10}>10 versículos</option>
            <option value={15}>15 versículos</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="versao-biblica-versiculos">Versão bíblica:</label>
          <select
            id="versao-biblica-versiculos"
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

        <div className="tool-helper-row">
          <span className="tool-helper-chip">Boa ferramenta para abrir o estudo</span>
          <span className="tool-helper-chip">Ideal para levantar textos de apoio</span>
          <span className="tool-helper-chip">Confira as referências antes de ministrar</span>
        </div>

        <ToolDraftBar
          hasDraft={hasDraft}
          draftUpdatedAt={draftUpdatedAt}
          note="Tema, quantidade e versão bíblica continuam salvos neste navegador"
          onClearDraft={clearSavedDraft}
        />

        <button onClick={buscar} disabled={carregando} className="btn-search">
          {carregando ? "Buscando referências..." : "Buscar Versículos"}
        </button>

        <div className="tool-feedback-stack" aria-live="polite">
          {carregando ? (
            <div className="tool-state-card loading">
              <span className="tool-state-kicker">Buscando referências</span>
              <strong>Mapeando textos ligados ao tema informado</strong>
              <p>
                Estou levantando versículos para te devolver uma base inicial
                de apoio bíblico e comparação.
              </p>
              <div className="tool-state-points">
                <span>Tema principal</span>
                <span>Quantidade escolhida</span>
                <span>Versão bíblica</span>
              </div>
            </div>
          ) : versiculos.length === 0 ? (
            <div className="tool-state-card empty">
              <span className="tool-state-kicker">
                {jaBuscou ? "Nenhuma lista pronta no momento" : "Antes da busca"}
              </span>
              <strong>
                {jaBuscou
                  ? "Tente reformular o tema, ajustar a quantidade ou mudar a versão bíblica."
                  : "Digite um tema claro para levantar versículos de apoio com mais foco."}
              </strong>
              <p>
                Assuntos mais objetivos, como fé, santidade, consolo ou
                perseverança, costumam retornar listas mais úteis para triagem.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {versiculos.length > 0 && (
        <div className="results-section" ref={resultsRef}>
          <div className="tool-status tool-status-warn">
            <strong>Conferência recomendada</strong>
            As referências abaixo são geradas com apoio de IA. Revise os textos
            bíblicos na sua fonte de confiança antes de ministrar.
          </div>
          <h3>Versículos encontrados:</h3>
          <div className="verses-list">
            {versiculos.map((verso, index) => (
              <div key={index} className="verso-card">
                <div className="verso-ref">{verso.referencia}</div>
                <p className="verso-text">{verso.texto}</p>
                {verso.versao && (
                  <span className="verso-version">{verso.versao}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
