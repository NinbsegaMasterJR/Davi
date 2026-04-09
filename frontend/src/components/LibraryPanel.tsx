import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { ResultPanel } from "./ResultPanel";

export const LibraryPanel: React.FC = () => {
  const { library, toggleFavorite, removeDocument, clearLibrary } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(library[0]?.id ?? null);
  const [mode, setMode] = useState<"recent" | "favorites">("recent");

  const visibleItems = useMemo(() => {
    const items = mode === "favorites" ? library.filter((item) => item.favorite) : library;
    return items.slice(0, 8);
  }, [library, mode]);

  const selected =
    visibleItems.find((item) => item.id === selectedId) ?? visibleItems[0] ?? null;

  return (
    <section className="library-panel">
      <div className="library-header">
        <div>
          <p className="section-kicker">Biblioteca local</p>
          <h2>Recentes e favoritos</h2>
          <p>
            O navegador guarda seus resultados mais recentes para retomar ideias,
            copiar trechos e exportar sem gerar tudo de novo.
          </p>
        </div>
        <div className="library-controls">
          <button
            type="button"
            className={`library-filter ${mode === "recent" ? "active" : ""}`}
            onClick={() => setMode("recent")}
          >
            Recentes
          </button>
          <button
            type="button"
            className={`library-filter ${mode === "favorites" ? "active" : ""}`}
            onClick={() => setMode("favorites")}
          >
            Favoritos
          </button>
          <button type="button" className="library-clear" onClick={clearLibrary}>
            Limpar tudo
          </button>
        </div>
      </div>

      {visibleItems.length === 0 ? (
        <div className="library-empty">
          <h3>Nada salvo ainda</h3>
          <p>
            Gere um esboco, uma analise ou uma lista de versiculos e o conteudo
            aparecera aqui automaticamente.
          </p>
        </div>
      ) : (
        <div className="library-grid">
          <div className="library-list">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`library-item ${selected?.id === item.id ? "active" : ""}`}
                onClick={() => setSelectedId(item.id)}
              >
                <span className="library-item-tool">{item.toolLabel}</span>
                <strong>{item.title}</strong>
                <span>{item.summary || item.query}</span>
                <small>{new Date(item.createdAt).toLocaleString("pt-BR")}</small>
              </button>
            ))}
          </div>

          {selected && (
            <div className="library-preview">
              <div className="library-preview-actions">
                <button type="button" className="btn-copy" onClick={() => toggleFavorite(selected.id)}>
                  {selected.favorite ? "Remover favorito" : "Favoritar"}
                </button>
                <button type="button" className="btn-copy" onClick={() => removeDocument(selected.id)}>
                  Excluir
                </button>
              </div>
              <ResultPanel
                title={selected.title}
                content={selected.content}
                contentType={selected.contentType}
                favorite={selected.favorite}
                onToggleFavorite={() => toggleFavorite(selected.id)}
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
};
