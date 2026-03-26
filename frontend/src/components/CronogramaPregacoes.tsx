import React, { useState } from "react";
import { sermonAPI } from "../services/api";
import { useApp } from "../context/AppContext";
import { getErrorMessage } from "../utils/httpError";
import "./CronogramaPregacoes.css";
import ReactMarkdown from "react-markdown";

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const ESTILOS = [
  "Pentecostal",
  "Assembléia de Deus",
  "Foursquare",
  "Evangélica Genérica",
  "Batista",
  "Presbiteriana",
];

export const CronogramaPregacoes: React.FC = () => {
  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth() + 1;

  const [mes, setMes] = useState(mesAtual);
  const [ano, setAno] = useState(anoAtual);
  const [estilo, setEstilo] = useState("Pentecostal");
  const [temas, setTemas] = useState("");
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { showSuccess, showError } = useApp();

  const gerarCronograma = async () => {
    setCarregando(true);
    try {
      const temasArray = temas
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const response = await sermonAPI.createSchedule(
        mes,
        ano,
        temasArray,
        estilo,
      );
      setResultado(response.data.cronograma);
      showSuccess("Cronograma gerado com sucesso!");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao gerar cronograma"));
    } finally {
      setCarregando(false);
    }
  };

  const copiar = () => {
    navigator.clipboard.writeText(resultado);
    showSuccess("Cronograma copiado!");
  };

  const anosDisponiveis = Array.from({ length: 5 }, (_, i) => anoAtual + i - 1);

  return (
    <div className="cronograma-pregacoes">
      <div className="input-section">
        <h2>📅 Cronograma de Pregações</h2>
        <p className="subtitle">
          Gere um cronograma completo de pregações para o mês, com temas,
          títulos e versículos base para cada domingo.
        </p>

        <div className="form-row-3">
          <div className="form-group">
            <label htmlFor="mes">Mês:</label>
            <select
              id="mes"
              value={mes}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setMes(Number(e.target.value))
              }
              disabled={carregando}
            >
              {MESES.map((nome, i) => (
                <option key={i + 1} value={i + 1}>
                  {nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ano">Ano:</label>
            <select
              id="ano"
              value={ano}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setAno(Number(e.target.value))
              }
              disabled={carregando}
            >
              {anosDisponiveis.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="estilo">Estilo:</label>
            <select
              id="estilo"
              value={estilo}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setEstilo(e.target.value)
              }
              disabled={carregando}
            >
              {ESTILOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="temas">
            Temas sugeridos{" "}
            <span className="label-hint">
              (opcional — separados por vírgula)
            </span>
          </label>
          <input
            id="temas"
            type="text"
            value={temas}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTemas(e.target.value)
            }
            placeholder="Ex: Fé, Esperança, Amor, Perdão..."
            disabled={carregando}
          />
        </div>

        <button
          onClick={gerarCronograma}
          disabled={carregando}
          className="btn-primary"
        >
          {carregando
            ? "⏳ Gerando cronograma..."
            : `📅 Gerar Cronograma de ${MESES[mes - 1]}/${ano}`}
        </button>
      </div>

      {resultado && (
        <div className="result-section">
          <div className="result-header">
            <h3>
              📋 Cronograma: {MESES[mes - 1]}/{ano}
            </h3>
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
