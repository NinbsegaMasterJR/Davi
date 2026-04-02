import {
  sugerirVersiculosPorTema,
  buscarConcordanciaIA,
  type VersaoBiblica,
} from "./ia.service";

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
  try {
    const resultados = await sugerirVersiculosPorTema(
      referencia,
      1,
      versaoBiblica,
    );
    if (resultados.length > 0) return resultados[0];
    return {
      referencia,
      texto: "Versiculo nao encontrado.",
      versao: versaoBiblica,
    };
  } catch (error) {
    console.error("Erro ao obter texto biblico:", error);
    throw error;
  }
}
