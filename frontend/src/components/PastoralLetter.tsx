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
import "./PastoralLetter.css";

export const PastoralLetter: React.FC = () => {
  const [tema, setTema] = useState("");
  const [objetivo, setObjetivo] = useState(
    "edificar, orientar e fortalecer a igreja",
  );
  const [publicoAlvo, setPublicoAlvo] = useState(
    "liderança, membros e cooperadores do GCEU",
  );
  const [tom, setTom] = useState("pastoral, acolhedor e firme");
  const [versaoBiblica, setVersaoBiblica] = useState<BibleVersion>("ARA");
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [jaGerou, setJaGerou] = useState(false);

  const { showSuccess, showError, saveDocument } = useApp();
  const draftValues = useMemo(
    () => ({
      tema,
      objetivo,
      publicoAlvo,
      tom,
      versaoBiblica,
    }),
    [objetivo, publicoAlvo, tema, tom, versaoBiblica],
  );
  const { draftUpdatedAt, hasDraft, clearSavedDraft } = useToolDraft({
    toolId: "pastoral-letter",
    toolLabel: "Carta GCEU",
    title: tema.trim()
      ? `Carta pastoral: ${tema}`
      : "Carta pastoral em andamento",
    summary: `${publicoAlvo} | ${versaoBiblica}`,
    values: draftValues,
    onRestore: (draft) => {
      setTema(typeof draft.tema === "string" ? draft.tema : "");
      setObjetivo(
        typeof draft.objetivo === "string"
          ? draft.objetivo
          : "edificar, orientar e fortalecer a igreja",
      );
      setPublicoAlvo(
        typeof draft.publicoAlvo === "string"
          ? draft.publicoAlvo
          : "liderança, membros e cooperadores do GCEU",
      );
      setTom(
        typeof draft.tom === "string"
          ? draft.tom
          : "pastoral, acolhedor e firme",
      );
      setVersaoBiblica(
        typeof draft.versaoBiblica === "string"
          ? (draft.versaoBiblica as BibleVersion)
          : "ARA",
      );
    },
  });
  const presets = [
    {
      label: "Chamada à unidade",
      tema: "Unidade da igreja",
      objetivo: "edificar a comunhão e alinhar a igreja",
      publicoAlvo: "membros, liderança e cooperadores",
      tom: "pastoral, acolhedor e firme",
    },
    {
      label: "Tempo de oração",
      tema: "Consagração e oração",
      objetivo: "convocar a igreja para um tempo de busca",
      publicoAlvo: "toda a congregação",
      tom: "pastoral, inspirador e convocatório",
    },
    {
      label: "Aviso ministerial",
      tema: "Postura e testemunho cristão",
      objetivo: "orientar a igreja com maturidade e clareza",
      publicoAlvo: "membros e obreiros",
      tom: "pastoral, sereno e assertivo",
    },
  ];

  const gerarCarta = async () => {
    if (!tema.trim()) {
      showError("Por favor, informe o tema da carta pastoral");
      return;
    }

    setJaGerou(true);
    setCarregando(true);
    try {
      const response = await sermonAPI.createPastoralLetter(
        tema,
        objetivo,
        publicoAlvo,
        tom,
        versaoBiblica,
      );
      setResultado(response.data.carta);
      saveDocument({
        toolId: "pastoral-letter",
        toolLabel: "Carta GCEU",
        title: `Carta pastoral: ${tema}`,
        query: tema,
        summary: `${publicoAlvo} • ${versaoBiblica}`,
        content: response.data.carta,
        contentType: "markdown",
      });
      showSuccess("Carta pastoral gerada com sucesso!");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao gerar carta pastoral"));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="pastoral-letter">
      <div className="input-section">
        <h2>Carta Pastoral para GCEU</h2>
        <p className="subtitle">
          Gere uma carta pastoral com tom ministerial, referências bíblicas e
          direcionamento pronto para leitura, adaptação ou envio.
        </p>

        <div className="tool-context-grid">
          <div className="tool-context-card">
            <span>Ideal para</span>
            <strong>Comunicação congregacional</strong>
            <p>Use quando a igreja precisa de alinhamento, encorajamento ou orientação por escrito.</p>
          </div>
          <div className="tool-context-card">
            <span>Entrega</span>
            <strong>Texto pastoral adaptável</strong>
            <p>Produz uma carta com saudação, desenvolvimento e encerramento prontos para revisar.</p>
          </div>
          <div className="tool-context-card">
            <span>Revisão</span>
            <strong>Tom e contexto local</strong>
            <p>Leia antes de enviar para ajustar linguagem, sensibilidade e referências ao momento da igreja.</p>
          </div>
        </div>

        <div className="preset-row" aria-label="Presets de carta pastoral">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="preset-chip"
              onClick={() => {
                setTema(preset.tema);
                setObjetivo(preset.objetivo);
                setPublicoAlvo(preset.publicoAlvo);
                setTom(preset.tom);
              }}
              disabled={carregando}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="tema-carta">Tema central da carta:</label>
          <input
            id="tema-carta"
            type="text"
            value={tema}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTema(e.target.value)
            }
            placeholder="Ex: Chamado à unidade, Tempo de consagração, Visão para a igreja..."
            disabled={carregando}
          />
        </div>

        <div className="form-group">
          <label htmlFor="objetivo-carta">Objetivo pastoral:</label>
          <input
            id="objetivo-carta"
            type="text"
            value={objetivo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setObjetivo(e.target.value)
            }
            disabled={carregando}
          />
        </div>

        <div className="form-group">
          <label htmlFor="publico-carta">Público-alvo:</label>
          <input
            id="publico-carta"
            type="text"
            value={publicoAlvo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPublicoAlvo(e.target.value)
            }
            disabled={carregando}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tom-carta">Tom da carta:</label>
            <input
              id="tom-carta"
              type="text"
              value={tom}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTom(e.target.value)
              }
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="versao-carta">Versão bíblica:</label>
            <select
              id="versao-carta"
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
          <span className="tool-helper-chip">Bom para alinhamento e encorajamento congregacional</span>
          <span className="tool-helper-chip">Saída pronta para revisar e adaptar</span>
          <span className="tool-helper-chip">Considere sensibilidade e momento da igreja</span>
        </div>

        <ToolDraftBar
          hasDraft={hasDraft}
          draftUpdatedAt={draftUpdatedAt}
          note="Tema, objetivo, público e tom ficam salvos localmente enquanto você escreve"
          onClearDraft={clearSavedDraft}
        />

        <button
          onClick={gerarCarta}
          disabled={carregando}
          className="btn-primary"
        >
          {carregando ? "Gerando carta..." : "Gerar Carta Pastoral"}
        </button>

        <div className="tool-feedback-stack" aria-live="polite">
          {carregando ? (
            <div className="tool-state-card loading">
              <span className="tool-state-kicker">Escrevendo carta</span>
              <strong>Montando um texto pastoral com tom e objetivo definidos</strong>
              <p>
                Estou estruturando saudação, desenvolvimento e fechamento para
                entregar um texto mais maduro e adaptável.
              </p>
              <div className="tool-state-points">
                <span>Tom pastoral</span>
                <span>Objetivo definido</span>
                <span>Base bíblica</span>
              </div>
            </div>
          ) : !resultado ? (
            <div className="tool-state-card empty">
              <span className="tool-state-kicker">
                {jaGerou ? "Pronto para outra carta" : "Antes de escrever"}
              </span>
              <strong>
                {jaGerou
                  ? "Ajuste o tom, o público ou o tema para gerar uma nova versão."
                  : "Defina o tema, o objetivo pastoral e o público para deixar a carta mais assertiva."}
              </strong>
              <p>
                Quando o objetivo está claro, a carta volta mais coerente com o
                momento da igreja e mais fácil de adaptar.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {resultado && (
        <ResultPanel
          title={`Carta pastoral: ${tema}`}
          content={resultado}
          contentType="markdown"
        />
      )}
    </div>
  );
};
