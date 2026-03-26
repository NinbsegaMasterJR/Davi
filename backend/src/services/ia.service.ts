import Groq from "groq-sdk";

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY não configurada. Defina a variável de ambiente no backend.",
    );
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }

  return groqClient;
}

export async function gerarEsbocoPregacao(
  tema: string,
  estilo: string,
  duracao: number,
): Promise<string> {
  try {
    const groq = getGroqClient();
    const prompt = `Você é um especialista em pregações pentecostais. Crie um esboço estruturado de pregação sobre o tema "${tema}" no estilo "${estilo}" com duração aproximada de ${duracao} minutos.

O esboço deve ter:
1. Título atrativo
2. Versículo base
3. Introdução (2-3 pontos principais)
4. Desenvolvimento (3-4 pontos relacionados)
5. Conclusão com apelo
6. Versículos de apoio sugeridos

Formato: Use Markdown bem estruturado.`;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.choices[0]?.message?.content || "Erro ao gerar esboço";
  } catch (error) {
    console.error("Erro ao gerar esboço:", error);
    throw error;
  }
}

export async function analisarTeologicamente(
  tema: string,
  passagem?: string,
  profundidade: string = "medio",
): Promise<string> {
  try {
    const groq = getGroqClient();
    const passagemText = passagem ? ` Passagem específica: ${passagem}` : "";
    const nivelDetalhe =
      profundidade === "avancado"
        ? "extremamente detalhado e academicamente rigoroso, com referências cruzadas e análise exegética"
        : profundidade === "basico"
          ? "acessível e prático, adequado para leigos"
          : "equilibrado entre profundidade teológica e acessibilidade";
    const prompt = `Você é um teólogo experiente. Faça uma análise teológica ${nivelDetalhe} sobre "${tema}".${passagemText}

A análise deve cobrir:
1. Fundamento bíblico
2. Contexto histórico-cultural
3. Interpretação teológica
4. Aplicação prática moderna
5. Relação com a doutrina pentecostal

Formate com Markdown bem estruturado.`;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 2500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.choices[0]?.message?.content || "Erro ao analisar";
  } catch (error) {
    console.error("Erro na análise teológica:", error);
    throw error;
  }
}

export async function explicarPassagem(referencia: string): Promise<string> {
  try {
    const groq = getGroqClient();
    const prompt = `Explique detalhadamente a passagem bíblica: ${referencia}

Sua explicação deve incluir:
1. Contexto da passagem
2. Significado direto do texto
3. Interpretação teológica
4. Aplicação para a vida cristã moderna
5. Conexões com outras passagens
6. Insights para pregação

Seja claro e acessível.`;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.choices[0]?.message?.content || "Erro ao explicar";
  } catch (error) {
    console.error("Erro ao explicar passagem:", error);
    throw error;
  }
}

export interface VersoIA {
  referencia: string;
  texto: string;
  versao: string;
}

export async function sugerirVersiculosPorTema(
  tema: string,
  quantidade: number = 5,
): Promise<VersoIA[]> {
  try {
    const groq = getGroqClient();
    const prompt = `Liste exatamente ${quantidade} versículos bíblicos relevantes sobre o tema "${tema}".
Retorne APENAS um array JSON válido, sem texto adicional, no seguinte formato:
[
  {"referencia": "João 3:16", "texto": "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito...", "versao": "ARA"},
  {"referencia": "Romanos 8:28", "texto": "Sabemos que todas as coisas cooperam para o bem...", "versao": "ARA"}
]
Use a versão ARA (Almeida Revista e Atualizada) e textos precisos.`;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0]?.message?.content || "[]";
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]) as VersoIA[];
  } catch (error) {
    console.error("Erro ao sugerir versículos:", error);
    throw error;
  }
}

export async function buscarConcordanciaIA(
  palavra: string,
  limite: number = 10,
): Promise<VersoIA[]> {
  try {
    const groq = getGroqClient();
    const prompt = `Encontre ${limite} versículos bíblicos que contenham ou se relacionem diretamente com a palavra/conceito "${palavra}".
Retorne APENAS um array JSON válido, sem texto adicional, no formato:
[
  {"referencia": "Salmos 119:105", "texto": "Lâmpada para os meus pés é tua palavra...", "versao": "ARA"}
]
Use a versão ARA (Almeida Revista e Atualizada) e textos precisos.`;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0]?.message?.content || "[]";
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]) as VersoIA[];
  } catch (error) {
    console.error("Erro ao buscar concordância:", error);
    throw error;
  }
}

export async function gerarCronogramaPregacoes(
  mes: number,
  ano: number,
  estilo: string,
  temas?: string[],
): Promise<string> {
  try {
    const groq = getGroqClient();
    const nomesMeses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    const nomeMes = nomesMeses[mes - 1];
    const temasText =
      temas && temas.length > 0
        ? `Sugira pregações baseadas nestes temas: ${temas.join(", ")}.`
        : "Sugira temas relevantes e variados para o mês.";

    const prompt = `Crie um cronograma mensal de pregações para ${nomeMes}/${ano} no estilo ${estilo}.
${temasText}

O cronograma deve incluir:
- Uma pregação para cada domingo do mês
- Título atrativo
- Tema principal
- Versículo base
- Breve subtítulo ou foco da mensagem

Formate com Markdown bem estruturado, organizado por semana/domingo.`;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0]?.message?.content || "Erro ao gerar cronograma";
  } catch (error) {
    console.error("Erro ao gerar cronograma:", error);
    throw error;
  }
}
