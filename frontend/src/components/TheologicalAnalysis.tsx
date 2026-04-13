import React, { useMemo, useState } from "react";
import {
  analysisAPI,
  BIBLE_VERSION_OPTIONS,
  type BibleVersion,
} from "../services/api";
import { useApp } from "../context/AppContext";
import { useToolDraft } from "../hooks/useToolDraft";
import { ResultPanel } from "./ResultPanel";
import { ToolDraftBar } from "./ToolDraftBar";
import { getErrorMessage } from "../utils/httpError";
import "./TheologicalAnalysis.css";

export const TheologicalAnalysis: React.FC = () => {
  const [tema, setTema] = useState("");
  const [passagem, setPassagem] = useState("");
  const [profundidade, setProfundidade] = useState("medio");
  const [versaoBiblica, setVersaoBiblica] = useState<BibleVersion>("ARA");
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [jaGerou, setJaGerou] = useState(false);

  const { showSuccess, showError, saveDocument } = useApp();
  const draftValues = useMemo(
    () => ({
      tema,
      passagem,
      profundidade,
      versaoBiblica,
    }),
    [passagem, profundidade, tema, versaoBiblica],
  );
  const { draftUpdatedAt, hasDraft, clearSavedDraft } = useToolDraft({
    toolId: "analysis",
    toolLabel: "Análise",
    title: tema.trim() ?`Análise: ${tema}` : "Análise em andamento",
    summary: `${profundidade} | ${versaoBiblica}${passagem ?` | ${passagem}` : ""}`,
    values: draftValues,
    onRestore: (draft) => {
      setTema(typeof draft.tema === "string" ?draft.tema : "");
      setPassagem(typeof draft.passagem === "string" ?draft.passagem : "");
      setProfundidade(
        typeof draft.profundidade === "string" ?draft.profundidade : "medio",
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
      label: "Doutrina da graça",
      tema: "Justificação pela fé",
      passagem: "Romanos 3:28",
      profundidade: "medio",
    },
    {
      label: "Vida cristã",
      tema: "Santificação",
      passagem: "1 Pedro 1:15-16",
      profundidade: "avancado",
    },
    {
      label: "Escatologia",
      tema: "Esperança da volta de Cristo",
      passagem: "1 Tessalonicenses 4:13-18",
      profundidade: "medio",
    },
    {
      label: "EBD",
      tema: "Dons espirituais e edificação da igreja",
      passagem: "1 Coríntios 12",
      profundidade: "medio",
    },
    {
      label: "Discipulado",
      tema: "Nova vida em Cristo",
      passagem: "Efésios 4:17-32",
      profundidade: "basico",
    },
    {
      label: "Formação de líderes",
      tema: "Caráter pastoral e serviço",
      passagem: "1 Pedro 5:1-4",
      profundidade: "avancado",
    },
  ];

  const analisar = async () => {
    if (!tema.trim()) {
      showError("Por favor, digite um tema");
      return;
    }

    setJaGerou(true);
    setCarregando(true);
    try {
      const response = await analysisAPI.theological(
        tema,
        profundidade as "basico" | "medio" | "avancado",
        passagem || undefined,
        versaoBiblica,
      );
      setResultado(response.data.analise);
      saveDocument({
        toolId: "analysis",
        toolLabel: "Análise",
        title: `Análise: ${tema}`,
        query: tema,
        summary: `${profundidade} • ${versaoBiblica}${passagem ?` • ${passagem}` : ""}`,
        content: response.data.analise,
        contentType: "markdown",
      });
      showSuccess("Análise gerada com sucesso!");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao gerar análise"));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="theological-analysis">
      <div className="input-section">
        <h2>Análise Teológica</h2>
        <p className="feature-highlight">
          Aprofunde temas doutrinários com mais contexto, mais leitura bíblica e
          mais clareza para ensino e pregação.
        </p>

        <div className="tool-context-grid">
          <div className="tool-context-card">
            <span>Ideal para</span>
            <strong>Ensino e aprofundamento</strong>
            <p>Funciona melhor quando a necessidade é densidade teológica e não apenas estrutura de sermão.</p>
          </div>
          <div className="tool-context-card">
            <span>Entrega</span>
            <strong>Análise mais argumentada</strong>
            <p>Relaciona contexto, interpretação e aplicação em um texto único e revisável.</p>
          </div>
          <div className="tool-context-card">
            <span>Revisão</span>
            <strong>Leitura doutrinária local</strong>
            <p>Compare a resposta com a confissão, linha teológica e objetivo da sua igreja.</p>
          </div>
        </div>

        <div className="preset-row" aria-label="Presets de análise">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="preset-chip"
              onClick={() => {
                setTema(preset.tema);
                setPassagem(preset.passagem);
                setProfundidade(preset.profundidade);
              }}
              disabled={carregando}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="tema">Tema teológico ou doutrinário:</label>
          <input
            id="tema"
            type="text"
            value={tema}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTema(e.target.value)
            }
            placeholder="Ex: Justificação pela fé, Santificação, Reino de Deus..."
            disabled={carregando}
          />
        </div>

        <div className="form-group">
          <label htmlFor="passagem">Passagem de apoio (opcional):</label>
          <input
            id="passagem"
            type="text"
            value={passagem}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassagem(e.target.value)
            }
            placeholder="Ex: Romanos 3:28"
            disabled={carregando}
          />
        </div>

        <div className="form-group">
          <label htmlFor="profundidade">Nível de aprofundamento:</label>
          <select
            id="profundidade"
            value={profundidade}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setProfundidade(e.target.value)
            }
            disabled={carregando}
          >
            <option value="basico">Básico</option>
            <option value="medio">Médio</option>
            <option value="avancado">Avançado</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="versao-biblica-analise">Versão bíblica:</label>
          <select
            id="versao-biblica-analise"
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
          <span className="tool-helper-chip">Melhor para temas doutrinários e ensino</span>
          <span className="tool-helper-chip">Pode usar uma passagem como âncora</span>
          <span className="tool-helper-chip">Resultado volta pronto para revisar e exportar</span>
        </div>

        <ToolDraftBar
          hasDraft={hasDraft}
          draftUpdatedAt={draftUpdatedAt}
          note="Tema, passagem e profundidade continuam salvos para você retomar depois"
          onClearDraft={clearSavedDraft}
        />

        <button
          onClick={analisar}
          disabled={carregando}
          className="btn-primary"
        >
          {carregando ?"Analisando tema..." : "Gerar Análise"}
        </button>

        <div className="tool-feedback-stack" aria-live="polite">
          {carregando ?(
            <div className="tool-state-card loading">
              <span className="tool-state-kicker">Análise em andamento</span>
              <strong>Organizando contexto, interpretação e aplicação</strong>
              <p>
                Estou aprofundando o tema a partir da passagem, do nível de
                densidade e da linha de leitura bíblica escolhida.
              </p>
              <div className="tool-state-points">
                <span>Fundamento bíblico</span>
                <span>Contexto histórico</span>
                <span>Aplicação pastoral</span>
              </div>
            </div>
          ) : !resultado ?(
            <div className="tool-state-card empty">
              <span className="tool-state-kicker">
                {jaGerou ?"Pronto para aprofundar de novo" : "Antes de analisar"}
              </span>
              <strong>
                {jaGerou
                  ?"Ajuste profundidade, tema ou passagem e gere uma nova leitura."
                  : "Escolha um tema teológico claro e, se puder, uma passagem de apoio."}
              </strong>
              <p>
                Temas mais objetivos e uma passagem-base tendem a gerar uma
                resposta mais útil para sala de aula, série ou pregação.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {resultado && (
        <ResultPanel
          title={`Análise: ${tema}`}
          content={resultado}
          contentType="markdown"
        />
      )}
    </div>
  );
};
