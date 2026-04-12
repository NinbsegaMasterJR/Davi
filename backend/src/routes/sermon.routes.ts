import { Router, Request, Response } from "express";
import {
  gerarEsbocoPregacao,
  analisarTeologicamente,
  explicarPassagem,
  gerarCronogramaPregacoes,
  gerarCartaPastoralGceu,
  refinarMaterialGerado,
  type AcaoRefinamento,
  type VersaoBiblica,
} from "../services/ia.service";
import { getErrorMessage, getErrorStatus } from "../utils/httpError";
import {
  parseBibleVersion,
  parseInteger,
  parseStringList,
  sanitizeOptionalText,
  sanitizeText,
} from "../utils/validation";

const router = Router();

interface SermonRequest {
  tema: string;
  estilo?: string;
  duracao?: number;
  versaoBiblica?: VersaoBiblica;
}

interface AnalysisRequest {
  tema: string;
  passagem?: string;
  profundidade?: "basico" | "medio" | "avancado";
  versaoBiblica?: VersaoBiblica;
}

interface PastoralLetterRequest {
  tema: string;
  objetivo?: string;
  publicoAlvo?: string;
  tom?: string;
  versaoBiblica?: VersaoBiblica;
}

interface RefineRequest {
  title: string;
  content: string;
  action: AcaoRefinamento;
}

function parseRefinementAction(value: unknown): AcaoRefinamento {
  if (
    value === "encurtar" ||
    value === "aprofundar" ||
    value === "jovens" ||
    value === "perguntas" ||
    value === "slides"
  ) {
    return value;
  }

  return "aprofundar";
}

router.post("/outline", async (req: Request, res: Response) => {
  try {
    const {
      tema,
      estilo,
      duracao,
      versaoBiblica,
    } = req.body as SermonRequest;

    const esboco = await gerarEsbocoPregacao(
      sanitizeText(tema, "Tema", { minLength: 3, maxLength: 120 }),
      sanitizeText(estilo, "Linha teologica", {
        minLength: 3,
        maxLength: 40,
        fallback: "Pentecostal",
      }),
      parseInteger(duracao, "Duracao", { min: 10, max: 120, fallback: 30 }),
      parseBibleVersion(versaoBiblica),
    );
    res.json({ sucesso: true, esboco });
  } catch (error: unknown) {
    res
      .status(getErrorStatus(error))
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

router.post("/analysis", async (req: Request, res: Response) => {
  try {
    const {
      tema,
      passagem,
      profundidade,
      versaoBiblica,
    } = req.body as AnalysisRequest;

    const analise = await analisarTeologicamente(
      sanitizeText(tema, "Tema", { minLength: 3, maxLength: 120 }),
      sanitizeOptionalText(passagem, "Passagem", {
        minLength: 2,
        maxLength: 60,
      }),
      profundidade === "basico" || profundidade === "medio" || profundidade === "avancado"
        ? profundidade
        : "medio",
      parseBibleVersion(versaoBiblica),
    );
    res.json({ sucesso: true, analise });
  } catch (error: unknown) {
    res
      .status(getErrorStatus(error))
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

router.post("/explain", async (req: Request, res: Response) => {
  try {
    const { referencia, versaoBiblica } = req.body as {
      referencia: string;
      versaoBiblica?: VersaoBiblica;
    };

    const explicacao = await explicarPassagem(
      sanitizeText(referencia, "Referencia biblica", {
        minLength: 2,
        maxLength: 60,
      }),
      parseBibleVersion(versaoBiblica),
    );
    res.json({ sucesso: true, explicacao });
  } catch (error: unknown) {
    res
      .status(getErrorStatus(error))
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

router.post("/schedule", async (req: Request, res: Response) => {
  try {
    const {
      mes,
      ano,
      temas,
      estilo,
      versaoBiblica,
    } = req.body as {
      mes: number;
      ano: number;
      temas?: string[];
      estilo?: string;
      versaoBiblica?: VersaoBiblica;
    };

    const cronograma = await gerarCronogramaPregacoes(
      parseInteger(mes, "Mes", { min: 1, max: 12, fallback: 1 }),
      parseInteger(ano, "Ano", {
        min: new Date().getFullYear() - 1,
        max: new Date().getFullYear() + 5,
        fallback: new Date().getFullYear(),
      }),
      sanitizeText(estilo, "Linha teologica", {
        minLength: 3,
        maxLength: 40,
        fallback: "Pentecostal",
      }),
      parseBibleVersion(versaoBiblica),
      parseStringList(temas, "Temas", { maxItems: 12, maxItemLength: 60 }),
    );
    res.json({ sucesso: true, cronograma });
  } catch (error: unknown) {
    res
      .status(getErrorStatus(error))
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

router.post("/pastoral-letter", async (req: Request, res: Response) => {
  try {
    const {
      tema,
      objetivo,
      publicoAlvo,
      tom,
      versaoBiblica,
    } = req.body as PastoralLetterRequest;

    const carta = await gerarCartaPastoralGceu(
      sanitizeText(tema, "Tema", { minLength: 3, maxLength: 120 }),
      sanitizeText(objetivo, "Objetivo pastoral", {
        minLength: 8,
        maxLength: 180,
        fallback: "edificar, orientar e fortalecer a igreja",
      }),
      sanitizeText(publicoAlvo, "Publico-alvo", {
        minLength: 3,
        maxLength: 120,
        fallback: "lideranca, membros e cooperadores do GCEU",
      }),
      sanitizeText(tom, "Tom da carta", {
        minLength: 3,
        maxLength: 80,
        fallback: "pastoral, acolhedor e firme",
      }),
      parseBibleVersion(versaoBiblica),
    );

    res.json({ sucesso: true, carta });
  } catch (error: unknown) {
    res
      .status(getErrorStatus(error))
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

router.post("/refine", async (req: Request, res: Response) => {
  try {
    const { title, content, action } = req.body as RefineRequest;
    const refined = await refinarMaterialGerado(
      sanitizeText(title, "Titulo", { minLength: 3, maxLength: 120 }),
      sanitizeText(content, "Conteudo", { minLength: 20, maxLength: 18000 }),
      parseRefinementAction(action),
    );

    res.json({ sucesso: true, refined });
  } catch (error: unknown) {
    res
      .status(getErrorStatus(error))
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

export default router;
