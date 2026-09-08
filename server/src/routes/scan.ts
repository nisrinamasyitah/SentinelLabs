import { Router } from "express";
import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { sendMagicLinkEmail, smtpConfigured } from "../lib/email.js";
import { runSimulatedEngagement } from "../lib/scanSim.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
const TOKEN_TTL_MS = 15 * 60 * 1000;

const scanSchema = z.object({
  email: z.string().email(),
  domain: z.string().min(1),
});

function extractDomain(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const host = new URL(withProtocol).hostname.replace(/^www\./i, "");
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host)) return null;
    return host.toLowerCase();
  } catch {
    return null;
  }
}

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = scanSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Enter a valid email and domain" });
      return;
    }

    const domain = extractDomain(parsed.data.domain);
    if (!domain) {
      res.status(400).json({ error: "Enter a valid domain, e.g. yourcompany.com" });
      return;
    }
    const email = parsed.data.email.toLowerCase().trim();

    const client = await prisma.client.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: domain,
        contactName: email.split("@")[0],
      },
    });

    const engagement = await prisma.engagement.create({
      data: {
        clientId: client.id,
        name: `Free External Threat Scan — ${domain}`,
        target: domain,
        stage: "Recon",
        liveRunPending: true,
      },
    });

    // server-authoritative background run — advances regardless of whether
    // anyone stays connected to watch it
    runSimulatedEngagement(engagement.id, domain).catch((err) => {
      console.error("simulated engagement run failed", err);
    });

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.magicLinkToken.create({
      data: {
        token,
        clientId: client.id,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      },
    });
    const link = `${CLIENT_ORIGIN}/portal/verify?token=${token}&engagement=${engagement.id}`;

    if (!smtpConfigured) {
      // dev fallback is instant (just a console.log, no network call) — fine
      // to await and hand devLink straight back for local testing
      const { devLink } = await sendMagicLinkEmail(email, link);
      res.json({ ok: true, engagementId: engagement.id, devLink });
      return;
    }

    // a real SMTP send is a genuine external API call that routinely takes
    // several seconds — don't make the caller wait on it. The engagement is
    // already created and running; if the email fails, the token still
    // exists and the client can retry via "Send Sign-In Link" on the portal
    // login page with the same email.
    sendMagicLinkEmail(email, link).catch((err) => {
      console.error("failed to send magic-link email", err);
    });

    res.json({ ok: true, engagementId: engagement.id });
  }),
);

export default router;
