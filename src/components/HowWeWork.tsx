import type { Stage } from "../portal/types";

const STEPS: { stage: Stage; title: string; body: string }[] = [
  {
    stage: "Recon",
    title: "Map the attack surface",
    body: "We enumerate domains, subdomains, exposed services, and the people behind them — everything an attacker would see before touching anything.",
  },
  {
    stage: "Scan",
    title: "Surface candidate issues",
    body: "Automated and manual scanning across every asset in scope, queuing up the weaknesses worth chasing further.",
  },
  {
    stage: "Exploit",
    title: "Prove real impact",
    body: "We attempt real exploitation, safely, to separate theoretical findings from ones that actually put you at risk.",
  },
  {
    stage: "Report",
    title: "Score and deliver findings",
    body: "Every confirmed issue gets a severity, a CVSS score, and clear remediation guidance — tracked live in your client portal, not a PDF that goes stale.",
  },
  {
    stage: "Retest",
    title: "Verify every fix",
    body: "Once your team ships a fix, we come back and confirm it. A finding isn't closed until we've re-tested it ourselves.",
  },
];

export default function HowWeWork() {
  return (
    <section
      id="how-it-works"
      className="relative z-10 mx-auto flex min-h-[calc(100vh-98px)] max-w-5xl scroll-mt-24 flex-col justify-center px-6 py-16 md:px-16"
    >
      <div className="max-w-2xl">
        <p className="font-display text-sm tracking-widest text-[var(--brand-green)]">
          HOW WE WORK
        </p>
        <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] text-white md:text-5xl">
          Five stages,
          <span className="relative mx-2 inline-block -rotate-2 bg-[var(--brand-green)] px-3 py-1">
            zero
          </span>
          guesswork
        </h2>
        <p className="mt-6 text-white/70">
          Every engagement — free scan or full assessment — runs through the
          same process. Nothing gets marked fixed until we've verified it
          ourselves.
        </p>
      </div>

      <div className="mt-12 flex flex-col">
        {STEPS.map((step, i) => (
          <div key={step.stage} className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand-green)] bg-black font-display text-sm text-[var(--brand-green)]">
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-0.5 flex-1 bg-white/10" />
              )}
            </div>
            <div className={i < STEPS.length - 1 ? "pb-8" : ""}>
              <p className="font-mono text-xs tracking-wide text-[#7CFF8C]">
                {step.stage.toUpperCase()}
              </p>
              <h3 className="mt-1 font-display text-lg text-white">
                {step.title}
              </h3>
              <p className="mt-1 max-w-xl text-sm text-white/60">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
