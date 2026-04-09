import React, { useState } from "react";
import {
  sermonAPI,
  BIBLE_VERSION_OPTIONS,
  type BibleVersion,
} from "../services/api";
import { useApp } from "../context/AppContext";
import { ResultPanel } from "./ResultPanel";
import { getErrorMessage } from "../utils/httpError";
import "./ExplicarPassagem.css";

export const ExplicarPassagem: React.FC = () => {
  const [referencia, setReferencia] = useState("");
  const [versaoBiblica, setVersaoBiblica] = useState<BibleVersion>("ARA");
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { showSuccess, showError, saveDocument } = useApp();

  const explicar = async () => {
    if (!referencia.trim()) {
      showError("Por favor, informe uma passagem biblica");
      return;
    }

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
        summary: `Explicacao em ${versaoBiblica}`,
        content: response.data.explicacao,
        contentType: "markdown",
      });
      showSuccess("Explicacao gerada com sucesso!");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao explicar passagem"));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="explicar-passagem">
      <div className="input-section">
        <h2>Explicar Passagem Biblica</h2>
        <p className="subtitle">
          Receba uma leitura clara do texto com contexto, sentido central e
          direcoes para ensino e pregacao.
        </p>

        <div className="form-group">
          <label htmlFor="referencia">Referencia biblica:</label>
          <input
            id="referencia"
            type="text"
            value={referencia}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setReferencia(e.target.value)
            }
            onKeyDown={(e) => e.key === "Enter" && explicar()}
            placeholder="Ex: Joao 3:16, Romanos 8:28, Salmos 23..."
            disabled={carregando}
          />
        </div>

        <div className="form-group">
          <label htmlFor="versao-biblica-explicacao">Versao biblica:</label>
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
          <span>Exemplos para comecar:</span>
          {["Joao 3:16", "Romanos 8:28", "Salmos 23", "Filipenses 4:13"].map(
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

        <button
          onClick={explicar}
          disabled={carregando}
          className="btn-primary"
        >
          {carregando ? "Explicando texto..." : "Explicar Passagem"}
        </button>
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
