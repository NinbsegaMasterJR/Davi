import { Router, Request, Response } from "express";
import {
  analisarTeologicamente,
  type VersaoBiblica,
} from "../services/ia.service";
import { getErrorMessage } from "../utils/httpError";
import {
  parseBibleVersion,
  sanitizeOptionalText,
  sanitizeText,
} from "../utils/validation";

const router = Router();

router.post("/theological", async (req: Request, res: Response) => {
  try {
    const {
      tema,
      profundidade,
      passagem,
      versaoBiblica,
    } = req.body as {
      tema: string;
      profundidade?: "basico" | "medio" | "avancado";
      passagem?: string;
      versaoBiblica?: VersaoBiblica;
    };

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
    res.json({ sucesso: true, tema, profundidade, analise });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

export default router;
