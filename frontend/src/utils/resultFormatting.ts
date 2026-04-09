import type { SavedContentType } from "../types/library";
import type { Versiculo } from "../services/api";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatVersesAsText(
  title: string,
  topic: string,
  verses: Versiculo[],
): string {
  return [
    title,
    topic ? `Consulta: ${topic}` : "",
    "",
    ...verses.map((verse) =>
      `${verse.referencia}\n${verse.texto}${
        verse.versao ? `\nVersao: ${verse.versao}` : ""
      }`,
    ),
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function buildPrintableHtml(
  title: string,
  content: string,
  contentType: SavedContentType,
): string {
  const renderedContent =
    contentType === "markdown"
      ? renderBasicMarkdown(content)
      : `<pre>${escapeHtml(content)}</pre>`;

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      body {
        font-family: Georgia, "Times New Roman", serif;
        color: #24130d;
        margin: 32px;
        line-height: 1.6;
      }
      h1, h2, h3, h4 {
        color: #7f1d1d;
      }
      pre {
        white-space: pre-wrap;
        background: #f8f1e3;
        padding: 16px;
        border-radius: 12px;
      }
      blockquote {
        margin: 1rem 0;
        padding-left: 1rem;
        border-left: 4px solid #f6c667;
        color: #5d4033;
      }
      li {
        margin-bottom: 0.35rem;
      }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    ${renderedContent}
  </body>
</html>`;
}

export function buildClipboardHtml(
  title: string,
  content: string,
  contentType: SavedContentType,
): string {
  const body =
    contentType === "markdown"
      ? renderBasicMarkdown(content)
      : `<pre>${escapeHtml(content)}</pre>`;

  return `<section><h1>${escapeHtml(title)}</h1>${body}</section>`;
}

function renderBasicMarkdown(content: string): string {
  const escaped = escapeHtml(content);
  const lines = escaped.split("\n");
  const html: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      continue;
    }

    if (trimmed.startsWith("# ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h1>${inlineMarkdown(trimmed.slice(2))}</h1>`);
      continue;
    }

    if (trimmed.startsWith("## ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`);
      continue;
    }

    if (trimmed.startsWith("### ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`);
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(trimmed.slice(2))}</li>`);
      continue;
    }

    if (inList) {
      html.push("</ul>");
      inList = false;
    }

    if (trimmed.startsWith("> ")) {
      html.push(`<blockquote>${inlineMarkdown(trimmed.slice(2))}</blockquote>`);
      continue;
    }

    html.push(`<p>${inlineMarkdown(trimmed)}</p>`);
  }

  if (inList) {
    html.push("</ul>");
  }

  return html.join("");
}

function inlineMarkdown(value: string): string {
  return value
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}
