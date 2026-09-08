import type { FindingStatus, Severity } from "./types";

export const SEVERITY_STYLE: Record<Severity, string> = {
  Critical: "bg-red-500/15 text-red-400 border-red-500/30",
  High: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Medium: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  Low: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  Info: "bg-white/10 text-white/60 border-white/20",
};

export const STATUS_STYLE: Record<FindingStatus, string> = {
  open: "bg-red-500/15 text-red-400 border-red-500/30",
  verifying: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  fixed: "bg-[var(--brand-green)]/15 text-[#7CFF8C] border-[var(--brand-green)]/40",
};

export const STATUS_LABEL: Record<FindingStatus, string> = {
  open: "Open",
  verifying: "Verifying",
  fixed: "Fixed",
};
