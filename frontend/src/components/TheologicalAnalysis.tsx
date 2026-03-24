import React, { useState } from "react";
import { sermonAPI } from "../services/api";
import { useApp } from "../context/AppContext";
import "./TheologicalAnalysis.css";
import ReactMarkdown from "react-markdown";

export const TheologicalAnalysis: React.FC = () => {
  const [tema, setTema] = useState("");
  const [passagem, setPassagem] = useState("");
  const [profundidade, setProfundidade] = useState("medio");
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { showSuccess, showError } = useApp();

  const analisar = async () => {
    if (!tema.trim()) {
      showError("Por favor, digite um tema");
      return;
    }

    setCarregando(true);
    try {
      const response = await sermonAPI.analyzeTheologically(
        tema,
        passagem || undefined,
      );
      setResultado(response.data.analise);
      showSuccess("Análise gerada com sucesso!");
    } catch (error: any) {
      showError(error.response?.data?.error || "Erro ao gerar análise");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="theological-analysis">
      <div className="input-section">
        <h2>🔍 Análise Teológica</h2>

        <div className="form-group">
          <label htmlFor="tema">Tema Teológico:</label>
          <input
            id="tema"
            type="text"
            value={tema}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTema(e.target.value)
            }
            placeholder="Ex: Justificação, Santificação, Reino de Deus..."
            disabled={carregando}
          />
        </div>

        <div className="form-group">
          <label htmlFor="passagem">Passagem Relacionada (opcional):</label>
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
          <label htmlFor="profundidade">Profundidade da Análise:</label>
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

        <button
          onClick={analisar}
          disabled={carregando}
          className="btn-primary"
        >
          {carregando ? "⏳ Analisando..." : "📊 Fazer Análise"}
        </button>
      </div>

      {resultado && (
        <div className="result-section">
          <div className="result-header">
            <h3>📝 Análise Teológica:</h3>
          </div>
          <div className="markdown-content">
            <ReactMarkdown>{resultado}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
