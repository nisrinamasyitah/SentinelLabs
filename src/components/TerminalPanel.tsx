const LOG_LINES: { text: string; tone: "muted" | "ok" | "warn" | "info" }[] = [
  { text: "$ sentinel scan --target api.client.io", tone: "muted" },
  { text: "resolving assets... 214 endpoints found", tone: "info" },
  { text: "[OK]   TLS 1.3 enforced", tone: "ok" },
  { text: "[OK]   auth: MFA required on all admin routes", tone: "ok" },
  { text: "[WARN] 2 endpoints running outdated TLS ciphers", tone: "warn" },
  { text: "[OK]   no exposed secrets in public repos", tone: "ok" },
  { text: "risk score: 92/100 — report generated", tone: "info" },
];

const TONE_CLASS: Record<string, string> = {
  muted: "text-white/50",
  ok: "text-[#7CFF8C]",
  warn: "text-amber-400",
  info: "text-white/80",
};

export default function TerminalPanel() {
  return (
    <div className="w-full max-w-md rotate-1 rounded-xl border border-white/10 bg-black/60 shadow-2xl shadow-black/60 backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-green)]" />
        <span className="ml-2 font-mono text-xs text-white/40">
          sentinel-scan — zsh
        </span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-[var(--brand-green)]/15 px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#7CFF8C]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7CFF8C]" />
          LIVE
        </span>
      </div>

      <div className="space-y-1.5 px-4 py-4 font-mono text-[13px] leading-relaxed">
        {LOG_LINES.map((line) => (
          <p key={line.text} className={TONE_CLASS[line.tone]}>
            {line.text}
          </p>
        ))}
        <p className="text-white/50">
          <span className="animate-pulse">▍</span>
        </p>
      </div>
    </div>
  );
}
