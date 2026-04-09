import { useEffect, useMemo, useRef } from "react";
import { useApp } from "../context/AppContext";

interface UseToolDraftOptions<T extends Record<string, unknown>> {
  toolId: string;
  toolLabel: string;
  title: string;
  summary?: string;
  values: T;
  onRestore: (values: T) => void;
}

interface UseToolDraftResult {
  draftUpdatedAt: string | null;
  hasDraft: boolean;
  clearSavedDraft: () => void;
}

export function useToolDraft<T extends Record<string, unknown>>({
  toolId,
  toolLabel,
  title,
  summary,
  values,
  onRestore,
}: UseToolDraftOptions<T>): UseToolDraftResult {
  const { clearDraft, getDraft, saveDraft, showSuccess } = useApp();
  const draft = getDraft(toolId);
  const restoredRef = useRef(false);
  const skipInitialSaveRef = useRef(true);

  const serializedValues = useMemo(() => JSON.stringify(values), [values]);

  useEffect(() => {
    if (restoredRef.current) {
      return;
    }

    if (draft) {
      onRestore(draft.values as T);
    }

    restoredRef.current = true;
  }, [draft, onRestore]);

  useEffect(() => {
    if (!restoredRef.current) {
      return;
    }

    if (skipInitialSaveRef.current) {
      skipInitialSaveRef.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      saveDraft({
        toolId,
        toolLabel,
        title,
        summary,
        values: JSON.parse(serializedValues) as Record<string, unknown>,
      });
    }, 700);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [saveDraft, serializedValues, summary, title, toolId, toolLabel]);

  const clearSavedDraft = () => {
    clearDraft(toolId);
    showSuccess("Rascunho local removido.");
  };

  return {
    draftUpdatedAt: draft?.updatedAt ?? null,
    hasDraft: Boolean(draft),
    clearSavedDraft,
  };
}
