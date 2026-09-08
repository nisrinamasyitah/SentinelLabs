import { prisma } from "./prisma.js";
import type { Severity, Stage } from "@prisma/client";

const RUN_STAGES: Stage[] = ["Recon", "Scan", "Exploit", "Report"];
const STAGE_DURATION_MS = 2600;

interface FindingTemplate {
  title: string;
  severity: Severity;
  cvss: number;
  asset: (target: string) => string;
}

const FINDING_POOL: FindingTemplate[] = [
  { title: "Missing HTTP security headers (CSP, X-Frame-Options, HSTS)", severity: "Medium", cvss: 5.3, asset: (t) => `www.${t}` },
  { title: "TLS configuration accepts legacy cipher suites", severity: "Medium", cvss: 5.9, asset: (t) => `www.${t}` },
  { title: "Verbose server error pages leak stack traces", severity: "Low", cvss: 3.7, asset: (t) => `api.${t}` },
  { title: "Subdomain with stale DNS record vulnerable to takeover", severity: "High", cvss: 7.4, asset: (t) => `staging.${t}` },
  { title: "No rate limiting on authentication endpoint", severity: "Medium", cvss: 6.1, asset: (t) => `api.${t}` },
  { title: "Outdated CMS/framework version with known CVEs", severity: "High", cvss: 7.9, asset: (t) => `www.${t}` },
  { title: "Session cookie missing Secure and HttpOnly flags", severity: "Medium", cvss: 5.4, asset: (t) => `www.${t}` },
  { title: "Directory listing enabled on static assets path", severity: "Low", cvss: 3.1, asset: (t) => `assets.${t}` },
  { title: "Email server missing SPF/DKIM/DMARC alignment", severity: "Info", cvss: 2.0, asset: (t) => `mail.${t}` },
  { title: "Clickjacking possible on login page (no frame protection)", severity: "Medium", cvss: 4.8, asset: (t) => `www.${t}` },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Server-authoritative simulated engagement run. Advances stage on a timer
 * independent of any connected client, and drops a batch of illustrative
 * findings once "Exploit" completes. This is a deliberate simulation, not a
 * real scan — see the disclaimer surfaced in the API response / UI.
 */
export async function runSimulatedEngagement(engagementId: string, target: string) {
  for (const stage of RUN_STAGES) {
    await prisma.engagement.update({
      where: { id: engagementId },
      data: { stage },
    });

    if (stage === "Exploit") {
      const shuffled = [...FINDING_POOL].sort(() => Math.random() - 0.5);
      const count = 4 + Math.floor(Math.random() * 3);
      await prisma.finding.createMany({
        data: shuffled.slice(0, count).map((t) => ({
          engagementId,
          title: t.title,
          severity: t.severity,
          cvss: t.cvss,
          asset: t.asset(target),
          status: "open",
        })),
      });
    }

    await wait(STAGE_DURATION_MS);
  }

  await prisma.engagement.update({
    where: { id: engagementId },
    data: { liveRunPending: false },
  });
}
