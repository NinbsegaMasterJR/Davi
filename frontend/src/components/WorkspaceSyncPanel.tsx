import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { workspaceSyncAPI } from "../services/api";
import { downloadContent } from "../utils/fileExport";
import { getErrorMessage } from "../utils/httpError";
import type { WorkspaceSession, WorkspaceSnapshot } from "../types/workspace";
import {
  LAST_TAB_STORAGE_KEY,
  LEGACY_WORKSPACE_SESSION_STORAGE_KEY,
  WORKSPACE_SESSION_STORAGE_KEY,
  createWorkspaceSnapshot,
  mergeWorkspaceSnapshots,
  parseWorkspaceSnapshot,
  readStorageItem,
} from "../utils/workspaceSnapshot";

interface WorkspaceSyncPanelProps {
  currentTab: string;
}

type AuthMode = "create" | "login";

function getSnapshotComparableKey(snapshot: WorkspaceSnapshot): string {
  return JSON.stringify({
    library: snapshot.library,
    drafts: snapshot.drafts,
    onboardingDismissed: snapshot.onboardingDismissed,
    lastTab: snapshot.lastTab,
  });
}

function loadStoredSession(): WorkspaceSession | null {
  const stored = readStorageItem(
    WORKSPACE_SESSION_STORAGE_KEY,
    LEGACY_WORKSPACE_SESSION_STORAGE_KEY,
  );

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as WorkspaceSession;
  } catch (error) {
    void error;
    return null;
  }
}

export const WorkspaceSyncPanel: React.FC<WorkspaceSyncPanelProps> = ({
  currentTab,
}) => {
  const {
    library,
    drafts,
    onboardingDismissed,
    replaceWorkspaceState,
    showError,
    showSuccess,
  } = useApp();
  const [mode, setMode] = useState<AuthMode>("create");
  const [displayName, setDisplayName] = useState("");
  const [workspaceIdInput, setWorkspaceIdInput] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [session, setSession] = useState<WorkspaceSession | null>(
    loadStoredSession,
  );
  const [configured, setConfigured] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [busy, setBusy] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [statusText, setStatusText] = useState(
    "Sincronização pronta para configurar.",
  );
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(
    session?.syncedAt ?? null,
  );
  const initializedRef = useRef(false);
  const lastUploadedSnapshotKeyRef = useRef("");
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const localSnapshot = useMemo(
    () =>
      createWorkspaceSnapshot({
        library,
        drafts,
        onboardingDismissed,
        lastTab: currentTab,
      }),
    [currentTab, drafts, library, onboardingDismissed],
  );
  const snapshotKey = useMemo(
    () => getSnapshotComparableKey(localSnapshot),
    [localSnapshot],
  );

  useEffect(() => {
    if (session) {
      window.localStorage.setItem(
        WORKSPACE_SESSION_STORAGE_KEY,
        JSON.stringify(session),
      );
      return;
    }

    window.localStorage.removeItem(WORKSPACE_SESSION_STORAGE_KEY);
  }, [session]);

  const applySnapshotLocally = useCallback((snapshot: WorkspaceSnapshot) => {
    replaceWorkspaceState(snapshot);

    if (snapshot.lastTab) {
      window.localStorage.setItem(LAST_TAB_STORAGE_KEY, snapshot.lastTab);
    }
  }, [replaceWorkspaceState]);

  const syncNow = useCallback(async (
    nextSession: WorkspaceSession,
    nextSnapshot: WorkspaceSnapshot,
    successMessage?: string,
  ) => {
    setSyncing(true);
    setStatusText("Sincronizando seu workspace com a nuvem...");

    try {
      const response = await workspaceSyncAPI.saveSnapshot(
        nextSession.token,
        nextSnapshot,
      );
      setLastSyncAt(response.data.snapshot.syncedAt);
      lastUploadedSnapshotKeyRef.current = getSnapshotComparableKey(nextSnapshot);
      setStatusText("Workspace sincronizado entre este dispositivo e a nuvem.");

      if (successMessage) {
        showSuccess(successMessage);
      }
    } catch (error: unknown) {
      setStatusText("Não foi possível sincronizar agora.");
      showError(getErrorMessage(error, "Erro ao sincronizar com a nuvem."));
    } finally {
      setSyncing(false);
    }
  }, [showError, showSuccess]);

  const hydrateFromCloud = useCallback(async (token: string) => {
    setBusy(true);
    setStatusText("Conectando ao workspace sincronizado...");

    try {
      const [sessionResponse, snapshotResponse] = await Promise.all([
        workspaceSyncAPI.getSession(token),
        workspaceSyncAPI.getSnapshot(token),
      ]);
      const restoredSession = sessionResponse.data.session;
      const mergedSnapshot = mergeWorkspaceSnapshots(
        localSnapshot,
        snapshotResponse.data.snapshot,
      );

      setSession(restoredSession);
      applySnapshotLocally(mergedSnapshot);
      await syncNow(
        restoredSession,
        mergedSnapshot,
        "Workspace conectado e sincronizado.",
      );
      initializedRef.current = true;
    } catch (error: unknown) {
      setSession(null);
      setLastSyncAt(null);
      setStatusText("Não foi possível restaurar o workspace em nuvem.");
      showError(getErrorMessage(error, "Erro ao restaurar o workspace."));
      initializedRef.current = true;
    } finally {
      setBusy(false);
    }
  }, [applySnapshotLocally, localSnapshot, showError, syncNow]);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await workspaceSyncAPI.getStatus();
        setConfigured(response.data.configured);

        if (!response.data.configured) {
          setStatusText("A sincronização em nuvem ainda não está habilitada.");
        }
      } catch (error: unknown) {
        void error;
        setConfigured(false);
        setStatusText("Não foi possível verificar o módulo de nuvem.");
      } finally {
        setCheckingStatus(false);
      }
    };

    void checkStatus();
  }, []);

  useEffect(() => {
    if (!session) {
      initializedRef.current = true;
      return;
    }

    void hydrateFromCloud(session.token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initializedRef.current || !configured || !session || syncing || busy) {
      return;
    }

    if (lastUploadedSnapshotKeyRef.current === snapshotKey) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void syncNow(session, localSnapshot);
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [busy, configured, localSnapshot, session, snapshotKey, syncNow, syncing]);

  const handleCreateWorkspace = async () => {
    if (!displayName.trim() || !passphrase.trim()) {
      showError("Informe nome do workspace e chave de acesso.");
      return;
    }

    setBusy(true);
    try {
      const response = await workspaceSyncAPI.register(
        displayName,
        passphrase,
      );
      setPassphrase("");
      setWorkspaceIdInput(response.data.session.workspaceId);
      await hydrateFromCloud(response.data.session.token);
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao criar workspace sincronizado."));
    } finally {
      setBusy(false);
    }
  };

  const handleLoginWorkspace = async () => {
    if (!workspaceIdInput.trim() || !passphrase.trim()) {
      showError("Informe o Workspace ID e a chave de acesso.");
      return;
    }

    setBusy(true);
    try {
      const response = await workspaceSyncAPI.login(
        workspaceIdInput,
        passphrase,
      );
      setPassphrase("");
      await hydrateFromCloud(response.data.session.token);
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao entrar no workspace."));
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    setLastSyncAt(null);
    lastUploadedSnapshotKeyRef.current = "";
    setStatusText("Sessão local encerrada. Seus dados locais continuam neste navegador.");
    showSuccess("Workspace em nuvem desconectado deste dispositivo.");
  };

  const handleCopyWorkspaceId = async () => {
    if (!session?.workspaceId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(session.workspaceId);
      showSuccess("Workspace ID copiado.");
    } catch (error) {
      void error;
      showError("Não foi possível copiar o Workspace ID.");
    }
  };

  const handleExportBackup = () => {
    downloadContent(
      `backup-workspace-${session?.workspaceId || "local"}`,
      JSON.stringify(localSnapshot, null, 2),
      "json",
    );
    showSuccess("Backup do workspace baixado em .json.");
  };

  const handleImportBackup = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const content = await file.text();
      const importedSnapshot = parseWorkspaceSnapshot(content);

      if (!importedSnapshot) {
        throw new Error("Arquivo de backup inválido.");
      }

      const mergedSnapshot = mergeWorkspaceSnapshots(
        localSnapshot,
        importedSnapshot,
      );
      applySnapshotLocally(mergedSnapshot);
      showSuccess("Backup importado e incorporado ao workspace local.");

      if (session) {
        await syncNow(session, mergedSnapshot, "Backup importado e enviado para a nuvem.");
      }
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Não foi possível importar o backup."));
    } finally {
      event.target.value = "";
    }
  };

  return (
    <section className="workspace-sync-panel">
      <div className="workspace-sync-header">
        <div>
          <p className="section-kicker">Fase 5</p>
          <h2>Workspace sincronizado entre dispositivos</h2>
          <p>
            Entre com um workspace protegido por chave de acesso para subir
            biblioteca, rascunhos e retomada para a nuvem.
          </p>
        </div>
        <div className="workspace-sync-badges">
          <span className="workspace-sync-badge">
            {checkingStatus
              ? "Verificando nuvem"
              : configured
                ? "Nuvem ativa"
                : "Nuvem indisponível"}
          </span>
          <span className="workspace-sync-badge muted">
            {session ? "Sessão conectada" : "Sem sessão"}
          </span>
        </div>
      </div>

      <div className="workspace-sync-grid">
        <article className="workspace-sync-card workspace-sync-card-strong">
          <div className="workspace-sync-copy">
            <span className="workspace-sync-kicker">Status atual</span>
            <strong>{statusText}</strong>
            <p>
              {session
                ? `Workspace ativo: ${session.displayName} (${session.workspaceId}).`
                : "Crie um workspace sincronizado ou entre com um Workspace ID já existente."}
            </p>
          </div>

          <div className="workspace-sync-stats">
            <div>
              <span>Biblioteca</span>
              <strong>{library.length}</strong>
            </div>
            <div>
              <span>Rascunhos</span>
              <strong>{drafts.length}</strong>
            </div>
            <div>
              <span>Última sync</span>
              <strong>
                {lastSyncAt
                  ? new Date(lastSyncAt).toLocaleString("pt-BR")
                  : "Ainda não sincronizado"}
              </strong>
            </div>
          </div>

          <div className="workspace-sync-actions">
            <button
              type="button"
              className="workspace-step-action"
              onClick={() => {
                if (!session) {
                  return;
                }

                void syncNow(session, localSnapshot);
              }}
              disabled={!session || !configured || syncing || busy}
            >
              {syncing ? "Sincronizando..." : "Sincronizar agora"}
            </button>
            <button
              type="button"
              className="workspace-guide-link"
              onClick={handleExportBackup}
            >
              Baixar backup .json
            </button>
            <button
              type="button"
              className="workspace-guide-link"
              onClick={() => importInputRef.current?.click()}
            >
              Importar backup
            </button>
            {session && (
              <button
                type="button"
                className="workspace-guide-link"
                onClick={handleCopyWorkspaceId}
              >
                Copiar Workspace ID
              </button>
            )}
          </div>

          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            className="workspace-sync-hidden"
            onChange={handleImportBackup}
          />
        </article>

        <article className="workspace-sync-card">
          <div className="workspace-sync-tabs">
            <button
              type="button"
              className={`workspace-sync-tab ${mode === "create" ? "active" : ""}`}
              onClick={() => setMode("create")}
            >
              Criar workspace
            </button>
            <button
              type="button"
              className={`workspace-sync-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Entrar
            </button>
          </div>

          {mode === "create" ? (
            <div className="workspace-sync-form">
              <div className="form-group">
                <label htmlFor="workspace-name">Nome do workspace</label>
                <input
                  id="workspace-name"
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Ex: Pastoral Davi"
                  disabled={busy || !configured}
                />
              </div>
              <div className="form-group">
                <label htmlFor="workspace-passphrase-create">
                  Chave de acesso
                </label>
                <input
                  id="workspace-passphrase-create"
                  type="password"
                  value={passphrase}
                  onChange={(event) => setPassphrase(event.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  disabled={busy || !configured}
                />
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => void handleCreateWorkspace()}
                disabled={busy || !configured}
              >
                {busy ? "Criando..." : "Criar e conectar"}
              </button>
            </div>
          ) : (
            <div className="workspace-sync-form">
              <div className="form-group">
                <label htmlFor="workspace-id">Workspace ID</label>
                <input
                  id="workspace-id"
                  type="text"
                  value={workspaceIdInput}
                  onChange={(event) => setWorkspaceIdInput(event.target.value)}
                  placeholder="Ex: wrk-9ab3c1de"
                  disabled={busy || !configured}
                />
              </div>
              <div className="form-group">
                <label htmlFor="workspace-passphrase-login">
                  Chave de acesso
                </label>
                <input
                  id="workspace-passphrase-login"
                  type="password"
                  value={passphrase}
                  onChange={(event) => setPassphrase(event.target.value)}
                  placeholder="Sua chave de acesso"
                  disabled={busy || !configured}
                />
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => void handleLoginWorkspace()}
                disabled={busy || !configured}
              >
                {busy ? "Entrando..." : "Entrar no workspace"}
              </button>
            </div>
          )}

          <div className="tool-panel-note">
            <strong>Como usar sem perder dados</strong>
            Guarde seu Workspace ID e a chave de acesso. O app faz merge entre
            os dados locais e os dados da nuvem para preservar biblioteca e
            rascunhos dos seus dispositivos.
          </div>

          {session && (
            <div className="workspace-sync-session">
              <div>
                <span>Conectado como</span>
                <strong>{session.displayName}</strong>
                <small>{session.workspaceId}</small>
              </div>
              <button
                type="button"
                className="workspace-guide-link"
                onClick={handleLogout}
              >
                Sair deste dispositivo
              </button>
            </div>
          )}
        </article>
      </div>
    </section>
  );
};
