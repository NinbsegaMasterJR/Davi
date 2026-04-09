import React, { useState } from "react";
import {
  sermonAPI,
  BIBLE_VERSION_OPTIONS,
  type BibleVersion,
} from "../services/api";
import { useApp } from "../context/AppContext";
import { ResultPanel } from "./ResultPanel";
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

  const { showSuccess, showError, saveDocument } = useApp();
  const presets = [
    {
      label: "Serie familia",
      estilo: "Arminiana",
      temas: "Familia, educacao de filhos, restauracao do lar, alianca",
    },
    {
      label: "Serie avivamento",
      estilo: "Arminio-Wesleyana",
      temas: "Oracao, consagracao, arrependimento, poder do Espirito",
    },
    {
      label: "Serie discipulado",
      estilo: "Arminiana",
      temas: "Identidade em Cristo, servico, maturidade, missao",
    },
  ];

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
      saveDocument({
        toolId: "schedule",
        toolLabel: "Cronograma",
        title: `Cronograma: ${MESES[mes - 1]}/${ano}`,
        query: temas || `${MESES[mes - 1]}/${ano}`,
        summary: `${estilo} • ${versaoBiblica}`,
        content: response.data.cronograma,
        contentType: "markdown",
      });
      showSuccess("Cronograma gerado com sucesso!");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao gerar cronograma"));
    } finally {
      setCarregando(false);
    }
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

        <div className="preset-row" aria-label="Presets de cronograma">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="preset-chip"
              onClick={() => {
                setEstilo(preset.estilo);
                setTemas(preset.temas);
              }}
              disabled={carregando}
            >
              {preset.label}
            </button>
          ))}
        </div>

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
        <ResultPanel
          title={`Cronograma: ${MESES[mes - 1]}/${ano}`}
          content={resultado}
          contentType="markdown"
        />
      )}
    </div>
  );
};
