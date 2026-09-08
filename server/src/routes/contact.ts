import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { sendContactNotification } from "../lib/email.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().email(),
  message: z.string().trim().min(1).max(5000),
});

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Fill in your name, email, and a message." });
      return;
    }

    const entry = await prisma.contactMessage.create({
      data: parsed.data,
    });

    try {
      await sendContactNotification(parsed.data);
    } catch (err) {
      // the message is already saved — a failed notification email
      // shouldn't make this look like it didn't go through
      console.error("failed to send contact notification email", err);
    }

    res.json({ ok: true, id: entry.id });
  }),
);

export default router;
