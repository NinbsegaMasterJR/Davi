import { Router, Request, Response } from "express";
import { buscarVersiculos } from "../services/bible.service";

const router = Router();

interface VersesRequest {
  tema: string;
  limite?: number;
}

// Sugerir versículos por tema
router.get("/suggest", async (req: Request, res: Response) => {
  try {
    const { tema, limite = 5 } = req.query as { tema: string; limite?: string };

    if (!tema) {
      res.status(400).json({ error: "Tema é obrigatório" });
      return;
    }

    const versiculos = await buscarVersiculos(tema);
    res.json({
      sucesso: true,
      tema,
      versiculos: versiculos.slice(0, parseInt(String(limite) || "5")),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
