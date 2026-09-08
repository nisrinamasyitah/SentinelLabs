import type { Stage } from "./types";

export type LogTone = "muted" | "info" | "ok" | "warn";

export interface LogLine {
  text: string;
  tone: LogTone;
}

/** Cosmetic log lines shown while polling the server-authoritative scan run. */
export function buildStageLog(stage: Stage, target: string): LogLine[] {
  switch (stage) {
    case "Recon":
      return [
        { text: `$ sentinel recon --target ${target}`, tone: "muted" },
        { text: `resolving DNS records for ${target}...`, tone: "info" },
        { text: `enumerating subdomains...`, tone: "info" },
        { text: `found: www.${target}, api.${target}, mail.${target}`, tone: "ok" },
        { text: `fingerprinting web server and TLS certificate...`, tone: "info" },
        { text: `recon complete — 3 hosts in scope`, tone: "ok" },
      ];
    case "Scan":
      return [
        { text: `$ sentinel scan --hosts 3 --target ${target}`, tone: "muted" },
        { text: `probing open ports on www.${target}...`, tone: "info" },
        { text: `checking HTTP security headers...`, tone: "info" },
        { text: `checking TLS configuration and cipher suites...`, tone: "info" },
        { text: `crawling application surface for entry points...`, tone: "info" },
        { text: `scan complete — candidate issues queued for verification`, tone: "ok" },
      ];
    case "Exploit":
      return [
        { text: `$ sentinel verify --safe-mode --target ${target}`, tone: "muted" },
        { text: `validating candidate issues (non-destructive checks only)...`, tone: "info" },
        { text: `confirming impact and reproducibility...`, tone: "info" },
        { text: `scoring confirmed issues by CVSS...`, tone: "info" },
        { text: `verification complete`, tone: "ok" },
      ];
    case "Report":
      return [
        { text: `$ sentinel report --target ${target}`, tone: "muted" },
        { text: `compiling findings into client report...`, tone: "info" },
        { text: `report generated — awaiting remediation`, tone: "ok" },
      ];
    case "Retest":
      return [
        { text: `$ sentinel retest --target ${target}`, tone: "muted" },
        { text: `retest scheduled once fixes are marked remediated`, tone: "info" },
      ];
  }
}
