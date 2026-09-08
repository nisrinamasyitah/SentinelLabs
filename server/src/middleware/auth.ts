import type { Request, Response, NextFunction } from "express";
import { SESSION_COOKIE, verifySession } from "../lib/jwt.js";

declare global {
  namespace Express {
    interface Request {
      clientId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE];
  const session = token ? verifySession(token) : null;
  if (!session) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  req.clientId = session.clientId;
  next();
}
