import { Router, Request, Response } from "express";
import {
  gerarEsbocoPregacao,
  analisarTeologicamente,
  explicarPassagem,
  gerarCronogramaPregacoes,
} from "../services/ia.service";
import { getErrorMessage } from "../utils/httpError";

const router = Router();

interface SermonRequest {
  tema: string;
  estilo?: string;
  duracao?: number;
}

interface AnalysisRequest {
  tema: string;
  passagem?: string;
}

// Gerar esboço de pregação
router.post("/outline", async (req: Request, res: Response) => {
  try {
    const {
      tema,
      estilo = "Pentecostal",
      duracao = 30,
    } = req.body as SermonRequest;

    if (!tema) {
      res.status(400).json({ error: "Tema é obrigatório" });
      return;
    }

    const esboço = await gerarEsbocoPregacao(tema, estilo, duracao);
    res.json({ sucesso: true, esboço });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

// Análise teológica
router.post("/analysis", async (req: Request, res: Response) => {
  try {
    const { tema, passagem } = req.body as AnalysisRequest;

    if (!tema) {
      res.status(400).json({ error: "Tema é obrigatório" });
      return;
    }

    const analise = await analisarTeologicamente(tema, passagem);
    res.json({ sucesso: true, analise });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

// Explicar passagem
router.post("/explain", async (req: Request, res: Response) => {
  try {
    const { referencia } = req.body as { referencia: string };

    if (!referencia) {
      res.status(400).json({ error: "Referência bíblica é obrigatória" });
      return;
    }

    const explicacao = await explicarPassagem(referencia);
    res.json({ sucesso: true, explicacao });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

// Criar cronograma de pregações
router.post("/schedule", async (req: Request, res: Response) => {
  try {
    const { mes, ano, temas, estilo = "Pentecostal" } = req.body;

    if (!mes || !ano) {
      res.status(400).json({ error: "Mês e ano são obrigatórios" });
      return;
    }

    const cronograma = await gerarCronogramaPregacoes(mes, ano, estilo, temas);
    res.json({ sucesso: true, cronograma });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

export default router;
