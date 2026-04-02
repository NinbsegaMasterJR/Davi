import Groq from "groq-sdk";

let groqClient: Groq | null = null;

export type VersaoBiblica = "ARA" | "ARC" | "ARCF" | "KING_JAMES";

function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY nao configurada. Defina a variavel de ambiente no backend.",
    );
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }

  return groqClient;
}

function getNomeVersaoBiblica(versao: VersaoBiblica = "ARA"): string {
  switch (versao) {
    case "ARC":
      return "ARC (Almeida Revista e Corrigida)";
    case "ARCF":
      return "ARCF (Almeida Revista e Corrigida Fiel)";
    case "KING_JAMES":
      return "King James";
    case "ARA":
    default:
      return "ARA (Almeida Revista e Atualizada)";
  }
}

export async function gerarEsbocoPregacao(
  tema: string,
  estilo: string,
  duracao: number,
  versaoBiblica: VersaoBiblica = "ARA",
  secoesOpcionais?: {
    exegese?: boolean;
    ilustracao?: boolean;
    aplicacaoPratica?: boolean;
  },
): Promise<string> {
  try {
    const groq = getGroqClient();
    const incluirExegese = secoesOpcionais?.exegese ?? false;
    const incluirIlustracao = secoesOpcionais?.ilustracao ?? false;
    const incluirAplicacaoPratica =
      secoesOpcionais?.aplicacaoPratica ?? false;
    const nomeVersao = getNomeVersaoBiblica(versaoBiblica);

    const secoesExtras = [
      incluirExegese ? "5. Exegese" : null,
      incluirIlustracao ? `${incluirExegese ? 6 : 5}. Ilustracao` : null,
      incluirAplicacaoPratica
        ? `${5 + Number(incluirExegese) + Number(incluirIlustracao)}. Aplicacao pratica`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    const numeroConclusao =
      5 +
      Number(incluirExegese) +
      Number(incluirIlustracao) +
      Number(incluirAplicacaoPratica);
    const numeroVersiculos = numeroConclusao + 1;

    const instrucoesOpcionais = [
      incluirExegese
        ? '- Inclua a secao "Exegese" com contexto historico, contexto literario, palavras-chave do texto e a verdade central da passagem'
        : '- Nao inclua a secao "Exegese"',
      incluirIlustracao
        ? '- Inclua a secao "Ilustracao" com pelo menos 1 exemplo concreto, memoravel e fiel a mensagem biblica'
        : '- Nao inclua a secao "Ilustracao"',
      incluirAplicacaoPratica
        ? '- Inclua a secao "Aplicacao pratica" com pelo menos 3 aplicacoes objetivas em lista numerada'
        : '- Nao inclua a secao "Aplicacao pratica"',
    ].join("\n");

    const prompt = `Voce e um especialista em pregacoes pentecostais. Crie um esboco estruturado de pregacao sobre o tema "${tema}" no estilo "${estilo}" com duracao aproximada de ${duracao} minutos.

O esboco deve ter obrigatoriamente, nesta ordem:
1. Titulo atrativo
2. Versiculo base
3. Introducao
4. Desenvolvimento (3-4 pontos relacionados)
${secoesExtras ? `${secoesExtras}\n` : ""}${numeroConclusao}. Conclusao com apelo
${numeroVersiculos}. Versiculos de apoio sugeridos

Regras importantes:
- Sempre respeite exatamente as secoes opcionais solicitadas
${instrucoesOpcionais}
- Use referencias e citacoes biblicas em ${nomeVersao}
- Evite respostas genericas, rasas ou repetitivas
- Responda em portugues

Formato: Use Markdown bem estruturado, com titulos e subtitulos claros.
Se possivel, faca o resultado soar pronto para ser pregado.`;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0]?.message?.content || "Erro ao gerar esboco";
  } catch (error) {
    console.error("Erro ao gerar esboco:", error);
    throw error;
  }
}

export async function analisarTeologicamente(
  tema: string,
  passagem?: string,
  profundidade: string = "medio",
  versaoBiblica: VersaoBiblica = "ARA",
): Promise<string> {
  try {
    const groq = getGroqClient();
    const passagemText = passagem ? ` Passagem especifica: ${passagem}` : "";
    const nomeVersao = getNomeVersaoBiblica(versaoBiblica);
    const nivelDetalhe =
      profundidade === "avancado"
        ? "extremamente detalhado e academicamente rigoroso, com referencias cruzadas e analise exegetica"
        : profundidade === "basico"
          ? "acessivel e pratico, adequado para leigos"
          : "equilibrado entre profundidade teologica e acessibilidade";

    const prompt = `Voce e um teologo experiente. Faca uma analise teologica ${nivelDetalhe} sobre "${tema}".${passagemText}

A analise deve cobrir:
1. Fundamento biblico
2. Contexto historico-cultural
3. Interpretacao teologica
4. Aplicacao pratica moderna
5. Relacao com a doutrina pentecostal

Use referencias e citacoes biblicas em ${nomeVersao}.
Formate com Markdown bem estruturado.`;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0]?.message?.content || "Erro ao analisar";
  } catch (error) {
    console.error("Erro na analise teologica:", error);
    throw error;
  }
}

export async function explicarPassagem(
  referencia: string,
  versaoBiblica: VersaoBiblica = "ARA",
): Promise<string> {
  try {
    const groq = getGroqClient();
    const nomeVersao = getNomeVersaoBiblica(versaoBiblica);
    const prompt = `Explique detalhadamente a passagem biblica: ${referencia}

Sua explicacao deve incluir:
1. Contexto da passagem
2. Significado direto do texto
3. Interpretacao teologica
4. Aplicacao para a vida crista moderna
5. Conexoes com outras passagens
6. Insights para pregacao

Use a versao ${nomeVersao} ao citar o texto biblico.
Seja claro e acessivel.`;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
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
  versaoBiblica: VersaoBiblica = "ARA",
): Promise<VersoIA[]> {
  try {
    const groq = getGroqClient();
    const nomeVersao = getNomeVersaoBiblica(versaoBiblica);
    const prompt = `Liste exatamente ${quantidade} versiculos biblicos relevantes sobre o tema "${tema}".
Retorne APENAS um array JSON valido, sem texto adicional, no seguinte formato:
[
  {"referencia": "Joao 3:16", "texto": "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigenito...", "versao": "${versaoBiblica}"},
  {"referencia": "Romanos 8:28", "texto": "Sabemos que todas as coisas cooperam para o bem...", "versao": "${versaoBiblica}"}
]
Use a versao ${nomeVersao} e textos precisos.`;

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
    console.error("Erro ao sugerir versiculos:", error);
    throw error;
  }
}

export async function buscarConcordanciaIA(
  palavra: string,
  limite: number = 10,
  versaoBiblica: VersaoBiblica = "ARA",
): Promise<VersoIA[]> {
  try {
    const groq = getGroqClient();
    const nomeVersao = getNomeVersaoBiblica(versaoBiblica);
    const prompt = `Encontre ${limite} versiculos biblicos que contenham ou se relacionem diretamente com a palavra/conceito "${palavra}".
Retorne APENAS um array JSON valido, sem texto adicional, no formato:
[
  {"referencia": "Salmos 119:105", "texto": "Lampada para os meus pes e tua palavra...", "versao": "${versaoBiblica}"}
]
Use a versao ${nomeVersao} e textos precisos.`;

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
    console.error("Erro ao buscar concordancia:", error);
    throw error;
  }
}

export async function gerarCronogramaPregacoes(
  mes: number,
  ano: number,
  estilo: string,
  versaoBiblica: VersaoBiblica = "ARA",
  temas?: string[],
): Promise<string> {
  try {
    const groq = getGroqClient();
    const nomeVersao = getNomeVersaoBiblica(versaoBiblica);
    const nomesMeses = [
      "Janeiro",
      "Fevereiro",
      "Marco",
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
        ? `Sugira pregacoes baseadas nestes temas: ${temas.join(", ")}.`
        : "Sugira temas relevantes e variados para o mes.";

    const prompt = `Crie um cronograma mensal de pregacoes para ${nomeMes}/${ano} no estilo ${estilo}.
${temasText}

O cronograma deve incluir:
- Uma pregacao para cada domingo do mes
- Titulo atrativo
- Tema principal
- Versiculo base
- Breve subtitulo ou foco da mensagem
- Use referencias biblicas em ${nomeVersao}

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

export async function gerarCartaPastoralGceu(
  tema: string,
  objetivo: string,
  publicoAlvo: string,
  tom: string,
  versaoBiblica: VersaoBiblica = "ARA",
): Promise<string> {
  try {
    const groq = getGroqClient();
    const nomeVersao = getNomeVersaoBiblica(versaoBiblica);
    const prompt = `Voce e um redator pastoral experiente. Crie uma carta pastoral para GCEU sobre "${tema}".

Contexto da carta:
- Objetivo principal: ${objetivo}
- Publico-alvo: ${publicoAlvo}
- Tom desejado: ${tom}

A carta deve conter:
1. Titulo pastoral apropriado
2. Saudacao inicial calorosa
3. Desenvolvimento pastoral com orientacao espiritual clara
4. Exortacao, encorajamento ou alinhamento conforme o tema
5. Pelo menos 2 referencias biblicas relevantes em ${nomeVersao}
6. Encerramento pastoral com chamada a oracao, unidade ou resposta pratica

Regras:
- Escreva em portugues
- Soe pastoral, maduro, biblico e edificante
- Mencione GCEU naturalmente no texto
- Evite linguagem excessivamente burocratica
- Formate em Markdown bem organizado

Entregue um texto pronto para leitura, adaptacao ou envio.`;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 2200,
      messages: [{ role: "user", content: prompt }],
    });

    return (
      response.choices[0]?.message?.content || "Erro ao gerar carta pastoral"
    );
  } catch (error) {
    console.error("Erro ao gerar carta pastoral:", error);
    throw error;
  }
}
