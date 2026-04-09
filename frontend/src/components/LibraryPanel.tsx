import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { ResultPanel } from "./ResultPanel";

export const LibraryPanel: React.FC = () => {
  const { library, drafts, toggleFavorite, removeDocument, clearLibrary } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(library[0]?.id ?? null);
  const [mode, setMode] = useState<"recent" | "favorites">("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [toolFilter, setToolFilter] = useState<string>("all");

  const toolOptions = useMemo(() => {
    const entries = new Map<string, string>();

    library.forEach((item) => {
      entries.set(item.toolId, item.toolLabel);
    });

    return Array.from(entries.entries()).map(([toolId, toolLabel]) => ({
      toolId,
      toolLabel,
    }));
  }, [library]);

  const visibleItems = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    let items =
      mode === "favorites" ? library.filter((item) => item.favorite) : library;

    if (toolFilter !== "all") {
      items = items.filter((item) => item.toolId === toolFilter);
    }

    if (normalizedSearch) {
      items = items.filter((item) =>
        [item.title, item.query, item.summary, item.toolLabel]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearch),
          ),
      );
    }

    return items.slice(0, 12);
  }, [library, mode, searchQuery, toolFilter]);

  useEffect(() => {
    if (!visibleItems.some((item) => item.id === selectedId)) {
      setSelectedId(visibleItems[0]?.id ?? null);
    }
  }, [selectedId, visibleItems]);

  const selected =
    visibleItems.find((item) => item.id === selectedId) ?? visibleItems[0] ?? null;
  const latestDraft = drafts[0] ?? null;

  return (
    <section className="library-panel" id="biblioteca-local">
      <div className="library-header">
        <div>
          <p className="section-kicker">Biblioteca local</p>
          <h2>Histórico, filtros e retomada</h2>
          <p>
            O navegador guarda resultados e rascunhos para retomar ideias,
            pesquisar o histórico e voltar ao estudo sem recomeçar do zero.
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

      <div className="library-summary-grid">
        <div className="library-summary-card">
          <span>Itens salvos</span>
          <strong>{library.length}</strong>
          <small>Resultados disponíveis neste navegador</small>
        </div>
        <div className="library-summary-card">
          <span>Favoritos</span>
          <strong>{library.filter((item) => item.favorite).length}</strong>
          <small>Materiais que você marcou para revisitar</small>
        </div>
        <div className="library-summary-card">
          <span>Rascunhos</span>
          <strong>{drafts.length}</strong>
          <small>
            {latestDraft
              ? `Último: ${latestDraft.toolLabel}`
              : "Nenhum formulário salvo no momento"}
          </small>
        </div>
      </div>

      <div className="library-toolbar">
        <div className="library-search">
          <label htmlFor="library-search">Buscar no histórico</label>
          <input
            id="library-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Busque por tema, título ou ferramenta..."
          />
        </div>

        <div className="library-search library-search-select">
          <label htmlFor="library-tool-filter">Filtrar por ferramenta</label>
          <select
            id="library-tool-filter"
            value={toolFilter}
            onChange={(event) => setToolFilter(event.target.value)}
          >
            <option value="all">Todas as ferramentas</option>
            {toolOptions.map((option) => (
              <option key={option.toolId} value={option.toolId}>
                {option.toolLabel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {visibleItems.length === 0 ? (
        <div className="library-empty">
          <h3>
            {library.length === 0
              ? "Nada salvo ainda"
              : "Nenhum item corresponde ao filtro atual"}
          </h3>
          <p>
            {library.length === 0
              ? "Gere um esboço, uma análise ou uma lista de versículos e o conteúdo aparecerá aqui automaticamente."
              : "Ajuste a busca, troque a ferramenta ou volte para recentes para enxergar mais itens."}
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
