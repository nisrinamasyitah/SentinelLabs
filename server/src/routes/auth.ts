import { Router } from "express";
import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { sendMagicLinkEmail } from "../lib/email.js";
import { SESSION_COOKIE, signSession } from "../lib/jwt.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
const TOKEN_TTL_MS = 15 * 60 * 1000;
const isProd = process.env.NODE_ENV === "production";

const requestLinkSchema = z.object({
  email: z.string().email(),
});

router.post(
  "/request-link",
  asyncHandler(async (req, res) => {
    const parsed = requestLinkSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Enter a valid email address" });
      return;
    }
    const email = parsed.data.email.toLowerCase().trim();

    const client = await prisma.client.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: email.split("@")[1] ?? email,
        contactName: email.split("@")[0],
      },
    });

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.magicLinkToken.create({
      data: {
        token,
        clientId: client.id,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      },
    });

    const link = `${CLIENT_ORIGIN}/portal/verify?token=${token}`;

    try {
      const { devLink } = await sendMagicLinkEmail(email, link);
      res.json({ ok: true, devLink });
    } catch (err) {
      console.error("failed to send magic-link email", err);
      res.status(502).json({
        error:
          "We couldn't send that email right now. Please try again in a moment.",
      });
    }
  }),
);

const verifySchema = z.object({ token: z.string().min(1) });

router.post(
  "/verify",
  asyncHandler(async (req, res) => {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Missing token" });
      return;
    }

    const record = await prisma.magicLinkToken.findUnique({
      where: { token: parsed.data.token },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      res.status(400).json({ error: "This link is invalid or has expired." });
      return;
    }

    await prisma.magicLinkToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });

    const sessionToken = signSession(record.clientId);
    res.cookie(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ ok: true });
  }),
);

router.post("/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE);
  res.json({ ok: true });
});

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const client = await prisma.client.findUnique({ where: { id: req.clientId } });
    if (!client) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    res.json({ client });
  }),
);

export default router;
