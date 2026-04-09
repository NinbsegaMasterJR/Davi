import { get, put } from "@vercel/blob";
import crypto from "crypto";
import { createNotImplementedError, sanitizeText } from "../utils/validation";

type SavedContentType = "markdown" | "text";

interface WorkspaceDocument {
  id: string;
  toolId: string;
  toolLabel: string;
  title: string;
  query: string;
  summary?: string;
  content: string;
  contentType: SavedContentType;
  createdAt: string;
  favorite: boolean;
}

interface WorkspaceDraft {
  toolId: string;
  toolLabel: string;
  title: string;
  summary?: string;
  values: Record<string, unknown>;
  updatedAt: string;
}

export interface WorkspaceSnapshot {
  library: WorkspaceDocument[];
  drafts: WorkspaceDraft[];
  onboardingDismissed: boolean;
  lastTab?: string;
  syncedAt: string;
}

interface WorkspaceRecord {
  workspaceId: string;
  displayName: string;
  passphraseHash: string;
  createdAt: string;
  updatedAt: string;
  snapshot: WorkspaceSnapshot;
}

interface SessionPayload {
  workspaceId: string;
  exp: number;
}

export interface WorkspaceSession {
  token: string;
  workspaceId: string;
  displayName: string;
  syncedAt: string;
}

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;
const MAX_LIBRARY_ITEMS = 40;
const MAX_DRAFT_ITEMS = 10;
const MAX_CONTENT_LENGTH = 24000;
const MAX_QUERY_LENGTH = 200;
const MAX_SUMMARY_LENGTH = 180;
const MAX_TITLE_LENGTH = 120;
const MAX_TOOL_LABEL_LENGTH = 40;
const MAX_TOOL_ID_LENGTH = 40;

function createWorkspaceError(message: string, status: number = 400): Error {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  return error;
}

function assertWorkspaceSyncConfigured(): void {
  if (!process.env.BLOB_READ_WRITE_TOKEN || !process.env.WORKSPACE_SYNC_SECRET) {
    throw createNotImplementedError(
      "Sincronizacao em nuvem nao esta configurada no backend.",
    );
  }
}

export function isWorkspaceSyncConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN && process.env.WORKSPACE_SYNC_SECRET,
  );
}

function getWorkspaceSecret(): string {
  const secret = process.env.WORKSPACE_SYNC_SECRET;

  if (!secret) {
    throw createNotImplementedError(
      "Segredo de sincronizacao nao configurado no backend.",
    );
  }

  return secret;
}

function getWorkspacePath(workspaceId: string): string {
  return `workspaces/${workspaceId}.json`;
}

function normalizeShortText(
  value: unknown,
  fallback: string,
  maxLength: number,
): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized ? normalized.slice(0, maxLength) : fallback;
}

function normalizeOptionalText(
  value: unknown,
  maxLength: number,
): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized ? normalized.slice(0, maxLength) : undefined;
}

function normalizeLongText(
  value: unknown,
  maxLength: number,
): string {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.trim();
  return normalized ? normalized.slice(0, maxLength) : "";
}

function normalizeIsoDate(value: unknown): string {
  if (typeof value !== "string") {
    return new Date().toISOString();
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? new Date().toISOString() : new Date(timestamp).toISOString();
}

function normalizeContentType(value: unknown): SavedContentType {
  return value === "text" ? "text" : "markdown";
}

function normalizeDocument(
  document: unknown,
  index: number,
): WorkspaceDocument | null {
  if (typeof document !== "object" || document === null) {
    return null;
  }

  const item = document as Record<string, unknown>;
  const content = normalizeLongText(item.content, MAX_CONTENT_LENGTH);

  if (!content) {
    return null;
  }

  return {
    id: normalizeShortText(
      item.id,
      `doc-${Date.now()}-${index}`,
      80,
    ),
    toolId: normalizeShortText(item.toolId, "workspace", MAX_TOOL_ID_LENGTH),
    toolLabel: normalizeShortText(
      item.toolLabel,
      "Workspace",
      MAX_TOOL_LABEL_LENGTH,
    ),
    title: normalizeShortText(
      item.title,
      "Material sincronizado",
      MAX_TITLE_LENGTH,
    ),
    query: normalizeShortText(item.query, "Sem consulta", MAX_QUERY_LENGTH),
    summary: normalizeOptionalText(item.summary, MAX_SUMMARY_LENGTH),
    content,
    contentType: normalizeContentType(item.contentType),
    createdAt: normalizeIsoDate(item.createdAt),
    favorite: Boolean(item.favorite),
  };
}

function normalizeDraftValue(value: unknown): unknown {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .slice(0, 20)
      .map((entry) => normalizeDraftValue(entry))
      .filter((entry) => entry !== undefined);
  }

  if (typeof value === "object") {
    const normalizedEntries = Object.entries(value as Record<string, unknown>)
      .slice(0, 30)
      .map(([key, entry]) => [key.slice(0, 40), normalizeDraftValue(entry)] as const)
      .filter((entry) => entry[1] !== undefined);

    return Object.fromEntries(normalizedEntries);
  }

  return undefined;
}

function normalizeDraft(draft: unknown): WorkspaceDraft | null {
  if (typeof draft !== "object" || draft === null) {
    return null;
  }

  const item = draft as Record<string, unknown>;
  const values =
    typeof item.values === "object" && item.values !== null
      ? normalizeDraftValue(item.values)
      : {};

  return {
    toolId: normalizeShortText(item.toolId, "workspace", MAX_TOOL_ID_LENGTH),
    toolLabel: normalizeShortText(
      item.toolLabel,
      "Workspace",
      MAX_TOOL_LABEL_LENGTH,
    ),
    title: normalizeShortText(item.title, "Rascunho", MAX_TITLE_LENGTH),
    summary: normalizeOptionalText(item.summary, MAX_SUMMARY_LENGTH),
    values:
      typeof values === "object" && values !== null
        ? (values as Record<string, unknown>)
        : {},
    updatedAt: normalizeIsoDate(item.updatedAt),
  };
}

function normalizeSnapshot(snapshot: unknown): WorkspaceSnapshot {
  const item =
    typeof snapshot === "object" && snapshot !== null
      ? (snapshot as Record<string, unknown>)
      : {};

  const library = Array.isArray(item.library)
    ? item.library
        .map((entry, index) => normalizeDocument(entry, index))
        .filter((entry): entry is WorkspaceDocument => Boolean(entry))
        .sort(
          (left, right) =>
            Date.parse(right.createdAt) - Date.parse(left.createdAt),
        )
        .slice(0, MAX_LIBRARY_ITEMS)
    : [];

  const drafts = Array.isArray(item.drafts)
    ? item.drafts
        .map((entry) => normalizeDraft(entry))
        .filter((entry): entry is WorkspaceDraft => Boolean(entry))
        .slice(0, MAX_DRAFT_ITEMS)
    : [];

  return {
    library,
    drafts,
    onboardingDismissed: Boolean(item.onboardingDismissed),
    lastTab: normalizeOptionalText(item.lastTab, 40),
    syncedAt: normalizeIsoDate(item.syncedAt),
  };
}

function createEmptySnapshot(): WorkspaceSnapshot {
  return {
    library: [],
    drafts: [],
    onboardingDismissed: false,
    syncedAt: new Date().toISOString(),
  };
}

function toBase64Url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function parseBase64Url<T>(value: string): T {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
}

function createSessionToken(workspaceId: string): string {
  const payload = toBase64Url(
    JSON.stringify({
      workspaceId,
      exp: Date.now() + SESSION_DURATION_MS,
    } satisfies SessionPayload),
  );
  const signature = crypto
    .createHmac("sha256", getWorkspaceSecret())
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

function verifySessionToken(token: string): SessionPayload {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    throw createWorkspaceError("Sessao invalida.", 401);
  }

  const expectedSignature = crypto
    .createHmac("sha256", getWorkspaceSecret())
    .update(payload)
    .digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw createWorkspaceError("Sessao invalida.", 401);
  }

  const parsed = parseBase64Url<SessionPayload>(payload);

  if (!parsed.workspaceId || parsed.exp < Date.now()) {
    throw createWorkspaceError("Sessao expirada. Entre novamente.", 401);
  }

  return parsed;
}

async function streamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  const response = new Response(stream);
  return response.text();
}

async function readWorkspaceRecord(
  workspaceId: string,
): Promise<WorkspaceRecord | null> {
  assertWorkspaceSyncConfigured();

  const blob = await get(getWorkspacePath(workspaceId), {
    access: "private",
    useCache: false,
  });

  if (!blob || blob.statusCode !== 200) {
    return null;
  }

  const content = await streamToString(blob.stream);
  const parsed = JSON.parse(content) as WorkspaceRecord;

  return {
    workspaceId: normalizeShortText(parsed.workspaceId, workspaceId, 40),
    displayName: normalizeShortText(parsed.displayName, "Workspace", 60),
    passphraseHash: String(parsed.passphraseHash || ""),
    createdAt: normalizeIsoDate(parsed.createdAt),
    updatedAt: normalizeIsoDate(parsed.updatedAt),
    snapshot: normalizeSnapshot(parsed.snapshot),
  };
}

async function saveWorkspaceRecord(record: WorkspaceRecord): Promise<void> {
  assertWorkspaceSyncConfigured();

  await put(getWorkspacePath(record.workspaceId), JSON.stringify(record), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

function generateWorkspaceId(): string {
  return `wrk-${crypto.randomBytes(4).toString("hex")}`;
}

function scryptAsync(value: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(value, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey as Buffer);
    });
  });
}

async function hashPassphrase(passphrase: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(passphrase, salt);
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

async function verifyPassphrase(
  passphrase: string,
  storedHash: string,
): Promise<boolean> {
  const [strategy, salt, hash] = storedHash.split("$");

  if (strategy !== "scrypt" || !salt || !hash) {
    return false;
  }

  const derivedKey = await scryptAsync(passphrase, salt);
  const storedBuffer = Buffer.from(hash, "hex");

  return (
    storedBuffer.length === derivedKey.length &&
    crypto.timingSafeEqual(storedBuffer, derivedKey)
  );
}

export function validateWorkspaceToken(token: string): string {
  assertWorkspaceSyncConfigured();
  return verifySessionToken(token).workspaceId;
}

export async function registerWorkspace(
  displayName: string,
  passphrase: string,
): Promise<WorkspaceSession> {
  assertWorkspaceSyncConfigured();

  const sanitizedName = sanitizeText(displayName, "Nome do workspace", {
    minLength: 3,
    maxLength: 60,
  });
  const sanitizedPassphrase = sanitizeText(passphrase, "Chave de acesso", {
    minLength: 6,
    maxLength: 80,
  });

  let workspaceId = generateWorkspaceId();
  let existing = await readWorkspaceRecord(workspaceId);

  while (existing) {
    workspaceId = generateWorkspaceId();
    existing = await readWorkspaceRecord(workspaceId);
  }

  const now = new Date().toISOString();
  const record: WorkspaceRecord = {
    workspaceId,
    displayName: sanitizedName,
    passphraseHash: await hashPassphrase(sanitizedPassphrase),
    createdAt: now,
    updatedAt: now,
    snapshot: createEmptySnapshot(),
  };

  await saveWorkspaceRecord(record);

  return {
    token: createSessionToken(record.workspaceId),
    workspaceId: record.workspaceId,
    displayName: record.displayName,
    syncedAt: record.snapshot.syncedAt,
  };
}

export async function loginWorkspace(
  workspaceId: string,
  passphrase: string,
): Promise<WorkspaceSession> {
  assertWorkspaceSyncConfigured();

  const sanitizedWorkspaceId = sanitizeText(workspaceId, "Workspace ID", {
    minLength: 6,
    maxLength: 40,
  });
  const sanitizedPassphrase = sanitizeText(passphrase, "Chave de acesso", {
    minLength: 6,
    maxLength: 80,
  });

  const record = await readWorkspaceRecord(sanitizedWorkspaceId);

  if (!record) {
    throw createWorkspaceError("Workspace nao encontrado.", 404);
  }

  const isValid = await verifyPassphrase(
    sanitizedPassphrase,
    record.passphraseHash,
  );

  if (!isValid) {
    throw createWorkspaceError("Chave de acesso invalida.", 401);
  }

  return {
    token: createSessionToken(record.workspaceId),
    workspaceId: record.workspaceId,
    displayName: record.displayName,
    syncedAt: record.snapshot.syncedAt,
  };
}

export async function getWorkspaceSession(
  token: string,
): Promise<WorkspaceSession> {
  const workspaceId = validateWorkspaceToken(token);
  const record = await readWorkspaceRecord(workspaceId);

  if (!record) {
    throw createWorkspaceError("Workspace nao encontrado.", 404);
  }

  return {
    token,
    workspaceId: record.workspaceId,
    displayName: record.displayName,
    syncedAt: record.snapshot.syncedAt,
  };
}

export async function getWorkspaceSnapshot(
  token: string,
): Promise<WorkspaceSnapshot> {
  const workspaceId = validateWorkspaceToken(token);
  const record = await readWorkspaceRecord(workspaceId);

  if (!record) {
    throw createWorkspaceError("Workspace nao encontrado.", 404);
  }

  return record.snapshot;
}

export async function saveWorkspaceSnapshot(
  token: string,
  snapshot: unknown,
): Promise<WorkspaceSnapshot> {
  const workspaceId = validateWorkspaceToken(token);
  const record = await readWorkspaceRecord(workspaceId);

  if (!record) {
    throw createWorkspaceError("Workspace nao encontrado.", 404);
  }

  const normalizedSnapshot = normalizeSnapshot(snapshot);
  normalizedSnapshot.syncedAt = new Date().toISOString();

  const nextRecord: WorkspaceRecord = {
    ...record,
    updatedAt: normalizedSnapshot.syncedAt,
    snapshot: normalizedSnapshot,
  };

  await saveWorkspaceRecord(nextRecord);

  return normalizedSnapshot;
}
