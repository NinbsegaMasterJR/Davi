import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  sermonAPI,
  BIBLE_VERSION_OPTIONS,
  type BibleVersion,
} from "../services/api";
import { useApp } from "../context/AppContext";
import { getErrorMessage } from "../utils/httpError";
import "./PastoralLetter.css";

export const PastoralLetter: React.FC = () => {
  const [tema, setTema] = useState("");
  const [objetivo, setObjetivo] = useState(
    "edificar, orientar e fortalecer a igreja",
  );
  const [publicoAlvo, setPublicoAlvo] = useState(
    "lideranca, membros e cooperadores do GCEU",
  );
  const [tom, setTom] = useState("pastoral, acolhedor e firme");
  const [versaoBiblica, setVersaoBiblica] = useState<BibleVersion>("ARA");
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { showSuccess, showError } = useApp();

  const gerarCarta = async () => {
    if (!tema.trim()) {
      showError("Por favor, informe o tema da carta pastoral");
      return;
    }

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
      showSuccess("Carta pastoral gerada com sucesso!");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao gerar carta pastoral"));
    } finally {
      setCarregando(false);
    }
  };

  const copiar = () => {
    navigator.clipboard.writeText(resultado);
    showSuccess("Carta pastoral copiada!");
  };

  return (
    <div className="pastoral-letter">
      <div className="input-section">
        <h2>Carta Pastoral para GCEU</h2>
        <p className="subtitle">
          Gere uma carta pastoral com tom ministerial, referencias biblicas e
          direcionamento pronto para leitura, adaptacao ou envio.
        </p>

        <div className="form-group">
          <label htmlFor="tema-carta">Tema central da carta:</label>
          <input
            id="tema-carta"
            type="text"
            value={tema}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTema(e.target.value)
            }
            placeholder="Ex: Chamado a unidade, Tempo de consagracao, Visao para a igreja..."
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
          <label htmlFor="publico-carta">Publico-alvo:</label>
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
            <label htmlFor="versao-carta">Versao biblica:</label>
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

        <button
          onClick={gerarCarta}
          disabled={carregando}
          className="btn-primary"
        >
          {carregando ? "Gerando carta..." : "Gerar Carta Pastoral"}
        </button>
      </div>

      {resultado && (
        <div className="result-section">
          <div className="result-header">
            <h3>Carta pastoral gerada:</h3>
            <button onClick={copiar} className="btn-copy">
              Copiar
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
