import React from "react";

interface ToolDraftBarProps {
  hasDraft: boolean;
  draftUpdatedAt: string | null;
  note: string;
  onClearDraft: () => void;
}

function formatDraftTime(value: string | null): string {
  if (!value) {
    return "Autosave local ativo neste formulário";
  }

  return `Última atualização: ${new Date(value).toLocaleString("pt-BR")}`;
}

export const ToolDraftBar: React.FC<ToolDraftBarProps> = ({
  hasDraft,
  draftUpdatedAt,
  note,
  onClearDraft,
}) => (
  <div className="tool-draft-bar">
    <div className="tool-draft-copy">
      <span className="tool-draft-kicker">Rascunho local</span>
      <strong>
        {hasDraft ?"Formulário restaurado automaticamente" : "Autosave local ativo"}
      </strong>
      <p>
        {note} {formatDraftTime(draftUpdatedAt)}.
      </p>
    </div>
    {hasDraft && (
      <button type="button" className="btn-copy" onClick={onClearDraft}>
        Limpar rascunho
      </button>
    )}
  </div>
);
