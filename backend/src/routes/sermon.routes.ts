import { Router, Request, Response } from "express";
import {
  gerarEsbocoPregacao,
  analisarTeologicamente,
  explicarPassagem,
  gerarCronogramaPregacoes,
  gerarCartaPastoralGceu,
  type VersaoBiblica,
} from "../services/ia.service";
import { getErrorMessage } from "../utils/httpError";

const router = Router();

interface SermonRequest {
  tema: string;
  estilo?: string;
  duracao?: number;
  versaoBiblica?: VersaoBiblica;
  secoesOpcionais?: {
    exegese?: boolean;
    ilustracao?: boolean;
    aplicacaoPratica?: boolean;
  };
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

router.post("/outline", async (req: Request, res: Response) => {
  try {
    const {
      tema,
      estilo = "Pentecostal",
      duracao = 30,
      versaoBiblica = "ARA",
      secoesOpcionais,
    } = req.body as SermonRequest;

    if (!tema) {
      res.status(400).json({ error: "Tema e obrigatorio" });
      return;
    }

    const esboco = await gerarEsbocoPregacao(
      tema,
      estilo,
      duracao,
      versaoBiblica,
      secoesOpcionais,
    );
    res.json({ sucesso: true, esboco });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

router.post("/analysis", async (req: Request, res: Response) => {
  try {
    const {
      tema,
      passagem,
      profundidade = "medio",
      versaoBiblica = "ARA",
    } = req.body as AnalysisRequest;

    if (!tema) {
      res.status(400).json({ error: "Tema e obrigatorio" });
      return;
    }

    const analise = await analisarTeologicamente(
      tema,
      passagem,
      profundidade,
      versaoBiblica,
    );
    res.json({ sucesso: true, analise });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

router.post("/explain", async (req: Request, res: Response) => {
  try {
    const { referencia, versaoBiblica = "ARA" } = req.body as {
      referencia: string;
      versaoBiblica?: VersaoBiblica;
    };

    if (!referencia) {
      res.status(400).json({ error: "Referencia biblica e obrigatoria" });
      return;
    }

    const explicacao = await explicarPassagem(referencia, versaoBiblica);
    res.json({ sucesso: true, explicacao });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

router.post("/schedule", async (req: Request, res: Response) => {
  try {
    const {
      mes,
      ano,
      temas,
      estilo = "Pentecostal",
      versaoBiblica = "ARA",
    } = req.body as {
      mes: number;
      ano: number;
      temas?: string[];
      estilo?: string;
      versaoBiblica?: VersaoBiblica;
    };

    if (!mes || !ano) {
      res.status(400).json({ error: "Mes e ano sao obrigatorios" });
      return;
    }

    const cronograma = await gerarCronogramaPregacoes(
      mes,
      ano,
      estilo,
      versaoBiblica,
      temas,
    );
    res.json({ sucesso: true, cronograma });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

router.post("/pastoral-letter", async (req: Request, res: Response) => {
  try {
    const {
      tema,
      objetivo = "edificar, orientar e fortalecer a igreja",
      publicoAlvo = "lideranca, membros e cooperadores do GCEU",
      tom = "pastoral, acolhedor e firme",
      versaoBiblica = "ARA",
    } = req.body as PastoralLetterRequest;

    if (!tema) {
      res.status(400).json({ error: "Tema e obrigatorio" });
      return;
    }

    const carta = await gerarCartaPastoralGceu(
      tema,
      objetivo,
      publicoAlvo,
      tom,
      versaoBiblica,
    );

    res.json({ sucesso: true, carta });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

export default router;
