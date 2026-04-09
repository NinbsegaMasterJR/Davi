import type { VersaoBiblica } from "../services/ia.service";

interface ValidationError extends Error {
  status?: number;
}

interface TextOptions {
  minLength?: number;
  maxLength?: number;
  fallback?: string;
}

function createValidationError(message: string, status: number = 400): Error {
  const error = new Error(message) as ValidationError;
  error.status = status;
  return error;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function sanitizeText(
  value: unknown,
  label: string,
  options: TextOptions = {},
): string {
  const normalizedValue =
    typeof value === "string" ? normalizeWhitespace(value) : "";
  const { minLength = 1, maxLength = 160, fallback } = options;

  if (!normalizedValue) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw createValidationError(`${label} e obrigatorio`);
  }

  if (normalizedValue.length < minLength) {
    throw createValidationError(`${label} precisa ter ao menos ${minLength} caracteres`);
  }

  if (normalizedValue.length > maxLength) {
    throw createValidationError(`${label} excede o limite de ${maxLength} caracteres`);
  }

  return normalizedValue;
}

export function sanitizeOptionalText(
  value: unknown,
  label: string,
  options: Omit<TextOptions, "fallback"> = {},
): string | undefined {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }

  return sanitizeText(value, label, options);
}

export function parseInteger(
  value: unknown,
  label: string,
  options: { min: number; max: number; fallback: number },
): number {
  const numericValue =
    typeof value === "number" ? value : Number.parseInt(String(value || ""), 10);

  if (Number.isNaN(numericValue)) {
    return options.fallback;
  }

  if (numericValue < options.min || numericValue > options.max) {
    throw createValidationError(
      `${label} precisa estar entre ${options.min} e ${options.max}`,
    );
  }

  return numericValue;
}

const ALLOWED_BIBLE_VERSIONS: VersaoBiblica[] = [
  "ARA",
  "ARC",
  "ARCF",
  "KING_JAMES",
];

export function parseBibleVersion(value: unknown): VersaoBiblica {
  if (
    typeof value === "string" &&
    ALLOWED_BIBLE_VERSIONS.includes(value as VersaoBiblica)
  ) {
    return value as VersaoBiblica;
  }

  return "ARA";
}

export function parseStringList(
  value: unknown,
  label: string,
  options: { maxItems: number; maxItemLength: number },
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const sanitized = value
    .map((item) =>
      sanitizeOptionalText(item, label, {
        minLength: 2,
        maxLength: options.maxItemLength,
      }),
    )
    .filter((item): item is string => Boolean(item));

  if (sanitized.length > options.maxItems) {
    throw createValidationError(
      `${label} permite no maximo ${options.maxItems} itens`,
    );
  }

  return sanitized;
}

export function createNotImplementedError(message: string): Error {
  return createValidationError(message, 501);
}
