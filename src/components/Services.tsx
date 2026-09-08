const SERVICES = [
  {
    title: "External Network Pentest",
    stage: "Recon → Exploit",
    body: "We probe your public-facing infrastructure the way a real attacker would — open ports, exposed services, misconfigurations — and prove what's actually exploitable.",
  },
  {
    title: "Web & API Security Testing",
    stage: "Scan → Exploit",
    body: "Manual and automated testing against the OWASP Top 10 plus the business-logic flaws that scanners miss entirely.",
  },
  {
    title: "Cloud Security Audit",
    stage: "Recon → Report",
    body: "Configuration review across AWS, Azure, and GCP — IAM policy, storage exposure, network segmentation, logging gaps.",
  },
  {
    title: "Red Team Engagement",
    stage: "Full Lifecycle",
    body: "Objective-based attack simulation across people, process, and technology, run the way a persistent adversary actually operates.",
  },
  {
    title: "Social Engineering Assessment",
    stage: "Recon → Exploit",
    body: "Phishing, vishing, and physical pretext exercises that measure the human layer most technical audits skip.",
  },
  {
    title: "Retest & Verification",
    stage: "Retest",
    body: "Every fix your team ships gets independently re-verified before we close a finding — we don't grade our own homework.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-6 py-24 md:px-16"
    >
      <div className="max-w-2xl">
        <p className="font-display text-sm tracking-widest text-[var(--brand-green)]">
          OUR SERVICES
        </p>
        <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] text-white md:text-5xl">
          One team, every
          <span className="relative mx-2 inline-block -rotate-2 bg-[var(--brand-green)] px-3 py-1">
            angle
          </span>
          of attack
        </h2>
        <p className="mt-6 text-white/70">
          Every engagement below runs through the same Recon → Scan →
          Exploit → Report → Retest methodology — the only thing that
          changes is where we point it.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors hover:border-[var(--brand-green)]/40"
          >
            <span className="w-fit rounded-full border border-[var(--brand-green)]/30 bg-[var(--brand-green)]/10 px-2.5 py-1 font-mono text-[11px] tracking-wide text-[#7CFF8C]">
              {s.stage}
            </span>
            <h3 className="font-display text-lg text-white">{s.title}</h3>
            <p className="text-sm text-white/60">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
