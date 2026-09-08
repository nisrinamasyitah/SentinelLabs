import TerminalPanel from "./TerminalPanel";
import ScanCTA from "./ScanCTA";

function Highlight({ children }: { children: string }) {
  return (
    <span className="relative mx-1 inline-block -rotate-2 bg-[var(--brand-green)] px-3 py-1">
      {children}
    </span>
  );
}

export default function Hero() {
  return (
    <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-24 pt-8 md:px-16 md:pt-16 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col gap-8">
        <h1 className="font-display text-[15vw] uppercase leading-[0.95] text-white sm:text-6xl md:text-7xl lg:text-[5rem]">
          <span className="block">
            WE<Highlight>PROTECT</Highlight>
          </span>
          <span className="block">
            WHAT<Highlight>YOU</Highlight>CAN&apos;T
          </span>
          <span className="block">
            SEE<span className="text-[var(--brand-red)]">!</span>
          </span>
        </h1>

        <p className="max-w-lg text-lg text-white/85">
          Sentinel Labs provides ethical hacking, risk audits and
          cyberdefense for organizations that value trust above all else
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <ScanCTA />
          <a
            href="#how-it-works"
            className="rounded-lg bg-black/70 px-6 py-4 font-display text-sm text-white backdrop-blur transition-transform hover:scale-[1.03]"
          >
            <span className="mr-1 text-[var(--brand-red)]">!</span>
            See How We Work
          </a>
        </div>
      </div>

      <div className="flex justify-center lg:justify-end">
        <TerminalPanel />
      </div>
    </section>
  );
}
