import { Router, Request, Response } from "express";
import {
  getWorkspaceSession,
  getWorkspaceSnapshot,
  isWorkspaceSyncConfigured,
  loginWorkspace,
  registerWorkspace,
  saveWorkspaceSnapshot,
} from "../services/workspace.service";
import { getErrorMessage, getErrorStatus } from "../utils/httpError";

const router = Router();

function getBearerToken(req: Request): string {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    const error = new Error("Sessao ausente. Entre novamente.") as Error & {
      status?: number;
    };
    error.status = 401;
    throw error;
  }

  return authorization.slice("Bearer ".length).trim();
}

router.get("/status", (req: Request, res: Response) => {
  void req;
  res.json({
    sucesso: true,
    configured: isWorkspaceSyncConfigured(),
  });
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const session = await registerWorkspace(
      req.body.displayName,
      req.body.passphrase,
    );

    res.status(201).json({
      sucesso: true,
      session,
    });
  } catch (error) {
    res.status(getErrorStatus(error)).json({
      error: getErrorMessage(error, "Erro ao criar workspace."),
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const session = await loginWorkspace(
      req.body.workspaceId,
      req.body.passphrase,
    );

    res.json({
      sucesso: true,
      session,
    });
  } catch (error) {
    res.status(getErrorStatus(error)).json({
      error: getErrorMessage(error, "Erro ao entrar no workspace."),
    });
  }
});

router.get("/session", async (req: Request, res: Response) => {
  try {
    const session = await getWorkspaceSession(getBearerToken(req));

    res.json({
      sucesso: true,
      session,
    });
  } catch (error) {
    res.status(getErrorStatus(error)).json({
      error: getErrorMessage(error, "Sessao invalida."),
    });
  }
});

router.get("/snapshot", async (req: Request, res: Response) => {
  try {
    const snapshot = await getWorkspaceSnapshot(getBearerToken(req));

    res.json({
      sucesso: true,
      snapshot,
    });
  } catch (error) {
    res.status(getErrorStatus(error)).json({
      error: getErrorMessage(error, "Erro ao carregar o snapshot."),
    });
  }
});

router.put("/snapshot", async (req: Request, res: Response) => {
  try {
    const snapshot = await saveWorkspaceSnapshot(
      getBearerToken(req),
      req.body,
    );

    res.json({
      sucesso: true,
      snapshot,
    });
  } catch (error) {
    res.status(getErrorStatus(error)).json({
      error: getErrorMessage(error, "Erro ao salvar o snapshot."),
    });
  }
});

export default router;
