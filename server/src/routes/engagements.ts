import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();
router.use(requireAuth);

const severityWeight: Record<string, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
  Info: 0,
};

// most recent engagement for the logged-in client, with its findings
router.get(
  "/current",
  asyncHandler(async (req, res) => {
    const engagement = await prisma.engagement.findFirst({
      where: { clientId: req.clientId },
      orderBy: { startedOn: "desc" },
      include: { findings: true, client: true },
    });

    if (!engagement) {
      res.status(404).json({ error: "No engagement found for this client" });
      return;
    }

    engagement.findings.sort(
      (a, b) => severityWeight[b.severity] - severityWeight[a.severity],
    );

    res.json({ engagement });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const engagement = await prisma.engagement.findFirst({
      where: { id: req.params.id as string, clientId: req.clientId },
      include: { findings: true, client: true },
    });

    if (!engagement) {
      res.status(404).json({ error: "Engagement not found" });
      return;
    }

    engagement.findings.sort(
      (a, b) => severityWeight[b.severity] - severityWeight[a.severity],
    );

    res.json({ engagement });
  }),
);

const patchFindingSchema = z.object({
  status: z.enum(["open", "verifying", "fixed"]),
});

router.patch(
  "/findings/:findingId",
  asyncHandler(async (req, res) => {
    const parsed = patchFindingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    const finding = await prisma.finding.findUnique({
      where: { id: req.params.findingId as string },
      include: { engagement: true },
    });

    if (!finding || finding.engagement.clientId !== req.clientId) {
      res.status(404).json({ error: "Finding not found" });
      return;
    }

    const updated = await prisma.finding.update({
      where: { id: finding.id },
      data: { status: parsed.data.status },
    });

    res.json({ finding: updated });
  }),
);

export default router;
