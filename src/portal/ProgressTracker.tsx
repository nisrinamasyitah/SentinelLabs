import { STAGES } from "./types";

export default function ProgressTracker({ stageIndex }: { stageIndex: number }) {
  return (
    <div className="flex items-center">
      {STAGES.map((stage, i) => {
        const done = i < stageIndex;
        const current = i === stageIndex;
        return (
          <div key={stage} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 font-display text-xs ${
                  done
                    ? "border-[var(--brand-green)] bg-[var(--brand-green)] text-white"
                    : current
                      ? "border-[var(--brand-green)] bg-black text-[var(--brand-green)]"
                      : "border-white/15 bg-black text-white/30"
                }`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs font-medium tracking-wide ${
                  current ? "text-white" : done ? "text-white/70" : "text-white/30"
                }`}
              >
                {stage}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 ${
                  done ? "bg-[var(--brand-green)]" : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
