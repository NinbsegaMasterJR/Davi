import React, { useMemo, useState } from "react";
import {
  sermonAPI,
  BIBLE_VERSION_OPTIONS,
  type BibleVersion,
} from "../services/api";
import { useApp } from "../context/AppContext";
import { useToolDraft } from "../hooks/useToolDraft";
import { ResultPanel } from "./ResultPanel";
import { ToolDraftBar } from "./ToolDraftBar";
import { getErrorMessage } from "../utils/httpError";
import "./CronogramaPregacoes.css";

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

const LINHAS_TEOLOGICAS = [
  "Arminiana",
  "Armínio-Wesleyana",
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
  const [jaGerou, setJaGerou] = useState(false);

  const { showSuccess, showError, saveDocument } = useApp();
  const draftValues = useMemo(
    () => ({
      mes,
      ano,
      estilo,
      versaoBiblica,
      temas,
    }),
    [ano, estilo, mes, temas, versaoBiblica],
  );
  const { draftUpdatedAt, hasDraft, clearSavedDraft } = useToolDraft({
    toolId: "schedule",
    toolLabel: "Cronograma",
    title: `Cronograma: ${MESES[mes - 1]}/${ano}`,
    summary: `${estilo} | ${versaoBiblica}`,
    values: draftValues,
    onRestore: (draft) => {
      setMes(
        typeof draft.mes === "number" ?draft.mes : Number(draft.mes) || mesAtual,
      );
      setAno(
        typeof draft.ano === "number" ?draft.ano : Number(draft.ano) || anoAtual,
      );
      setEstilo(typeof draft.estilo === "string" ?draft.estilo : "Arminiana");
      setVersaoBiblica(
        typeof draft.versaoBiblica === "string"
          ?(draft.versaoBiblica as BibleVersion)
          : "ARA",
      );
      setTemas(typeof draft.temas === "string" ?draft.temas : "");
    },
  });
  const presets = [
    {
      label: "Série família",
      estilo: "Arminiana",
      temas: "Família, educação de filhos, restauração do lar, aliança",
    },
    {
      label: "Série avivamento",
      estilo: "Armínio-Wesleyana",
      temas: "Oração, consagração, arrependimento, poder do Espírito",
    },
    {
      label: "Série discipulado",
      estilo: "Arminiana",
      temas: "Identidade em Cristo, serviço, maturidade, missão",
    },
    {
      label: "Série oração",
      estilo: "Arminio-Wesleyana",
      temas: "Dependência de Deus, intercessão, perseverança, gratidão",
    },
    {
      label: "Série jovens",
      estilo: "Arminiana",
      temas: "Identidade, santidade, propósito, relacionamentos",
    },
    {
      label: "Série liderança",
      estilo: "Arminiana",
      temas: "Serviço, caráter, visão, cuidado pastoral",
    },
  ];

  const gerarCronograma = async () => {
    setJaGerou(true);
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
        <h2>Cronograma de Pregações</h2>
        <p className="subtitle">
          Organize o mês com temas, títulos e textos base para cada oportunidade
          de ministração.
        </p>

        <div className="tool-context-grid">
          <div className="tool-context-card">
            <span>Ideal para</span>
            <strong>Planejamento ministerial</strong>
            <p>Excelente para organizar sequência de domingos, séries curtas e frentes de ensino.</p>
          </div>
          <div className="tool-context-card">
            <span>Entrega</span>
            <strong>Calendário coerente</strong>
            <p>Ajuda a distribuir temas com ritmo, variedade e alinhamento teológico ao longo do mês.</p>
          </div>
          <div className="tool-context-card">
            <span>Revisão</span>
            <strong>Ajuste a agenda real</strong>
            <p>Considere santa ceia, conferências, convidados e calendário da igreja antes de fechar.</p>
          </div>
        </div>

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
            <label htmlFor="mes">Mês de planejamento:</label>
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
            <label htmlFor="estilo">Linha teológica:</label>
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
            <label htmlFor="versao-biblica-cronograma">Versão bíblica:</label>
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
              (opcional, separados por vírgula)
            </span>
          </label>
          <input
            id="temas"
            type="text"
            value={temas}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTemas(e.target.value)
            }
            placeholder="Ex: Fé perseverante, Família, Avivamento, Graça..."
            disabled={carregando}
          />
        </div>

        <div className="tool-helper-row">
          <span className="tool-helper-chip">Ajuda a evitar repetição de temas</span>
          <span className="tool-helper-chip">Bom para séries mensais e domingos seguidos</span>
          <span className="tool-helper-chip">Depois ajuste com o calendário real da igreja</span>
        </div>

        <ToolDraftBar
          hasDraft={hasDraft}
          draftUpdatedAt={draftUpdatedAt}
          note="Mês, ano, linha teológica e ideias de série ficam guardados para você continuar o planejamento"
          onClearDraft={clearSavedDraft}
        />

        <button
          onClick={gerarCronograma}
          disabled={carregando}
          className="btn-primary"
        >
          {carregando
            ?"Montando cronograma..."
            : `Gerar Cronograma de ${MESES[mes - 1]}/${ano}`}
        </button>

        <div className="tool-feedback-stack" aria-live="polite">
          {carregando ?(
            <div className="tool-state-card loading">
              <span className="tool-state-kicker">Planejamento em andamento</span>
              <strong>Distribuindo temas e textos ao longo do período</strong>
              <p>
                Estou organizando o mês para equilibrar ritmo, foco ministerial
                e coerência entre os domingos.
              </p>
              <div className="tool-state-points">
                <span>Sequência mensal</span>
                <span>Variedade de temas</span>
                <span>Texto base sugerido</span>
              </div>
            </div>
          ) : !resultado ?(
            <div className="tool-state-card empty">
              <span className="tool-state-kicker">
                {jaGerou ?"Pronto para replanejar" : "Antes de montar o cronograma"}
              </span>
              <strong>
                {jaGerou
                  ?"Troque o mês, a linha teológica ou os temas sugeridos para gerar outra versão."
                  : "Escolha o mês e, se quiser, indique alguns eixos temáticos para guiar a série."}
              </strong>
              <p>
                Quanto mais claro for o objetivo do período, mais útil fica o
                cronograma para o seu calendário ministerial.
              </p>
            </div>
          ) : null}
        </div>
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
