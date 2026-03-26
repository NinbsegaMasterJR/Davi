import React, { useState } from "react";
import { versesAPI, type Versiculo } from "../services/api";
import { useApp } from "../context/AppContext";
import { getErrorMessage } from "../utils/httpError";
import "./VersesSuggestion.css";

export const VersesSuggestion: React.FC = () => {
  const [tema, setTema] = useState("");
  const [limite, setLimite] = useState(5);
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
      const response = await versesAPI.suggest(tema, limite);
      setVersiculos(response.data.versiculos);
      showSuccess(`${response.data.versiculos.length} versículos encontrados!`);
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao buscar versículos"));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="verses-suggestion">
      <div className="search-section">
        <h2>📖 Sugerir Versículos por Tema</h2>

        <div className="form-group">
          <label htmlFor="tema">Tema:</label>
          <input
            id="tema"
            type="text"
            value={tema}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTema(e.target.value)
            }
            placeholder="Ex: Amor, Esperança, Salvação..."
            disabled={carregando}
          />
        </div>

        <div className="form-group">
          <label htmlFor="limite">Quantos versículos?</label>
          <select
            id="limite"
            value={limite}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setLimite(Number(e.target.value))
            }
            disabled={carregando}
          >
            <option value={3}>3 versículos</option>
            <option value={5}>5 versículos</option>
            <option value={10}>10 versículos</option>
            <option value={15}>15 versículos</option>
          </select>
        </div>

        <button onClick={buscar} disabled={carregando} className="btn-search">
          {carregando ? "🔍 Buscando..." : "🔍 Buscar Versículos"}
        </button>
      </div>

      {versiculos.length > 0 && (
        <div className="results-section">
          <h3>✨ Versículos Encontrados:</h3>
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
