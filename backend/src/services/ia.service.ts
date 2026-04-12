import Groq from "groq-sdk";

let groqClient: Groq | null = null;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const BIBLICAL_REVIEW_SYSTEM_PROMPT =
  "Voce apoia preparo biblico e pastoral. Nunca apresente saidas como infaliveis. Ao citar textos biblicos, prefira referencias e citacoes curtas, oriente conferencia em fonte biblica confiavel e preserve responsabilidade pastoral, contexto local e revisao doutrinaria.";

export type VersaoBiblica = "ARA" | "ARC" | "ARCF" | "KING_JAMES";
export type AcaoRefinamento =
  | "encurtar"
  | "aprofundar"
  | "jovens"
  | "perguntas"
  | "slides";

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

async function criarResposta(
  messages: Array<{ role: "system" | "user"; content: string }>,
  maxTokens: number,
) {
  const groq = getGroqClient();

  return groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.4,
    max_tokens: maxTokens,
    messages: [
      {
        role: "system",
        content: BIBLICAL_REVIEW_SYSTEM_PROMPT,
      },
      ...messages,
    ],
  });
}

function getInstrucaoRefinamento(acao: AcaoRefinamento): string {
  switch (acao) {
    case "encurtar":
      return "Encurte o material, mantenha a ideia central e preserve as referencias principais.";
    case "aprofundar":
      return "Aprofunde o material com mais contexto, conexoes biblicas e aplicacao pastoral, sem perder clareza.";
    case "jovens":
      return "Adapte a linguagem para jovens, com exemplos mais proximos do cotidiano e tom pastoral direto.";
    case "perguntas":
      return "Transforme o material em perguntas para conversa em GCEU ou pequeno grupo, com abertura, discussao e aplicacao.";
    case "slides":
      return "Transforme o material em roteiro de slides, com titulo, blocos curtos, texto base e sugestao de fechamento.";
    default:
      return "Refine o material mantendo fidelidade biblica, clareza e aplicacao pastoral.";
  }
}

function parseVerseArray(content: string): VersoIA[] {
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    return [];
  }

  const parsed = JSON.parse(jsonMatch[0]) as unknown;
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .filter(
      (item): item is VersoIA =>
        typeof item === "object" &&
        item !== null &&
        "referencia" in item &&
        "texto" in item &&
        typeof item.referencia === "string" &&
        typeof item.texto === "string",
    )
    .map((item) => ({
      referencia: item.referencia.trim(),
      texto: item.texto.trim(),
      versao:
        typeof item.versao === "string" && item.versao.trim()
          ? item.versao.trim()
          : "ARA",
    }))
    .filter((item) => item.referencia && item.texto);
}

export async function gerarEsbocoPregacao(
  tema: string,
  estilo: string,
  duracao: number,
  versaoBiblica: VersaoBiblica = "ARA",
): Promise<string> {
  try {
    const nomeVersao = getNomeVersaoBiblica(versaoBiblica);

    const prompt = `Voce e um especialista em pregacoes pentecostais. Crie um esboco estruturado de pregacao sobre o tema "${tema}" no estilo "${estilo}" com duracao aproximada de ${duracao} minutos.

O esboco deve seguir obrigatoriamente esta estrutura, nesta ordem, com estes rotulos:
1. TEMA:
2. TEXTO:
3. IDEIA CENTRAL DO TEXTO:
4. OBJETIVO GERAL DO ESBOCO:
5. OBJETIVO ESPECIFICO DO ESBOCO:
6. TESE DO ESBOCO:
7. FRASE DE TRANSICAO DO ESBOCO PARA COLOCAR COMO SUGESTAO:
8. ESBOCO:
   I. INTRODUCAO:
   DESENVOLVIMENTO:
   II. TOPICO 1 (SUBTEMA DO ESBOCO)
   2.1 EXEGESE
   2.2 APLICACAO PRATICA
   III. TOPICO 2 (SUBTEMA DO ESBOCO)
   3.1 EXEGESE
   3.2 APLICACAO PRATICA
   IV. TOPICO 3 (SUBTEMA DO ESBOCO)
   4.1 EXEGESE
   4.2 APLICACAO PRATICA
   V. CONCLUSAO

Regras importantes:
- Nao crie secoes principais fora da estrutura acima
- Escolha um texto biblico principal coerente com o tema e coloque em "TEXTO"
- Em cada topico, substitua "(SUBTEMA DO ESBOCO)" por um subtitulo claro e relacionado a tese
- Em cada "EXEGESE", explique o contexto, o sentido do texto e a ideia teologica do ponto
- Em cada "APLICACAO PRATICA", mostre como a igreja deve responder ao ponto pregado
- A conclusao deve retomar a tese, resumir os tres topicos e terminar com apelo pastoral
- Use referencias e citacoes biblicas em ${nomeVersao}
- Evite respostas genericas, rasas ou repetitivas
- Responda em portugues

Formato: Use Markdown bem estruturado e mantenha os titulos exatamente na ordem solicitada.
Se possivel, faca o resultado soar pronto para ser pregado.`;

    const response = await criarResposta([{ role: "user", content: prompt }], 3000);

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

    const response = await criarResposta([{ role: "user", content: prompt }], 2500);

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

    const response = await criarResposta([{ role: "user", content: prompt }], 2000);

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
    const nomeVersao = getNomeVersaoBiblica(versaoBiblica);
    const prompt = `Liste exatamente ${quantidade} versiculos biblicos relevantes sobre o tema "${tema}".
Retorne APENAS um array JSON valido, sem texto adicional, no seguinte formato:
[
  {"referencia": "Joao 3:16", "texto": "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigenito...", "versao": "${versaoBiblica}"},
  {"referencia": "Romanos 8:28", "texto": "Sabemos que todas as coisas cooperam para o bem...", "versao": "${versaoBiblica}"}
]
Use a versao ${nomeVersao}.
Nao invente referencias. Se nao tiver confianca suficiente em alguma citacao, omita esse item.`;

    const response = await criarResposta([{ role: "user", content: prompt }], 1500);

    const content = response.choices[0]?.message?.content || "[]";
    return parseVerseArray(content).slice(0, quantidade);
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
    const nomeVersao = getNomeVersaoBiblica(versaoBiblica);
    const prompt = `Encontre ${limite} versiculos biblicos que contenham ou se relacionem diretamente com a palavra/conceito "${palavra}".
Retorne APENAS um array JSON valido, sem texto adicional, no formato:
[
  {"referencia": "Salmos 119:105", "texto": "Lampada para os meus pes e tua palavra...", "versao": "${versaoBiblica}"}
]
Use a versao ${nomeVersao}.
Nao invente referencias. Se nao tiver confianca suficiente em alguma citacao, omita esse item.`;

    const response = await criarResposta([{ role: "user", content: prompt }], 1500);

    const content = response.choices[0]?.message?.content || "[]";
    return parseVerseArray(content).slice(0, limite);
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

    const response = await criarResposta([{ role: "user", content: prompt }], 2000);

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

    const response = await criarResposta([{ role: "user", content: prompt }], 2200);

    return (
      response.choices[0]?.message?.content || "Erro ao gerar carta pastoral"
    );
  } catch (error) {
    console.error("Erro ao gerar carta pastoral:", error);
    throw error;
  }
}

export async function refinarMaterialGerado(
  titulo: string,
  conteudo: string,
  acao: AcaoRefinamento,
): Promise<string> {
  try {
    const instrucao = getInstrucaoRefinamento(acao);
    const prompt = `Refine o material pastoral abaixo.

Titulo: ${titulo}

Pedido de ajuste:
${instrucao}

Regras:
- Mantenha a resposta em portugues
- Preserve a intencao original do material
- Nao invente texto biblico longo nem trate referencias como verificadas
- Inclua ao final uma pequena secao "Conferencia antes de usar" com pontos de revisao biblica e pastoral
- Formate em Markdown claro

Material original:
${conteudo}`;

    const response = await criarResposta([{ role: "user", content: prompt }], 2600);

    return response.choices[0]?.message?.content || "Erro ao refinar material";
  } catch (error) {
    console.error("Erro ao refinar material:", error);
    throw error;
  }
}
