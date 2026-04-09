import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import sermonRoutes from "./routes/sermon.routes";
import versesRoutes from "./routes/verses.routes";
import concordanceRoutes from "./routes/concordance.routes";
import analysisRoutes from "./routes/analysis.routes";
import { createRateLimit } from "./middleware/rateLimit";
import { getErrorMessage, getErrorStatus } from "./utils/httpError";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;
app.set("trust proxy", 1);

const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin: string): boolean {
  return (
    origin === "http://localhost:3000" ||
    origin === "http://localhost:3001" ||
    origin.includes("vercel.app") ||
    origin.includes("onrender.com") ||
    origin.includes("up.railway.app") ||
    origin.includes("localhost") ||
    configuredOrigins.includes(origin)
  );
}

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origem nao permitida pelo CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));

app.get("/health", (req: Request, res: Response) => {
  void req;
  res.json({
    status: "OK",
    message: "Pregador IA API is running",
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
  });
});

app.use(
  "/api",
  createRateLimit({
    maxRequests: 30,
    windowMs: 60 * 1000,
    message: "Muitas requisicoes em pouco tempo. Tente novamente em instantes.",
  }),
);

app.use("/api/sermons", sermonRoutes);
app.use("/api/verses", versesRoutes);
app.use("/api/concordance", concordanceRoutes);
app.use("/api/analysis", analysisRoutes);

app.use((req: Request, res: Response) => {
  void req;
  res.status(404).json({ error: "Route not found" });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  void req;
  void next;
  console.error(err);
  res.status(getErrorStatus(err)).json({
    error: getErrorMessage(err, "Internal Server Error"),
  });
});

app.listen(port, () => {
  console.log(`Pregador IA API running on http://localhost:${port}`);
});

export default app;
