import { Router, Request, Response } from "express";
import { buscarConcordancia } from "../services/bible.service";
import { getErrorMessage } from "../utils/httpError";

const router = Router();

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

    const limiteNum = parseInt(String(limite) || "10");
    const resultados = await buscarConcordancia(palavra, limiteNum);
    res.json({
      sucesso: true,
      palavra,
      total: resultados.length,
      resultados,
    });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

export default router;
