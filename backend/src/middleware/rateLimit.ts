import { NextFunction, Request, Response } from "express";

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  message: string;
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitBucket>();

function getClientKey(req: Request): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || "unknown";
}

export function createRateLimit(options: RateLimitOptions) {
  const { maxRequests, windowMs, message } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const key = `${req.method}:${req.path}:${getClientKey(req)}`;
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      next();
      return;
    }

    if (current.count >= maxRequests) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((current.resetAt - now) / 1000),
      );
      res.setHeader("Retry-After", String(retryAfterSeconds));
      res.status(429).json({ error: message });
      return;
    }

    current.count += 1;
    buckets.set(key, current);
    next();
  };
}
