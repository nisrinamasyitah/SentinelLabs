import { Router } from "express";
import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { sendMagicLinkEmail } from "../lib/email.js";
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

    try {
      const { devLink } = await sendMagicLinkEmail(email, link);
      res.json({ ok: true, engagementId: engagement.id, devLink });
    } catch (err) {
      console.error("failed to send magic-link email", err);
      // the engagement was already created and is running — don't lose that,
      // just tell the client the email failed so they can retry sign-in
      res.status(200).json({
        ok: true,
        engagementId: engagement.id,
        emailError:
          "Scan started, but we couldn't send the sign-in email. Use 'Send Sign-In Link' on the portal login page with the same email to get in.",
      });
    }
  }),
);

export default router;
