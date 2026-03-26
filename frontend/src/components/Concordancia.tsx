import React, { useState } from "react";
import { concordanceAPI } from "../services/api";
import { useApp } from "../context/AppContext";
import { getErrorMessage } from "../utils/httpError";
import "./Concordancia.css";

interface VersoResult {
  referencia: string;
  texto: string;
  versao?: string;
}

export const Concordancia: React.FC = () => {
  const [palavra, setPalavra] = useState("");
  const [limite, setLimite] = useState(10);
  const [resultados, setResultados] = useState<VersoResult[]>([]);
  const [totalResultados, setTotalResultados] = useState(0);
  const [carregando, setCarregando] = useState(false);

  const { showSuccess, showError } = useApp();

  const buscar = async () => {
    if (!palavra.trim()) {
      showError("Por favor, informe uma palavra para buscar");
      return;
    }

    setCarregando(true);
    try {
      const response = await concordanceAPI.search(palavra, limite);
      setResultados(response.data.resultados);
      setTotalResultados(response.data.total);
      showSuccess(`${response.data.total} resultados encontrados!`);
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao buscar concordância"));
    } finally {
      setCarregando(false);
    }
  };

  const copiarTodos = () => {
    const texto = resultados
      .map((r) => `${r.referencia}: "${r.texto}" (${r.versao || "ARA"})`)
      .join("\n\n");
    navigator.clipboard.writeText(texto);
    showSuccess("Todos os versículos copiados!");
  };

  return (
    <div className="concordancia">
      <div className="search-section">
        <h2>📚 Concordância Bíblica</h2>
        <p className="subtitle">
          Encontre todos os versículos bíblicos que contêm ou se relacionam com
          uma palavra ou conceito específico.
        </p>

        <div className="form-row">
          <div className="form-group flex-grow">
            <label htmlFor="palavra">Palavra ou Conceito:</label>
            <input
              id="palavra"
              type="text"
              value={palavra}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPalavra(e.target.value)
              }
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              placeholder="Ex: amor, fé, graça, perdão, ressurreição..."
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="limite">Quantidade:</label>
            <select
              id="limite"
              value={limite}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setLimite(Number(e.target.value))
              }
              disabled={carregando}
            >
              <option value={5}>5 versículos</option>
              <option value={10}>10 versículos</option>
              <option value={15}>15 versículos</option>
              <option value={20}>20 versículos</option>
            </select>
          </div>
        </div>

        <button onClick={buscar} disabled={carregando} className="btn-search">
          {carregando ? "🔍 Buscando..." : "🔍 Buscar na Bíblia"}
        </button>
      </div>

      {resultados.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h3>
              📖 Resultados para: <em>"{palavra}"</em>
              <span className="badge">{totalResultados}</span>
            </h3>
            <button onClick={copiarTodos} className="btn-copy-all">
              📋 Copiar Todos
            </button>
          </div>

          <div className="verses-grid">
            {resultados.map((verso, index) => (
              <div key={index} className="verso-card">
                <div className="verso-header">
                  <span className="verso-ref">{verso.referencia}</span>
                  {verso.versao && (
                    <span className="verso-version">{verso.versao}</span>
                  )}
                </div>
                <p className="verso-text">"{verso.texto}"</p>
                <button
                  className="btn-copy-single"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${verso.referencia}: "${verso.texto}"`,
                    );
                    showSuccess("Versículo copiado!");
                  }}
                >
                  📋 Copiar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
