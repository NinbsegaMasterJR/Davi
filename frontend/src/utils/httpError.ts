import axios from "axios";

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data as
      | { error?: string }
      | undefined;

    if (responseMessage?.error) {
      return responseMessage.error;
    }

    if (!error.response) {
      return "Nao foi possivel conectar com o servidor. Verifique se o backend esta ativo.";
    }

    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
