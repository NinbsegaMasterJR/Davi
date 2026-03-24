import { Router, Request, Response } from "express";
import { buscarConcordancia } from "../services/bible.service";

const router = Router();

interface ConcordanceRequest {
  palavra: string;
  limite?: number;
}

// Buscar concordância bíblica
router.get("/search", async (req: Request, res: Response) => {
  try {
    const { palavra, limite = 10 } = req.query as {
      palavra: string;
      limite?: string;
    };

    if (!palavra) {
      res.status(400).json({ error: "Palavra é obrigatória" });
      return;
    }

    const resultados = await buscarConcordancia(palavra);
    res.json({
      sucesso: true,
      palavra,
      total: resultados.length,
      resultados: resultados.slice(0, parseInt(String(limite) || "10")),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
