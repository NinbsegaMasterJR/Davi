import axios from "axios";

interface Verso {
  referencia: string;
  texto: string;
  versao?: string;
}

const BIBLE_API_URL = "https://api.scripture.api.bible/v1";
const BIBLE_API_KEY = process.env.BIBLE_API_KEY;

export async function buscarVersiculos(tema: string): Promise<Verso[]> {
  try {
    // Esta é uma implementação simplificada
    // Para uma implementação real, seria necessário integrar com uma Bible API
    // Aqui vamos usar uma resposta mockada ou integrar com api.scripture.api.bible

    const versiculos: Verso[] = [
      {
        referencia: "João 3:16",
        texto:
          "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito...",
        versao: "ARA",
      },
      {
        referencia: "Romanos 6:9",
        texto:
          "Sabendo que Cristo, ressurgido dentre os mortos, já não morre...",
        versao: "ARA",
      },
    ];

    return versiculos;
  } catch (error) {
    console.error("Erro ao buscar versículos:", error);
    throw error;
  }
}

export async function buscarConcordancia(palavra: string): Promise<Verso[]> {
  try {
    // Implementação simplificada - integrar com Bible API real
    const resultados: Verso[] = [
      {
        referencia: "Mateus 26:39",
        texto: "E, adiantando-se um pouco, prostrou-se sobre o seu rosto...",
        versao: "ARA",
      },
    ];

    return resultados;
  } catch (error) {
    console.error("Erro ao buscar concordância:", error);
    throw error;
  }
}

export async function obterTextoCompletoBiblia(
  referencia: string,
): Promise<Verso> {
  try {
    // Implementação com Bible API
    const verso: Verso = {
      referencia,
      texto: "Texto do verso...",
      versao: "ARA",
    };

    return verso;
  } catch (error) {
    console.error("Erro ao obter texto bíblico:", error);
    throw error;
  }
}
