export interface HttpError extends Error {
  status?: number;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function getErrorStatus(error: unknown, fallback: number = 500): number {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as HttpError).status;
    if (typeof status === "number") {
      return status;
    }
  }

  return fallback;
}
