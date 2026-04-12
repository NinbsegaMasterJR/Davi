import { Router, Request, Response } from "express";
import {
  buscarVersiculos,
  obterTextoCompletoBiblia,
} from "../services/bible.service";
import { getErrorMessage, getErrorStatus } from "../utils/httpError";
import {
  parseBibleVersion,
  parseInteger,
  sanitizeText,
} from "../utils/validation";

const router = Router();

router.get("/suggest", async (req: Request, res: Response) => {
  try {
    const { tema, limite, versaoBiblica } = req.query as {
      tema: string;
      limite?: string;
      versaoBiblica?: "ARA" | "ARC" | "ARCF" | "KING_JAMES";
    };

    const versiculos = await buscarVersiculos(
      sanitizeText(tema, "Tema", { minLength: 2, maxLength: 120 }),
      parseInteger(limite, "Limite", { min: 1, max: 15, fallback: 5 }),
      parseBibleVersion(versaoBiblica),
    );

    res.json({
      sucesso: true,
      tema,
      versiculos,
    });
  } catch (error: unknown) {
    res
      .status(getErrorStatus(error))
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

router.get("/:referencia", async (req: Request, res: Response) => {
  try {
    const { referencia } = req.params;
    const { versaoBiblica } = req.query as {
      versaoBiblica?: "ARA" | "ARC" | "ARCF" | "KING_JAMES";
    };

    const verso = await obterTextoCompletoBiblia(
      sanitizeText(referencia, "Referencia", { minLength: 2, maxLength: 60 }),
      parseBibleVersion(versaoBiblica),
    );
    res.json({
      sucesso: true,
      verso,
    });
  } catch (error: unknown) {
    res
      .status(getErrorStatus(error))
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

export default router;
