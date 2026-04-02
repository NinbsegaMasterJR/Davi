import React, { useState } from "react";
import {
  versesAPI,
  BIBLE_VERSION_OPTIONS,
  type BibleVersion,
  type Versiculo,
} from "../services/api";
import { useApp } from "../context/AppContext";
import { getErrorMessage } from "../utils/httpError";
import "./VersesSuggestion.css";

export const VersesSuggestion: React.FC = () => {
  const [tema, setTema] = useState("");
  const [limite, setLimite] = useState(5);
  const [versaoBiblica, setVersaoBiblica] = useState<BibleVersion>("ARA");
  const [versiculos, setVersiculos] = useState<Versiculo[]>([]);
  const [carregando, setCarregando] = useState(false);

  const { showSuccess, showError } = useApp();

  const buscar = async () => {
    if (!tema.trim()) {
      showError("Por favor, digite um tema");
      return;
    }

    setCarregando(true);
    try {
      const response = await versesAPI.suggest(tema, limite, versaoBiblica);
      setVersiculos(response.data.versiculos);
      showSuccess(`${response.data.versiculos.length} versiculos encontrados!`);
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao buscar versiculos"));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="verses-suggestion">
      <div className="search-section">
        <h2>Sugerir Versiculos por Tema</h2>
        <p className="feature-highlight">
          Encontre textos que dialogam com o foco da sua mensagem e ampliam sua
          base biblica com rapidez.
        </p>

        <div className="form-group">
          <label htmlFor="tema">Tema, assunto ou necessidade da igreja:</label>
          <input
            id="tema"
            type="text"
            value={tema}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTema(e.target.value)
            }
            placeholder="Ex: Consolacao, Santidade, Esperanca em meio a prova..."
            disabled={carregando}
          />
        </div>

        <div className="form-group">
          <label htmlFor="limite">Quantidade de referencias:</label>
          <select
            id="limite"
            value={limite}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setLimite(Number(e.target.value))
            }
            disabled={carregando}
          >
            <option value={3}>3 versiculos</option>
            <option value={5}>5 versiculos</option>
            <option value={10}>10 versiculos</option>
            <option value={15}>15 versiculos</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="versao-biblica-versiculos">Versao biblica:</label>
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

        <button onClick={buscar} disabled={carregando} className="btn-search">
          {carregando ? "Buscando referencias..." : "Buscar Versiculos"}
        </button>
      </div>

      {versiculos.length > 0 && (
        <div className="results-section">
          <h3>Versiculos encontrados:</h3>
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
