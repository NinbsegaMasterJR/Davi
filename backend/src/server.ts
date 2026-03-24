import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import sermonRoutes from "./routes/sermon.routes";
import versesRoutes from "./routes/verses.routes";
import concordanceRoutes from "./routes/concordance.routes";
import analysisRoutes from "./routes/analysis.routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    // Permitir requisições sem origin (mobile apps, curl, etc)
    if (
      !origin ||
      origin === "http://localhost:3000" ||
      origin === "http://localhost:3001" ||
      origin.includes("vercel.app") ||
      origin.includes("onrender.com") ||
      origin.includes("localhost")
    ) {
      callback(null, true);
    } else {
      callback(null, true); // Permitir de qualquer lugar para público
    }
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "Pregador IA API is running" });
});

// API Routes
app.use("/api/sermons", sermonRoutes);
app.use("/api/verses", versesRoutes);
app.use("/api/concordance", concordanceRoutes);
app.use("/api/analysis", analysisRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`🚀 Pregador IA API running on http://localhost:${port}`);
});

export default app;
