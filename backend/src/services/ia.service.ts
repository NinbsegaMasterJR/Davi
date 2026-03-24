import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function gerarEsbocoPregacao(
  tema: string,
  estilo: string,
  duracao: number,
): Promise<string> {
  try {
    const prompt = `Você é um especialista em pregações pentecostais. Crie um esboço estruturado de pregação sobre o tema "${tema}" no estilo "${estilo}" com duração aproximada de ${duracao} minutos.

O esboço deve ter:
1. Título atrativo
2. Versículo base
3. Introdução (2-3 pontos principais)
4. Desenvolvimento (3-4 pontos relacionados)
5. Conclusão com apelo
6. Versículos de apoio sugeridos

Formato: Use Markdown bem estruturado.`;

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.content[0].type === "text"
      ? response.content[0].text
      : "Erro ao gerar esboço";
  } catch (error) {
    console.error("Erro ao gerar esboço:", error);
    throw error;
  }
}

export async function analisarTeologicamente(
  tema: string,
  passagem?: string,
): Promise<string> {
  try {
    const passagemText = passagem ? ` Passagem específica: ${passagem}` : "";
    const prompt = `Você é um teólogo experiente. Faça uma análise teológica profunda sobre "${tema}".${passagemText}

A análise deve cobrir:
1. Fundamento bíblico
2. Contexto histórico-cultural
3. Interpretação teológica
4. Aplicação prática moderna
5. Relação com a doutrina pentecostal

Seja aprofundado e academicamente rigoroso.`;

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.content[0].type === "text"
      ? response.content[0].text
      : "Erro ao analisar";
  } catch (error) {
    console.error("Erro na análise teológica:", error);
    throw error;
  }
}

export async function explicarPassagem(referencia: string): Promise<string> {
  try {
    const prompt = `Explique detalhadamente a passagem bíblica: ${referencia}

Sua explicação deve incluir:
1. Contexto da passagem
2. Significado direto do texto
3. Interpretação teológica
4. Aplicação para a vida cristã moderna
5. Conexões com outras passagens
6. Insights para pregação

Seja claro e acessível.`;

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.content[0].type === "text"
      ? response.content[0].text
      : "Erro ao explicar";
  } catch (error) {
    console.error("Erro ao explicar passagem:", error);
    throw error;
  }
}
