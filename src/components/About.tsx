const VALUES = [
  {
    title: "Real Analysts",
    body: "Every engagement is run by licensed penetration testers — not a scanner with a report template bolted on.",
  },
  {
    title: "Full Lifecycle",
    body: "Recon, Scan, Exploit, Report, Retest. We confirm fixes actually hold instead of closing the ticket at the PDF.",
  },
  {
    title: "Built For Trust",
    body: "Severity, CVSS, affected assets, remediation status — tracked live in your client portal, not buried in email threads.",
  },
  {
    title: "Ethical, Always",
    body: "Every test runs inside a signed scope and rules of engagement. No surprises, no collateral damage.",
  },
];

const STATS = [
  { value: "5-Stage", label: "Engagement Methodology" },
  { value: "100%", label: "Authorized Testing" },
  { value: "24/7", label: "Client Portal Access" },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-6 py-24 md:px-16"
    >
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-display text-sm tracking-widest text-[var(--brand-green)]">
            ABOUT SENTINEL LABS
          </p>
          <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] text-white md:text-5xl">
            We think like
            <span className="relative mx-2 inline-block -rotate-2 bg-[var(--brand-green)] px-3 py-1">
              attackers
            </span>
            so you don&apos;t have to
          </h2>
          <p className="mt-6 max-w-md text-white/70">
            Sentinel Labs was built on a simple idea: a security report is
            only useful if someone actually acts on it. So we run every
            engagement end-to-end — breaking in, proving impact, and staying
            on the hook until findings are verified fixed, not just filed.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl text-white md:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <h3 className="font-display text-lg text-white">{v.title}</h3>
              <p className="mt-2 text-sm text-white/60">{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
