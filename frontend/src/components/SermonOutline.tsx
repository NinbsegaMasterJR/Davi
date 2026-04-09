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
import "./SermonOutline.css";

export const SermonOutline: React.FC = () => {
  const [tema, setTema] = useState("");
  const [estilo, setEstilo] = useState("Arminiana");
  const [duracao, setDuracao] = useState(30);
  const [versaoBiblica, setVersaoBiblica] = useState<BibleVersion>("ARA");
  const [incluirExegese, setIncluirExegese] = useState(false);
  const [incluirIlustracao, setIncluirIlustracao] = useState(false);
  const [incluirAplicacaoPratica, setIncluirAplicacaoPratica] =
    useState(false);
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [jaGerou, setJaGerou] = useState(false);

  const { showSuccess, showError, saveDocument } = useApp();
  const draftValues = useMemo(
    () => ({
      tema,
      estilo,
      duracao,
      versaoBiblica,
      incluirExegese,
      incluirIlustracao,
      incluirAplicacaoPratica,
    }),
    [
      duracao,
      estilo,
      incluirAplicacaoPratica,
      incluirExegese,
      incluirIlustracao,
      tema,
      versaoBiblica,
    ],
  );
  const { draftUpdatedAt, hasDraft, clearSavedDraft } = useToolDraft({
    toolId: "outline",
    toolLabel: "Esboço",
    title: tema.trim() ? `Esboço: ${tema}` : "Esboço em andamento",
    summary: `${estilo} | ${duracao} min | ${versaoBiblica}`,
    values: draftValues,
    onRestore: (draft) => {
      setTema(typeof draft.tema === "string" ? draft.tema : "");
      setEstilo(typeof draft.estilo === "string" ? draft.estilo : "Arminiana");
      setDuracao(
        typeof draft.duracao === "number"
          ? draft.duracao
          : Number(draft.duracao) || 30,
      );
      setVersaoBiblica(
        typeof draft.versaoBiblica === "string"
          ? (draft.versaoBiblica as BibleVersion)
          : "ARA",
      );
      setIncluirExegese(Boolean(draft.incluirExegese));
      setIncluirIlustracao(Boolean(draft.incluirIlustracao));
      setIncluirAplicacaoPratica(Boolean(draft.incluirAplicacaoPratica));
    },
  });
  const presets = [
    {
      label: "Culto de domingo",
      tema: "Fé que persevera",
      estilo: "Arminiana",
      duracao: 35,
      exegese: true,
      ilustracao: true,
      aplicacaoPratica: true,
    },
    {
      label: "Escola bíblica",
      tema: "Santificação na vida cristã",
      estilo: "Arminio-Wesleyana",
      duracao: 45,
      exegese: true,
      ilustracao: false,
      aplicacaoPratica: true,
    },
    {
      label: "Culto jovem",
      tema: "Chamado e identidade em Cristo",
      estilo: "Arminiana",
      duracao: 30,
      exegese: false,
      ilustracao: true,
      aplicacaoPratica: true,
    },
  ];

  const gerar = async () => {
    if (!tema.trim()) {
      showError("Por favor, digite um tema");
      return;
    }

    setJaGerou(true);
    setCarregando(true);
    try {
      const response = await sermonAPI.generateOutline(
        tema,
        estilo,
        duracao,
        versaoBiblica,
        {
          exegese: incluirExegese,
          ilustracao: incluirIlustracao,
          aplicacaoPratica: incluirAplicacaoPratica,
        },
      );
      setResultado(response.data.esboco);
      saveDocument({
        toolId: "outline",
        toolLabel: "Esboço",
        title: `Esboço: ${tema}`,
        query: tema,
        summary: `${estilo} • ${duracao} min • ${versaoBiblica}`,
        content: response.data.esboco,
        contentType: "markdown",
      });
      showSuccess("Esboço gerado com sucesso!");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao gerar esboço"));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="sermon-outline">
      <div className="input-section">
        <h2>Gerar Esboço de Pregação</h2>
        <p className="feature-highlight">
          Monte uma base de mensagem com estrutura clara e escolha quais seções
          complementares deseja incluir antes de gerar.
        </p>

        <div className="tool-context-grid">
          <div className="tool-context-card">
            <span>Ideal para</span>
            <strong>Quando o tema já existe</strong>
            <p>Transforma uma intuição ministerial em fluxo pregável com mais rapidez.</p>
          </div>
          <div className="tool-context-card">
            <span>Entrega</span>
            <strong>Estrutura pronta para lapidar</strong>
            <p>Título, texto base, desenvolvimento, conclusão e apoio bíblico no mesmo rascunho.</p>
          </div>
          <div className="tool-context-card">
            <span>Revisão</span>
            <strong>Conferência pastoral</strong>
            <p>Use o resultado como base e ajuste tom, referências e aplicação à sua igreja.</p>
          </div>
        </div>

        <div className="preset-row" aria-label="Presets de esboço">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="preset-chip"
              onClick={() => {
                setTema(preset.tema);
                setEstilo(preset.estilo);
                setDuracao(preset.duracao);
                setIncluirExegese(preset.exegese);
                setIncluirIlustracao(preset.ilustracao);
                setIncluirAplicacaoPratica(preset.aplicacaoPratica);
              }}
              disabled={carregando}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="tema">Tema ou enfoque da mensagem:</label>
          <input
            id="tema"
            type="text"
            value={tema}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTema(e.target.value)
            }
            placeholder="Ex: Fé que persevera, Graça redentora, Chamado ao arrependimento..."
            disabled={carregando}
          />
        </div>

        <div className="form-row form-row-3">
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
              <option value="Arminiana">Arminiana</option>
              <option value="Arminio-Wesleyana">Armínio-Wesleyana</option>
              <option value="Calvinista">Calvinista</option>
              <option value="Luterana">Luterana</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="duracao">Duração estimada (min):</label>
            <input
              id="duracao"
              type="number"
              value={duracao}
              onChange={(e) => setDuracao(Number(e.target.value))}
              min="15"
              max="120"
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="versao-biblica-esboco">Versão bíblica:</label>
            <select
              id="versao-biblica-esboco"
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

        <div className="options-section">
          <p className="options-title">Seções opcionais para enriquecer o esboço</p>

          <label className="option-item">
            <input
              type="checkbox"
              checked={incluirExegese}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIncluirExegese(e.target.checked)
              }
              disabled={carregando}
            />
            <span>Incluir exegese do texto base</span>
          </label>

          <label className="option-item">
            <input
              type="checkbox"
              checked={incluirIlustracao}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIncluirIlustracao(e.target.checked)
              }
              disabled={carregando}
            />
            <span>Incluir ilustração para o momento da mensagem</span>
          </label>

          <label className="option-item">
            <input
              type="checkbox"
              checked={incluirAplicacaoPratica}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIncluirAplicacaoPratica(e.target.checked)
              }
              disabled={carregando}
            />
            <span>Incluir aplicação prática para a igreja</span>
          </label>
        </div>

        <div className="tool-helper-row">
          <span className="tool-helper-chip">Salva automaticamente na biblioteca local</span>
          <span className="tool-helper-chip">Bom para sair da página em branco</span>
          <span className="tool-helper-chip">Depois você pode exportar em markdown, HTML ou PDF</span>
        </div>

        <ToolDraftBar
          hasDraft={hasDraft}
          draftUpdatedAt={draftUpdatedAt}
          note="Tema, linha teológica e seções opcionais ficam guardados neste navegador"
          onClearDraft={clearSavedDraft}
        />

        <button onClick={gerar} disabled={carregando} className="btn-primary">
          {carregando ? "Gerando estrutura..." : "Gerar Esboço"}
        </button>

        <div className="tool-feedback-stack" aria-live="polite">
          {carregando ? (
            <div className="tool-state-card loading">
              <span className="tool-state-kicker">Gerando esboço</span>
              <strong>Montando a estrutura principal da mensagem</strong>
              <p>
                Estou organizando título, texto base, desenvolvimento e
                aplicações para te devolver um rascunho mais pregável.
              </p>
              <div className="tool-state-points">
                <span>Estrutura da mensagem</span>
                <span>Base bíblica</span>
                <span>Seções opcionais</span>
              </div>
            </div>
          ) : !resultado ? (
            <div className="tool-state-card empty">
              <span className="tool-state-kicker">
                {jaGerou ? "Pronto para nova tentativa" : "Antes de gerar"}
              </span>
              <strong>
                {jaGerou
                  ? "Você pode ajustar o tema ou as seções e gerar novamente."
                  : "Defina o tema, a linha teológica e as seções que quer incluir."}
              </strong>
              <p>
                Um bom ponto de partida costuma ser um tema curto, uma duração
                realista e pelo menos uma decisão clara sobre exegese,
                ilustração ou aplicação prática.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {resultado && (
        <ResultPanel
          title={`Esboço: ${tema}`}
          content={resultado}
          contentType="markdown"
        />
      )}
    </div>
  );
};
