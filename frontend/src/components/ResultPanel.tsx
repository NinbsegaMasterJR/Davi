import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useApp } from "../context/AppContext";
import type { SavedContentType } from "../types/library";
import { downloadContent, printContent } from "../utils/fileExport";
import { buildClipboardHtml } from "../utils/resultFormatting";

interface ResultPanelProps {
  title: string;
  content: string;
  contentType: SavedContentType;
  favorite?: boolean;
  onToggleFavorite?: () => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  title,
  content,
  contentType,
  favorite = false,
  onToggleFavorite,
}) => {
  const { showSuccess, showError } = useApp();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    panelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [content, title]);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(content);
      showSuccess("Conteúdo copiado.");
    } catch (error) {
      void error;
      showError("Não foi possível copiar o conteúdo.");
    }
  };

  const copyFormatted = async () => {
    try {
      if ("ClipboardItem" in window) {
        const html = buildClipboardHtml(title, content, contentType);
        const item = new ClipboardItem({
          "text/plain": new Blob([content], { type: "text/plain" }),
          "text/html": new Blob([html], { type: "text/html" }),
        });
        await navigator.clipboard.write([item]);
        showSuccess("Conteúdo copiado com formatação.");
        return;
      }

      await navigator.clipboard.writeText(content);
      showSuccess("Copiado em texto simples.");
    } catch (error) {
      void error;
      showError("Não foi possível copiar com formatação.");
    }
  };

  const handleDownload = (extension: "txt" | "md") => {
    downloadContent(title, content, extension);
    showSuccess(`Arquivo .${extension} baixado.`);
  };

  const handleHtmlDownload = () => {
    const html = buildClipboardHtml(title, content, contentType);
    downloadContent(title, html, "html");
    showSuccess("Arquivo .html baixado.");
  };

  const handlePrint = () => {
    try {
      printContent(title, content, contentType);
      showSuccess("Janela de impressão aberta.");
    } catch (error) {
      void error;
      showError("Não foi possível abrir a impressão.");
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

      <div className="markdown-content tool-result-body" aria-live="polite">
        {contentType === "markdown" ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <pre>{content}</pre>
        )}
      </div>
    </div>
  );
};
