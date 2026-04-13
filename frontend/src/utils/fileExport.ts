import type { SavedContentType } from "../types/library";
import { buildPrintableHtml } from "./resultFormatting";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function downloadContent(
  title: string,
  content: string,
  extension: "txt" | "md" | "html" | "json",
): void {
  const filename = `${slugify(title) || "scriptura-documento"}.${extension}`;
  const mimeType =
    extension === "html"
      ?"text/html;charset=utf-8"
      : extension === "json"
        ?"application/json;charset=utf-8"
        : "text/plain;charset=utf-8";

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function printContent(
  title: string,
  content: string,
  contentType: SavedContentType,
): void {
  const popup = window.open("", "_blank", "width=1024,height=768");
  if (!popup) {
    throw new Error("Não foi possível abrir a janela de impressão.");
  }

  popup.document.open();
  popup.document.write(buildPrintableHtml(title, content, contentType));
  popup.document.close();
  popup.focus();
  popup.print();
}
