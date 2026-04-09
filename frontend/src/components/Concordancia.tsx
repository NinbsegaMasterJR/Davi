import React, { useState } from "react";
import {
  concordanceAPI,
  BIBLE_VERSION_OPTIONS,
  type BibleVersion,
} from "../services/api";
import { useApp } from "../context/AppContext";
import { getErrorMessage } from "../utils/httpError";
import { formatVersesAsText } from "../utils/resultFormatting";
import "./Concordancia.css";

interface VersoResult {
  referencia: string;
  texto: string;
  versao?: string;
}

export const Concordancia: React.FC = () => {
  const [palavra, setPalavra] = useState("");
  const [limite, setLimite] = useState(10);
  const [versaoBiblica, setVersaoBiblica] = useState<BibleVersion>("ARA");
  const [resultados, setResultados] = useState<VersoResult[]>([]);
  const [totalResultados, setTotalResultados] = useState(0);
  const [carregando, setCarregando] = useState(false);

  const { showSuccess, showError, saveDocument } = useApp();

  const buscar = async () => {
    if (!palavra.trim()) {
      showError("Por favor, informe uma palavra para buscar");
      return;
    }

    setCarregando(true);
    try {
      const response = await concordanceAPI.search(
        palavra,
        limite,
        versaoBiblica,
      );
      setResultados(response.data.resultados);
      setTotalResultados(response.data.total);
      saveDocument({
        toolId: "concordance",
        toolLabel: "Concordancia",
        title: `Concordancia: ${palavra}`,
        query: palavra,
        summary: `${response.data.total} resultados em ${versaoBiblica}`,
        content: formatVersesAsText(
          `Concordancia: ${palavra}`,
          palavra,
          response.data.resultados,
        ),
        contentType: "text",
      });
      showSuccess(`${response.data.total} resultados encontrados!`);
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao buscar concordancia"));
    } finally {
      setCarregando(false);
    }
  };

  const copiarTodos = () => {
    const texto = resultados
      .map((r) => `${r.referencia}: "${r.texto}" (${r.versao || "ARA"})`)
      .join("\n\n");
    navigator.clipboard.writeText(texto);
    showSuccess("Todos os versiculos copiados!");
  };

  return (
    <div className="concordancia">
      <div className="search-section">
        <h2>Concordancia Biblica</h2>
        <p className="subtitle">
          Localize rapidamente textos ligados a uma palavra, tema ou ideia para
          fortalecer sua preparacao biblica.
        </p>

        <div className="form-row">
          <div className="form-group flex-grow">
            <label htmlFor="palavra">Palavra, tema ou conceito:</label>
            <input
              id="palavra"
              type="text"
              value={palavra}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPalavra(e.target.value)
              }
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              placeholder="Ex: amor, fe, graca, perdao, ressurreicao..."
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
              <option value={5}>5 versiculos</option>
              <option value={10}>10 versiculos</option>
              <option value={15}>15 versiculos</option>
              <option value={20}>20 versiculos</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="versao-biblica-concordancia">Versao biblica:</label>
            <select
              id="versao-biblica-concordancia"
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

        <button onClick={buscar} disabled={carregando} className="btn-search">
          {carregando ? "Buscando textos..." : "Buscar na Biblia"}
        </button>
      </div>

      {resultados.length > 0 && (
        <div className="results-section">
          <div className="tool-status tool-status-warn">
            <strong>Conferencia recomendada</strong>
            Use esta concordancia como ponto de partida e confirme citacoes e
            redacoes biblicas antes de publicar ou pregar.
          </div>
          <div className="results-header">
            <h3>
              Resultados para <em>"{palavra}"</em>
              <span className="badge">{totalResultados}</span>
            </h3>
            <button onClick={copiarTodos} className="btn-copy-all">
              Copiar Todos
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
                    showSuccess("Versiculo copiado!");
                  }}
                >
                  Copiar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
