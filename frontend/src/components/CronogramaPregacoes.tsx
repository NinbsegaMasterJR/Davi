import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  sermonAPI,
  BIBLE_VERSION_OPTIONS,
  type BibleVersion,
} from "../services/api";
import { useApp } from "../context/AppContext";
import { getErrorMessage } from "../utils/httpError";
import "./CronogramaPregacoes.css";

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Marco",
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

const LINHAS_TEOLOGICAS = [
  "Arminiana",
  "Arminio-Wesleyana",
  "Calvinista",
  "Luterana",
];

export const CronogramaPregacoes: React.FC = () => {
  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth() + 1;

  const [mes, setMes] = useState(mesAtual);
  const [ano, setAno] = useState(anoAtual);
  const [estilo, setEstilo] = useState("Arminiana");
  const [versaoBiblica, setVersaoBiblica] = useState<BibleVersion>("ARA");
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
        versaoBiblica,
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
        <h2>Cronograma de Pregacoes</h2>
        <p className="subtitle">
          Organize o mes com temas, titulos e textos base para cada oportunidade
          de ministracao.
        </p>

        <div className="form-row-3 form-row-4">
          <div className="form-group">
            <label htmlFor="mes">Mes de planejamento:</label>
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
            <label htmlFor="estilo">Linha teologica:</label>
            <select
              id="estilo"
              value={estilo}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setEstilo(e.target.value)
              }
              disabled={carregando}
            >
              {LINHAS_TEOLOGICAS.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="versao-biblica-cronograma">Versao biblica:</label>
            <select
              id="versao-biblica-cronograma"
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

        <div className="form-group">
          <label htmlFor="temas">
            Temas sugeridos{" "}
            <span className="label-hint">
              (opcional, separados por virgula)
            </span>
          </label>
          <input
            id="temas"
            type="text"
            value={temas}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTemas(e.target.value)
            }
            placeholder="Ex: Fe perseverante, Familia, Avivamento, Graca..."
            disabled={carregando}
          />
        </div>

        <button
          onClick={gerarCronograma}
          disabled={carregando}
          className="btn-primary"
        >
          {carregando
            ? "Montando cronograma..."
            : `Gerar Cronograma de ${MESES[mes - 1]}/${ano}`}
        </button>
      </div>

      {resultado && (
        <div className="result-section">
          <div className="result-header">
            <h3>
              Cronograma de {MESES[mes - 1]}/{ano}
            </h3>
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
