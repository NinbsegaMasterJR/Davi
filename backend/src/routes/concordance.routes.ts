import { Router, Request, Response } from "express";
import { buscarConcordancia } from "../services/bible.service";
import { getErrorMessage } from "../utils/httpError";
import {
  parseBibleVersion,
  parseInteger,
  sanitizeText,
} from "../utils/validation";

const router = Router();

router.get("/search", async (req: Request, res: Response) => {
  try {
    const { palavra, limite, versaoBiblica } = req.query as {
      palavra: string;
      limite?: string;
      versaoBiblica?: "ARA" | "ARC" | "ARCF" | "KING_JAMES";
    };
    const resultados = await buscarConcordancia(
      sanitizeText(palavra, "Palavra", { minLength: 2, maxLength: 80 }),
      parseInteger(limite, "Limite", { min: 1, max: 20, fallback: 10 }),
      parseBibleVersion(versaoBiblica),
    );
    res.json({
      sucesso: true,
      palavra: sanitizeText(palavra, "Palavra", { minLength: 2, maxLength: 80 }),
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
