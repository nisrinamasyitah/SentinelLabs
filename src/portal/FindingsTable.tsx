import type { Finding } from "./types";
import { SEVERITY_STYLE, STATUS_STYLE, STATUS_LABEL } from "./badges";

export default function FindingsTable({
  findings,
  onRemediate,
}: {
  findings: Finding[];
  onRemediate: (findingId: string) => void;
}) {
  if (findings.length === 0) {
    return (
      <p className="rounded-lg border border-white/10 bg-white/5 p-6 text-sm text-white/60">
        No findings recorded yet for this engagement.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="hidden grid-cols-[1.6fr_0.6fr_0.5fr_1fr_0.9fr_0.9fr] gap-4 border-b border-white/10 bg-white/5 px-5 py-3 text-xs font-medium uppercase tracking-wide text-white/40 md:grid">
        <span>Finding</span>
        <span>Severity</span>
        <span>CVSS</span>
        <span>Asset</span>
        <span>Status</span>
        <span className="text-right">Action</span>
      </div>

      <div className="divide-y divide-white/10">
        {findings.map((f) => (
          <div
            key={f.id}
            className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[1.6fr_0.6fr_0.5fr_1fr_0.9fr_0.9fr] md:items-center md:gap-4"
          >
            <div>
              <p className="text-sm text-white">{f.title}</p>
              <p className="mt-0.5 text-xs text-white/40">
                discovered {new Date(f.discoveredOn).toISOString().slice(0, 10)}
              </p>
            </div>

            <span
              className={`inline-flex w-fit items-center rounded-md border px-2 py-1 text-xs font-medium ${SEVERITY_STYLE[f.severity]}`}
            >
              {f.severity}
            </span>

            <span className="font-mono text-sm text-white/80">{f.cvss.toFixed(1)}</span>

            <span className="truncate font-mono text-xs text-white/60">{f.asset}</span>

            <span
              className={`inline-flex w-fit items-center rounded-md border px-2 py-1 text-xs font-medium ${STATUS_STYLE[f.status]}`}
            >
              {STATUS_LABEL[f.status]}
            </span>

            <div className="md:text-right">
              {f.status === "open" ? (
                <button
                  onClick={() => onRemediate(f.id)}
                  className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-[var(--brand-green)] hover:text-white"
                >
                  Mark remediated
                </button>
              ) : f.status === "verifying" ? (
                <span className="text-xs text-white/40">Awaiting retest</span>
              ) : (
                <span className="text-xs text-white/40">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
