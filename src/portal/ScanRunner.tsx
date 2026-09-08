import { useEffect, useRef, useState } from "react";
import { STAGES, type Engagement } from "./types";
import { buildStageLog, type LogLine } from "./scanScript";
import { getCurrentEngagement } from "./api";
import ProgressTracker from "./ProgressTracker";

const TONE_CLASS: Record<LogLine["tone"], string> = {
  muted: "text-white/45",
  info: "text-white/80",
  ok: "text-[#7CFF8C]",
  warn: "text-amber-400",
};

export default function ScanRunner({
  engagement: initialEngagement,
  onComplete,
}: {
  engagement: Engagement;
  onComplete: (engagement: Engagement) => void;
}) {
  const [engagement, setEngagement] = useState(initialEngagement);
  const [lines, setLines] = useState<LogLine[]>([]);
  const shownStages = useRef(new Set<string>());
  const scrollRef = useRef<HTMLDivElement>(null);
  const target = engagement.target;

  useEffect(() => {
    if (!shownStages.current.has(engagement.stage)) {
      shownStages.current.add(engagement.stage);
      const newLines = buildStageLog(engagement.stage, target);
      newLines.forEach((line, i) => {
        setTimeout(() => {
          setLines((prev) => [...prev, line]);
        }, i * 260);
      });
    }
  }, [engagement.stage, target]);

  useEffect(() => {
    if (!engagement.liveRunPending) return;
    const interval = setInterval(async () => {
      const latest = await getCurrentEngagement();
      if (latest && latest.id === engagement.id) {
        setEngagement(latest);
      }
    }, 900);
    return () => clearInterval(interval);
  }, [engagement.liveRunPending, engagement.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const stageIndex = STAGES.indexOf(engagement.stage);
  const done = !engagement.liveRunPending;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
      <a href="/" className="font-display text-xl leading-tight text-white">
        Sentinel
        <br />
        Labs<span className="text-[var(--brand-red)]">.</span>
      </a>

      <h1 className="mt-8 font-display text-2xl text-white md:text-3xl">
        Scanning {target}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-white/50">
        This is a simulated preview of how a Sentinel Labs engagement runs.
        No real requests are sent to the target — a licensed analyst
        performs and confirms every finding before a live report is
        delivered.
      </p>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
        <ProgressTracker stageIndex={stageIndex} />
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-black/60 shadow-2xl shadow-black/60 backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-green)]" />
          <span className="ml-2 font-mono text-xs text-white/40">
            sentinel-scan — {target}
          </span>
          {!done && (
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-[var(--brand-green)]/15 px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#7CFF8C]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7CFF8C]" />
              RUNNING
            </span>
          )}
        </div>
        <div
          ref={scrollRef}
          className="max-h-72 space-y-1.5 overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed"
        >
          {lines.map((line, i) => (
            <p key={i} className={TONE_CLASS[line.tone]}>
              {line.text}
            </p>
          ))}
          {!done && (
            <p className="text-white/50">
              <span className="animate-pulse">▍</span>
            </p>
          )}
        </div>
      </div>

      {done && (
        <div className="mt-8 flex flex-col items-start gap-3 rounded-xl border border-[var(--brand-green)]/30 bg-[var(--brand-green)]/10 p-6">
          <p className="text-sm text-white">
            Preview complete — {engagement.findings.length} illustrative
            finding{engagement.findings.length === 1 ? "" : "s"} generated
            for {target}.
          </p>
          <button
            onClick={() => onComplete(engagement)}
            className="rounded-lg bg-[var(--brand-green)] px-6 py-3 font-display text-sm text-white transition-transform hover:scale-[1.02]"
          >
            View Full Report
          </button>
        </div>
      )}
    </div>
  );
}
