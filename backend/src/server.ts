import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import sermonRoutes from "./routes/sermon.routes";
import versesRoutes from "./routes/verses.routes";
import concordanceRoutes from "./routes/concordance.routes";
import analysisRoutes from "./routes/analysis.routes";
import workspaceRoutes from "./routes/workspace.routes";
import { createRateLimit } from "./middleware/rateLimit";
import { getErrorMessage, getErrorStatus } from "./utils/httpError";
import { isWorkspaceSyncConfigured } from "./services/workspace.service";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;
app.set("trust proxy", 1);

const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin: string): boolean {
  if (configuredOrigins.includes(origin)) {
    return true;
  }

  let url: URL;

  try {
    url = new URL(origin);
  } catch (error) {
    void error;
    return false;
  }

  const hostname = url.hostname.toLowerCase();

  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".vercel.app") ||
    hostname.endsWith(".onrender.com") ||
    hostname.endsWith(".up.railway.app")
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
      callback(new Error("Origem não permitida pelo CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("X-DNS-Prefetch-Control", "off");

  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=15552000; includeSubDomains",
    );
  }

  void req;
  next();
});
app.use(express.json({ limit: "512kb" }));
app.use(express.urlencoded({ extended: true, limit: "512kb" }));

app.get("/health", (req: Request, res: Response) => {
  void req;
  res.json({
    status: "OK",
    message: "Scriptura API is running",
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    workspaceSyncConfigured: isWorkspaceSyncConfigured(),
  });
});

app.use(
  "/api",
  createRateLimit({
    maxRequests: 30,
    windowMs: 60 * 1000,
    message: "Muitas requisições em pouco tempo. Tente novamente em instantes.",
  }),
);

app.use("/api/sermons", sermonRoutes);
app.use("/api/verses", versesRoutes);
app.use("/api/concordance", concordanceRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/workspace", workspaceRoutes);

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
  console.log(`Scriptura API running on http://localhost:${port}`);
});

export default app;
