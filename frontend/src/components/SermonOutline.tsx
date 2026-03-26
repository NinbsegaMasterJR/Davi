import React, { useState } from "react";
import { sermonAPI } from "../services/api";
import { useApp } from "../context/AppContext";
import { getErrorMessage } from "../utils/httpError";
import "./SermonOutline.css";
import ReactMarkdown from "react-markdown";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SermonOutline: React.FC = () => {
  const [tema, setTema] = useState("");
  const [estilo, setEstilo] = useState("Pentecostal");
  const [duracao, setDuracao] = useState(30);
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { showSuccess, showError } = useApp();

  const gerar = async () => {
    if (!tema.trim()) {
      showError("Por favor, digite um tema");
      return;
    }

    setCarregando(true);
    try {
      const response = await sermonAPI.generateOutline(tema, estilo, duracao);
      setResultado(response.data.esboço);
      showSuccess("Esboço gerado com sucesso!");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao gerar esboço"));
    } finally {
      setCarregando(false);
    }
  };

  const copiar = () => {
    navigator.clipboard.writeText(resultado);
    showSuccess("Copiado para a área de transferência!");
  };

  return (
    <div className="sermon-outline">
      <div className="input-section">
        <h2>📝 Gerar Esboço de Pregação</h2>

        <div className="form-group">
          <label htmlFor="tema">Tema da Pregação:</label>
          <input
            id="tema"
            type="text"
            value={tema}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTema(e.target.value)
            }
            placeholder="Ex: Fé, Resgate, Graça..."
            disabled={carregando}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="estilo">Estilo de Igreja:</label>
            <select
              id="estilo"
              value={estilo}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setEstilo(e.target.value)
              }
              disabled={carregando}
            >
              <option>Pentecostal</option>
              <option>Assembléia de Deus</option>
              <option>Foursquare</option>
              <option>Evangélica Genérica</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="duracao">Duração (min):</label>
            <input
              id="duracao"
              type="number"
              value={duracao}
              onChange={(e) => setDuracao(Number(e.target.value))}
              min="15"
              max="120"
              disabled={carregando}
            />
          </div>
        </div>

        <button onClick={gerar} disabled={carregando} className="btn-primary">
          {carregando ? "⏳ Gerando..." : "✨ Gerar Esboço"}
        </button>
      </div>

      {resultado && (
        <div className="result-section">
          <div className="result-header">
            <h3>📖 Seu Esboço:</h3>
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
