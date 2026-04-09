import {
  sugerirVersiculosPorTema,
  buscarConcordanciaIA,
  type VersaoBiblica,
} from "./ia.service";
import { createNotImplementedError } from "../utils/validation";

interface Verso {
  referencia: string;
  texto: string;
  versao?: string;
}

export async function buscarVersiculos(
  tema: string,
  limite: number = 5,
  versaoBiblica: VersaoBiblica = "ARA",
): Promise<Verso[]> {
  try {
    return await sugerirVersiculosPorTema(tema, limite, versaoBiblica);
  } catch (error) {
    console.error("Erro ao buscar versiculos:", error);
    throw error;
  }
}

export async function buscarConcordancia(
  palavra: string,
  limite: number = 10,
  versaoBiblica: VersaoBiblica = "ARA",
): Promise<Verso[]> {
  try {
    return await buscarConcordanciaIA(palavra, limite, versaoBiblica);
  } catch (error) {
    console.error("Erro ao buscar concordancia:", error);
    throw error;
  }
}

export async function obterTextoCompletoBiblia(
  referencia: string,
  versaoBiblica: VersaoBiblica = "ARA",
): Promise<Verso> {
  void referencia;
  void versaoBiblica;

  throw createNotImplementedError(
    "Consulta de texto biblico integral ainda nao esta disponivel com fonte verificada nesta versao do projeto.",
  );
}
