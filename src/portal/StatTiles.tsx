import type { Finding } from "./types";

export default function StatTiles({ findings }: { findings: Finding[] }) {
  const open = findings.filter((f) => f.status === "open").length;
  const verifying = findings.filter((f) => f.status === "verifying").length;
  const fixed = findings.filter((f) => f.status === "fixed").length;
  const critHigh = findings.filter(
    (f) => f.severity === "Critical" || f.severity === "High",
  ).length;

  const tiles = [
    { label: "Open", value: open, color: "text-red-400" },
    { label: "Verifying", value: verifying, color: "text-amber-300" },
    { label: "Fixed", value: fixed, color: "text-[#7CFF8C]" },
    { label: "Critical / High", value: critHigh, color: "text-white" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className={`font-display text-3xl ${t.color}`}>{t.value}</p>
          <p className="mt-1 text-xs text-white/50">{t.label}</p>
        </div>
      ))}
    </div>
  );
}
