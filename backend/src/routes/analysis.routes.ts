import { Router, Request, Response } from "express";
import { analisarTeologicamente } from "../services/ia.service";
import { getErrorMessage } from "../utils/httpError";

const router = Router();

// Análise teológica
router.post("/theological", async (req: Request, res: Response) => {
  try {
    const { tema, profundidade = "medio", passagem } = req.body;

    if (!tema) {
      res.status(400).json({ error: "Tema é obrigatório" });
      return;
    }

    const analise = await analisarTeologicamente(tema, passagem, profundidade);
    res.json({ sucesso: true, tema, profundidade, analise });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

export default router;
