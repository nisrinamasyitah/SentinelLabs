import ScanCTA from "./ScanCTA";
import ProgressTracker from "../portal/ProgressTracker";

export default function GetStarted() {
  return (
    <section
      id="get-started"
      className="relative z-10 mx-auto max-w-5xl scroll-mt-24 px-6 py-24 md:px-16"
    >
      <div className="rounded-2xl border border-[var(--brand-green)]/25 bg-gradient-to-b from-[var(--brand-green)]/10 to-transparent p-8 text-center md:p-14">
        <p className="font-display text-sm tracking-widest text-[var(--brand-green)]">
          GET STARTED
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl uppercase leading-[1.05] text-white md:text-5xl">
          Find out what&apos;s
          <span className="relative mx-2 inline-block -rotate-2 bg-[var(--brand-green)] px-3 py-1">
            exposed
          </span>
          before someone else does
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-white/70">
          Drop your domain and email below — we'll kick off a live preview of
          the engagement right away, and a real analyst follows up to scope
          the full assessment.
        </p>

        <div className="mx-auto mt-10 max-w-lg">
          <ProgressTracker stageIndex={0} />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <ScanCTA defaultOpen />
          <a
            href="#contact"
            className="text-sm text-white/50 transition-colors hover:text-white"
          >
            or talk to a human first →
          </a>
        </div>
      </div>
    </section>
  );
}
