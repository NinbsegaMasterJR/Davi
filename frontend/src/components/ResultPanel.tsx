import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useApp } from "../context/AppContext";
import type { SavedContentType } from "../types/library";
import { sermonAPI, type RefinementAction } from "../services/api";
import { downloadContent, printContent } from "../utils/fileExport";
import { buildClipboardHtml } from "../utils/resultFormatting";
import { getErrorMessage } from "../utils/httpError";

interface ResultPanelProps {
  title: string;
  content: string;
  contentType: SavedContentType;
  favorite?: boolean;
  onToggleFavorite?: () => void;
}

const REFINEMENT_ACTIONS: Array<{
  action: RefinementAction;
  label: string;
  summary: string;
}> = [
  {
    action: "encurtar",
    label: "Encurtar",
    summary: "Versão mais direta",
  },
  {
    action: "aprofundar",
    label: "Aprofundar",
    summary: "Mais contexto e aplicação",
  },
  {
    action: "jovens",
    label: "Para jovens",
    summary: "Linguagem mais próxima",
  },
  {
    action: "perguntas",
    label: "Perguntas GCEU",
    summary: "Discussão em grupo",
  },
  {
    action: "slides",
    label: "Roteiro de slides",
    summary: "Blocos para apresentação",
  },
];

export const ResultPanel: React.FC<ResultPanelProps> = ({
  title,
  content,
  contentType,
  favorite = false,
  onToggleFavorite,
}) => {
  const { showSuccess, showError, saveDocument } = useApp();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [activeContent, setActiveContent] = useState(content);
  const [activeContentType, setActiveContentType] =
    useState<SavedContentType>(contentType);
  const [refiningAction, setRefiningAction] =
    useState<RefinementAction | null>(null);

  useEffect(() => {
    setActiveContent(content);
    setActiveContentType(contentType);
  }, [content, contentType]);

  useEffect(() => {
    panelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [activeContent, title]);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(activeContent);
      showSuccess("Conteúdo copiado.");
    } catch (error) {
      void error;
      showError("Não foi possível copiar o conteúdo.");
    }
  };

  const copyFormatted = async () => {
    try {
      if ("ClipboardItem" in window) {
        const html = buildClipboardHtml(title, activeContent, activeContentType);
        const item = new ClipboardItem({
          "text/plain": new Blob([activeContent], { type: "text/plain" }),
          "text/html": new Blob([html], { type: "text/html" }),
        });
        await navigator.clipboard.write([item]);
        showSuccess("Conteúdo copiado com formatação.");
        return;
      }

      await navigator.clipboard.writeText(activeContent);
      showSuccess("Copiado em texto simples.");
    } catch (error) {
      void error;
      showError("Não foi possível copiar com formatação.");
    }
  };

  const handleDownload = (extension: "txt" | "md") => {
    downloadContent(title, activeContent, extension);
    showSuccess(`Arquivo .${extension} baixado.`);
  };

  const handleHtmlDownload = () => {
    const html = buildClipboardHtml(title, activeContent, activeContentType);
    downloadContent(title, html, "html");
    showSuccess("Arquivo .html baixado.");
  };

  const handlePrint = () => {
    try {
      printContent(title, activeContent, activeContentType);
      showSuccess("Janela de impressão aberta.");
    } catch (error) {
      void error;
      showError("Não foi possível abrir a impressão.");
    }
  };

  const handleRefine = async (action: RefinementAction) => {
    setRefiningAction(action);

    try {
      const response = await sermonAPI.refineMaterial(
        title,
        activeContent,
        action,
      );
      const refinedContent = response.data.refined;
      const refinement = REFINEMENT_ACTIONS.find(
        (item) => item.action === action,
      );

      setActiveContent(refinedContent);
      setActiveContentType("markdown");
      saveDocument({
        toolId: "refinement",
        toolLabel: "Refinamento",
        title: `${title} - ${refinement?.label ?? "nova versão"}`,
        query: title,
        summary: refinement?.summary ?? "Versão refinada",
        content: refinedContent,
        contentType: "markdown",
      });
      showSuccess("Nova versão gerada e salva na biblioteca.");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Não foi possível refinar agora."));
    } finally {
      setRefiningAction(null);
    }
  };

  return (
    <div className="tool-result" ref={panelRef}>
      <div className="tool-result-header">
        <div>
          <p className="tool-result-kicker">Resultado pronto para revisar</p>
          <h3>{title}</h3>
        </div>
        <div className="tool-result-actions">
          <button type="button" className="btn-copy" onClick={copyText}>
            Copiar
          </button>
          <button type="button" className="btn-copy" onClick={copyFormatted}>
            Copiar formatado
          </button>
          <button type="button" className="btn-copy" onClick={() => handleDownload("md")}>
            Baixar .md
          </button>
          <button type="button" className="btn-copy" onClick={() => handleDownload("txt")}>
            Baixar .txt
          </button>
          <button type="button" className="btn-copy" onClick={handleHtmlDownload}>
            Baixar .html
          </button>
          <button type="button" className="btn-copy" onClick={handlePrint}>
            Imprimir / PDF
          </button>
          {onToggleFavorite && (
            <button type="button" className="btn-copy" onClick={onToggleFavorite}>
              {favorite ? "Remover favorito" : "Favoritar"}
            </button>
          )}
        </div>
      </div>

      <div className="tool-panel-note">
        <strong>Próximo passo sugerido</strong>
        Revise o texto, ajuste ao contexto da igreja e use os atalhos abaixo para copiar, exportar ou imprimir. Este resultado também fica salvo automaticamente na biblioteca local deste navegador.
      </div>

      <div className="tool-review-grid">
        <div className="tool-review-card strong">
          <span>Conferência bíblica</span>
          <strong>Antes de ministrar</strong>
          <p>Confirme referências, leia o contexto imediato e ajuste a aplicação à sua igreja local.</p>
        </div>
        <div className="tool-review-card">
          <span>Doutrina e tom</span>
          <strong>Revise com critério</strong>
          <p>Compare a resposta com sua linha teológica, objetivo pastoral e sensibilidade do momento.</p>
        </div>
        <div className="tool-review-card">
          <span>Nova versão</span>
          <strong>Refine sem recomeçar</strong>
          <p>Use os botões abaixo para adaptar o material mantendo o rascunho original salvo.</p>
        </div>
      </div>

      <div className="tool-refinement-panel">
        <div>
          <p className="tool-result-kicker">Ajustes rápidos</p>
          <strong>Transforme este resultado em uma nova versão</strong>
        </div>
        <div className="tool-refinement-actions">
          {REFINEMENT_ACTIONS.map((item) => (
            <button
              key={item.action}
              type="button"
              className="btn-copy"
              onClick={() => void handleRefine(item.action)}
              disabled={Boolean(refiningAction)}
            >
              {refiningAction === item.action ? "Gerando..." : item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="markdown-content tool-result-body" aria-live="polite">
        {activeContentType === "markdown" ? (
          <ReactMarkdown>{activeContent}</ReactMarkdown>
        ) : (
          <pre>{activeContent}</pre>
        )}
      </div>
    </div>
  );
};
