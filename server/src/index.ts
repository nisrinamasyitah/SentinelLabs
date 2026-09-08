import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import scanRouter from "./routes/scan.js";
import engagementsRouter from "./routes/engagements.js";
import contactRouter from "./routes/contact.js";

const app = express();
const PORT = process.env.PORT ?? 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/scan", scanRouter);
app.use("/api/engagements", engagementsRouter);
app.use("/api/contact", contactRouter);

// last-resort safety net: any error passed to next() (including rejected
// promises from asyncHandler) lands here as a JSON 500 instead of crashing
// the process
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("unhandled route error", err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

process.on("unhandledRejection", (reason) => {
  console.error("unhandled promise rejection", reason);
});

app.listen(PORT, () => {
  console.log(`sentinellabs-server listening on http://localhost:${PORT}`);
});
