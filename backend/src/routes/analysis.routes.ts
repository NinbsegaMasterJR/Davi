import { Router, Request, Response } from "express";
import {
  analisarTeologicamente,
  type VersaoBiblica,
} from "../services/ia.service";
import { getErrorMessage } from "../utils/httpError";

const router = Router();

router.post("/theological", async (req: Request, res: Response) => {
  try {
    const {
      tema,
      profundidade = "medio",
      passagem,
      versaoBiblica = "ARA",
    } = req.body as {
      tema: string;
      profundidade?: "basico" | "medio" | "avancado";
      passagem?: string;
      versaoBiblica?: VersaoBiblica;
    };

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
    res.json({ sucesso: true, tema, profundidade, analise });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

export default router;
