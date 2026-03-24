import { Router, Request, Response } from "express";
import {
  gerarEsbocoPregacao,
  analisarTeologicamente,
  explicarPassagem,
} from "../services/ia.service";

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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Criar cronograma de pregações
router.post("/schedule", async (req: Request, res: Response) => {
  try {
    const { mes, ano, temas, estilo = "Pentecostal" } = req.body;

    // TODO: Implementar lógica de cronograma
    const cronograma = {
      mes,
      ano,
      pregacoes: temas.map((tema: string, index: number) => ({
        semana: index + 1,
        data: new Date(),
        tema,
        estilo,
      })),
    };

    res.json({ sucesso: true, cronograma });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
