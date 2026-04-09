import React, { useMemo, useState } from "react";
import {
  sermonAPI,
  BIBLE_VERSION_OPTIONS,
  type BibleVersion,
} from "../services/api";
import { useApp } from "../context/AppContext";
import { useToolDraft } from "../hooks/useToolDraft";
import { ResultPanel } from "./ResultPanel";
import { ToolDraftBar } from "./ToolDraftBar";
import { getErrorMessage } from "../utils/httpError";
import "./ExplicarPassagem.css";

export const ExplicarPassagem: React.FC = () => {
  const [referencia, setReferencia] = useState("");
  const [versaoBiblica, setVersaoBiblica] = useState<BibleVersion>("ARA");
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [jaGerou, setJaGerou] = useState(false);

  const { showSuccess, showError, saveDocument } = useApp();
  const draftValues = useMemo(
    () => ({
      referencia,
      versaoBiblica,
    }),
    [referencia, versaoBiblica],
  );
  const { draftUpdatedAt, hasDraft, clearSavedDraft } = useToolDraft({
    toolId: "explain",
    toolLabel: "Passagem",
    title: referencia.trim()
      ? `Passagem: ${referencia}`
      : "Explicação de passagem em andamento",
    summary: `Explicação em ${versaoBiblica}`,
    values: draftValues,
    onRestore: (draft) => {
      setReferencia(typeof draft.referencia === "string" ? draft.referencia : "");
      setVersaoBiblica(
        typeof draft.versaoBiblica === "string"
          ? (draft.versaoBiblica as BibleVersion)
          : "ARA",
      );
    },
  });

  const explicar = async () => {
    if (!referencia.trim()) {
      showError("Por favor, informe uma passagem bíblica");
      return;
    }

    setJaGerou(true);
    setCarregando(true);
    try {
      const response = await sermonAPI.explainPassage(
        referencia,
        versaoBiblica,
      );
      setResultado(response.data.explicacao);
      saveDocument({
        toolId: "explain",
        toolLabel: "Passagem",
        title: `Passagem: ${referencia}`,
        query: referencia,
        summary: `Explicação em ${versaoBiblica}`,
        content: response.data.explicacao,
        contentType: "markdown",
      });
      showSuccess("Explicação gerada com sucesso!");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao explicar passagem"));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="explicar-passagem">
      <div className="input-section">
        <h2>Explicar Passagem Bíblica</h2>
        <p className="subtitle">
          Receba uma leitura clara do texto com contexto, sentido central e
          direções para ensino e pregação.
        </p>

        <div className="tool-context-grid">
          <div className="tool-context-card">
            <span>Ideal para</span>
            <strong>Texto base definido</strong>
            <p>Use quando a passagem já foi escolhida e você quer clareza expositiva antes de desenvolver.</p>
          </div>
          <div className="tool-context-card">
            <span>Entrega</span>
            <strong>Leitura comentada</strong>
            <p>Resume contexto, significado e aplicação para acelerar estudo, classe ou pregação.</p>
          </div>
          <div className="tool-context-card">
            <span>Revisão</span>
            <strong>Contexto completo</strong>
            <p>Leia o capítulo inteiro e confira a relação da passagem com o restante do texto bíblico.</p>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="referencia">Referência bíblica:</label>
          <input
            id="referencia"
            type="text"
            value={referencia}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setReferencia(e.target.value)
            }
            onKeyDown={(e) => e.key === "Enter" && explicar()}
            placeholder="Ex: João 3:16, Romanos 8:28, Salmos 23..."
            disabled={carregando}
          />
        </div>

        <div className="form-group">
          <label htmlFor="versao-biblica-explicacao">Versão bíblica:</label>
          <select
            id="versao-biblica-explicacao"
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

        <div className="exemplos">
          <span>Exemplos para começar:</span>
          {["João 3:16", "Romanos 8:28", "Salmos 23", "Filipenses 4:13"].map(
            (ex) => (
              <button
                key={ex}
                className="btn-exemplo"
                onClick={() => setReferencia(ex)}
                disabled={carregando}
              >
                {ex}
              </button>
            ),
          )}
        </div>

        <div className="tool-helper-row">
          <span className="tool-helper-chip">Melhor para texto base já definido</span>
          <span className="tool-helper-chip">Bom para pregação expositiva e ensino</span>
          <span className="tool-helper-chip">Ajuda a sair do resumo superficial</span>
        </div>

        <ToolDraftBar
          hasDraft={hasDraft}
          draftUpdatedAt={draftUpdatedAt}
          note="A referência e a versão ficam guardadas localmente para você continuar a leitura depois"
          onClearDraft={clearSavedDraft}
        />

        <button
          onClick={explicar}
          disabled={carregando}
          className="btn-primary"
        >
          {carregando ? "Explicando texto..." : "Explicar Passagem"}
        </button>

        <div className="tool-feedback-stack" aria-live="polite">
          {carregando ? (
            <div className="tool-state-card loading">
              <span className="tool-state-kicker">Explicando passagem</span>
              <strong>Lendo o texto com foco em contexto e aplicação</strong>
              <p>
                Estou organizando a passagem para te devolver uma leitura mais
                clara, ensinável e útil para mensagem ou estudo.
              </p>
              <div className="tool-state-points">
                <span>Contexto</span>
                <span>Sentido central</span>
                <span>Aplicação</span>
              </div>
            </div>
          ) : !resultado ? (
            <div className="tool-state-card empty">
              <span className="tool-state-kicker">
                {jaGerou ? "Pronto para outra leitura" : "Antes de explicar"}
              </span>
              <strong>
                {jaGerou
                  ? "Experimente outra passagem ou versão bíblica para comparar a leitura."
                  : "Digite uma referência clara, de preferência com livro, capítulo e versículo."}
              </strong>
              <p>
                Quando a passagem é bem definida, a explicação tende a ficar
                mais precisa e mais fácil de revisar no contexto do capítulo.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {resultado && (
        <ResultPanel
          title={`Passagem: ${referencia}`}
          content={resultado}
          contentType="markdown"
        />
      )}
    </div>
  );
};
