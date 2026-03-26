import { Router, Request, Response } from "express";
import { buscarVersiculos } from "../services/bible.service";
import { getErrorMessage } from "../utils/httpError";

const router = Router();

// Sugerir versículos por tema
router.get("/suggest", async (req: Request, res: Response) => {
  try {
    const { tema, limite = 5 } = req.query as { tema: string; limite?: string };

    if (!tema) {
      res.status(400).json({ error: "Tema é obrigatório" });
      return;
    }

    const versiculos = await buscarVersiculos(
      tema,
      parseInt(String(limite) || "5"),
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

// Buscar verso específico
router.get("/:referencia", async (req: Request, res: Response) => {
  try {
    const { referencia } = req.params;

    // TODO: Implementar busca de verso específico
    res.json({
      sucesso: true,
      verso: {
        referencia,
        texto: "Implementar integração com Bible API",
      },
    });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: getErrorMessage(error, "Erro interno do servidor") });
  }
});

export default router;
