import { Router, Request, Response } from "express";
import { buscarConcordancia } from "../services/bible.service";
import { getErrorMessage } from "../utils/httpError";

const router = Router();

router.get("/search", async (req: Request, res: Response) => {
  try {
    const { palavra, limite = 10, versaoBiblica = "ARA" } = req.query as {
      palavra: string;
      limite?: string;
      versaoBiblica?: "ARA" | "ARC" | "ARCF" | "KING_JAMES";
    };

    if (!palavra) {
      res.status(400).json({ error: "Palavra e obrigatoria" });
      return;
    }

    const limiteNum = parseInt(String(limite) || "10", 10);
    const resultados = await buscarConcordancia(
      palavra,
      limiteNum,
      versaoBiblica,
    );
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
