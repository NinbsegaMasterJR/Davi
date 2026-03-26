import { sugerirVersiculosPorTema, buscarConcordanciaIA } from "./ia.service";

interface Verso {
  referencia: string;
  texto: string;
  versao?: string;
}

export async function buscarVersiculos(
  tema: string,
  limite: number = 5,
): Promise<Verso[]> {
  try {
    return await sugerirVersiculosPorTema(tema, limite);
  } catch (error) {
    console.error("Erro ao buscar versículos:", error);
    throw error;
  }
}

export async function buscarConcordancia(
  palavra: string,
  limite: number = 10,
): Promise<Verso[]> {
  try {
    return await buscarConcordanciaIA(palavra, limite);
  } catch (error) {
    console.error("Erro ao buscar concordância:", error);
    throw error;
  }
}

export async function obterTextoCompletoBiblia(
  referencia: string,
): Promise<Verso> {
  try {
    const resultados = await sugerirVersiculosPorTema(referencia, 1);
    if (resultados.length > 0) return resultados[0];
    return { referencia, texto: "Versículo não encontrado.", versao: "ARA" };
  } catch (error) {
    console.error("Erro ao obter texto bíblico:", error);
    throw error;
  }
}
