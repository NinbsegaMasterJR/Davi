import React from "react";
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

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(content);
      showSuccess("Conteudo copiado.");
    } catch (error) {
      void error;
      showError("Nao foi possivel copiar o conteudo.");
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
        showSuccess("Conteudo copiado com formatacao.");
        return;
      }

      await navigator.clipboard.writeText(content);
      showSuccess("Copiado em texto simples.");
    } catch (error) {
      void error;
      showError("Nao foi possivel copiar com formatacao.");
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
      showSuccess("Janela de impressao aberta.");
    } catch (error) {
      void error;
      showError("Nao foi possivel abrir a impressao.");
    }
  };

  return (
    <div className="tool-result">
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

      <div className="markdown-content tool-result-body">
        {contentType === "markdown" ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <pre>{content}</pre>
        )}
      </div>
    </div>
  );
};
