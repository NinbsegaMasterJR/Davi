import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  sermonAPI,
  BIBLE_VERSION_OPTIONS,
  type BibleVersion,
} from "../services/api";
import { useApp } from "../context/AppContext";
import { getErrorMessage } from "../utils/httpError";
import "./SermonOutline.css";

export const SermonOutline: React.FC = () => {
  const [tema, setTema] = useState("");
  const [estilo, setEstilo] = useState("Pentecostal");
  const [duracao, setDuracao] = useState(30);
  const [versaoBiblica, setVersaoBiblica] = useState<BibleVersion>("ARA");
  const [incluirExegese, setIncluirExegese] = useState(false);
  const [incluirIlustracao, setIncluirIlustracao] = useState(false);
  const [incluirAplicacaoPratica, setIncluirAplicacaoPratica] =
    useState(false);
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { showSuccess, showError } = useApp();

  const gerar = async () => {
    if (!tema.trim()) {
      showError("Por favor, digite um tema");
      return;
    }

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
      showSuccess("Esboco gerado com sucesso!");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao gerar esboco"));
    } finally {
      setCarregando(false);
    }
  };

  const copiar = () => {
    navigator.clipboard.writeText(resultado);
    showSuccess("Copiado para a area de transferencia!");
  };

  return (
    <div className="sermon-outline">
      <div className="input-section">
        <h2>Gerar Esboco de Pregacao</h2>
        <p className="feature-highlight">
          Monte uma base de mensagem com estrutura clara e escolha quais secoes
          complementares deseja incluir antes de gerar.
        </p>

        <div className="form-group">
          <label htmlFor="tema">Tema ou enfoque da mensagem:</label>
          <input
            id="tema"
            type="text"
            value={tema}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTema(e.target.value)
            }
            placeholder="Ex: Fe que persevera, Graca redentora, Chamado ao arrependimento..."
            disabled={carregando}
          />
        </div>

        <div className="form-row form-row-3">
          <div className="form-group">
            <label htmlFor="estilo">Linha ou contexto ministerial:</label>
            <select
              id="estilo"
              value={estilo}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setEstilo(e.target.value)
              }
              disabled={carregando}
            >
              <option>Pentecostal</option>
              <option>Assembleia de Deus</option>
              <option>Foursquare</option>
              <option>Evangelica Generica</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="duracao">Duracao estimada (min):</label>
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
            <label htmlFor="versao-biblica-esboco">Versao biblica:</label>
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
          <p className="options-title">Secoes opcionais para enriquecer o esboco</p>

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
            <span>Incluir ilustracao para o momento da mensagem</span>
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
            <span>Incluir aplicacao pratica para a igreja</span>
          </label>
        </div>

        <button onClick={gerar} disabled={carregando} className="btn-primary">
          {carregando ? "Gerando estrutura..." : "Gerar Esboco"}
        </button>
      </div>

      {resultado && (
        <div className="result-section">
          <div className="result-header">
            <h3>Esboco gerado:</h3>
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
