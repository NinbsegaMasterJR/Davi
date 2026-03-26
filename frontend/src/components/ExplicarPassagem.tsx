import React, { useState } from "react";
import { sermonAPI } from "../services/api";
import { useApp } from "../context/AppContext";
import { getErrorMessage } from "../utils/httpError";
import "./ExplicarPassagem.css";
import ReactMarkdown from "react-markdown";

export const ExplicarPassagem: React.FC = () => {
  const [referencia, setReferencia] = useState("");
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { showSuccess, showError } = useApp();

  const explicar = async () => {
    if (!referencia.trim()) {
      showError("Por favor, informe uma passagem bíblica");
      return;
    }

    setCarregando(true);
    try {
      const response = await sermonAPI.explainPassage(referencia);
      setResultado(response.data.explicacao);
      showSuccess("Explicação gerada com sucesso!");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao explicar passagem"));
    } finally {
      setCarregando(false);
    }
  };

  const copiar = () => {
    navigator.clipboard.writeText(resultado);
    showSuccess("Copiado para a área de transferência!");
  };

  return (
    <div className="explicar-passagem">
      <div className="input-section">
        <h2>✝️ Explicar Passagem Bíblica</h2>
        <p className="subtitle">
          Obtenha uma explicação detalhada de qualquer passagem bíblica com
          contexto histórico e aplicação prática.
        </p>

        <div className="form-group">
          <label htmlFor="referencia">Passagem Bíblica:</label>
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

        <div className="exemplos">
          <span>Exemplos rápidos:</span>
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

        <button
          onClick={explicar}
          disabled={carregando}
          className="btn-primary"
        >
          {carregando ? "⏳ Explicando..." : "✝️ Explicar Passagem"}
        </button>
      </div>

      {resultado && (
        <div className="result-section">
          <div className="result-header">
            <h3>📖 Explicação: {referencia}</h3>
            <button onClick={copiar} className="btn-copy">
              📋 Copiar
            </button>
          </div>
          <div className="markdown-content">
            <ReactMarkdown>{resultado}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
