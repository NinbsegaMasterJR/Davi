import React, { useState } from "react";
import {
  analysisAPI,
  BIBLE_VERSION_OPTIONS,
  type BibleVersion,
} from "../services/api";
import { useApp } from "../context/AppContext";
import { ResultPanel } from "./ResultPanel";
import { getErrorMessage } from "../utils/httpError";
import "./TheologicalAnalysis.css";

export const TheologicalAnalysis: React.FC = () => {
  const [tema, setTema] = useState("");
  const [passagem, setPassagem] = useState("");
  const [profundidade, setProfundidade] = useState("medio");
  const [versaoBiblica, setVersaoBiblica] = useState<BibleVersion>("ARA");
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { showSuccess, showError, saveDocument } = useApp();
  const presets = [
    {
      label: "Doutrina da graca",
      tema: "Justificacao pela fe",
      passagem: "Romanos 3:28",
      profundidade: "medio",
    },
    {
      label: "Vida crista",
      tema: "Santificacao",
      passagem: "1 Pedro 1:15-16",
      profundidade: "avancado",
    },
    {
      label: "Escatologia",
      tema: "Esperanca da volta de Cristo",
      passagem: "1 Tessalonicenses 4:13-18",
      profundidade: "medio",
    },
  ];

  const analisar = async () => {
    if (!tema.trim()) {
      showError("Por favor, digite um tema");
      return;
    }

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
        toolLabel: "Analise",
        title: `Analise: ${tema}`,
        query: tema,
        summary: `${profundidade} • ${versaoBiblica}${passagem ? ` • ${passagem}` : ""}`,
        content: response.data.analise,
        contentType: "markdown",
      });
      showSuccess("Analise gerada com sucesso!");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao gerar analise"));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="theological-analysis">
      <div className="input-section">
        <h2>Analise Teologica</h2>
        <p className="feature-highlight">
          Aprofunde temas doutrinarios com mais contexto, mais leitura biblica e
          mais clareza para ensino e pregacao.
        </p>

        <div className="preset-row" aria-label="Presets de analise">
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
          <label htmlFor="tema">Tema teologico ou doutrinario:</label>
          <input
            id="tema"
            type="text"
            value={tema}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTema(e.target.value)
            }
            placeholder="Ex: Justificacao pela fe, Santificacao, Reino de Deus..."
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
          <label htmlFor="profundidade">Nivel de aprofundamento:</label>
          <select
            id="profundidade"
            value={profundidade}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setProfundidade(e.target.value)
            }
            disabled={carregando}
          >
            <option value="basico">Basico</option>
            <option value="medio">Medio</option>
            <option value="avancado">Avancado</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="versao-biblica-analise">Versao biblica:</label>
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

        <button
          onClick={analisar}
          disabled={carregando}
          className="btn-primary"
        >
          {carregando ? "Analisando tema..." : "Gerar Analise"}
        </button>
      </div>

      {resultado && (
        <ResultPanel
          title={`Analise: ${tema}`}
          content={resultado}
          contentType="markdown"
        />
      )}
    </div>
  );
};
