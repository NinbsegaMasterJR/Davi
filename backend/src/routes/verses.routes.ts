import { Router, Request, Response } from "express";
import {
  buscarVersiculos,
  obterTextoCompletoBiblia,
} from "../services/bible.service";
import { getErrorMessage } from "../utils/httpError";

const router = Router();

router.get("/suggest", async (req: Request, res: Response) => {
  try {
    const { tema, limite = 5, versaoBiblica = "ARA" } = req.query as {
      tema: string;
      limite?: string;
      versaoBiblica?: "ARA" | "ARC" | "ARCF" | "KING_JAMES";
    };

    if (!tema) {
      res.status(400).json({ error: "Tema e obrigatorio" });
      return;
    }

    const versiculos = await buscarVersiculos(
      tema,
      parseInt(String(limite) || "5", 10),
      versaoBiblica,
    );

    res.json({
      sucesso: true,
      tema,
      versiculos,
    });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

router.get("/:referencia", async (req: Request, res: Response) => {
  try {
    const { referencia } = req.params;
    const { versaoBiblica = "ARA" } = req.query as {
      versaoBiblica?: "ARA" | "ARC" | "ARCF" | "KING_JAMES";
    };

    if (!referencia) {
      res.status(400).json({ error: "Referencia e obrigatoria" });
      return;
    }

    const verso = await obterTextoCompletoBiblia(referencia, versaoBiblica);
    res.json({
      sucesso: true,
      verso,
    });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

export default router;
