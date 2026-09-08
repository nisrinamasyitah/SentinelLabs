import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// `sectionId` is what the scroll-spy observes; it defaults to the href's
// fragment, but Home needs to watch the hero (#home) while still linking to
// the very top of the page (#top) so a click always lands at true page top.
const LINKS: { label: string; href: string; sectionId?: string }[] = [
  { label: "Home", href: "#top", sectionId: "home" },
  { label: "Services", href: "#services" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Get Started", href: "#get-started" },
];

export default function Navbar() {
  const [activeId, setActiveId] = useState<string | null>(null);
 
  useEffect(() => {
    const ids = LINKS.map((l) => l.sectionId ?? l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      // trigger once a section has cleared the sticky header and occupies
      // the upper band of the viewport
      { rootMargin: "-110px 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center bg-[#07080a]/70 px-6 py-6 backdrop-blur-md md:px-16">
      <a href="#top" className="flex items-center gap-2.5 font-display text-xl leading-tight text-white">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-green)] opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--brand-green)] shadow-[0_0_10px_2px_rgba(124,255,140,0.6)]" />
        </span>
        <span>
          Sentinel
          <br />
          Labs<span className="text-[var(--brand-red)]">.</span>
        </span>
      </a>

      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1.5 shadow-lg shadow-black/30 backdrop-blur-xl md:flex">
        {LINKS.map((link) => {
          const isActive = activeId === (link.sectionId ?? link.href.slice(1));
          return (
            <a
              key={link.label}
              href={link.href}
              className={`rounded-lg px-6 py-2.5 font-display text-sm tracking-wide transition-colors ${
                isActive
                  ? "bg-[var(--brand-green)]/80 text-white"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      <Link
        to="/portal"
        className="ml-auto hidden rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-display text-sm text-white shadow-lg shadow-black/30 backdrop-blur-xl transition-colors hover:border-[var(--brand-green)] md:block"
      >
        Client Portal
      </Link>

      <button className="ml-auto rounded-xl border border-white/10 bg-white/5 p-2 text-white shadow-lg shadow-black/30 backdrop-blur-xl md:hidden" aria-label="Open menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
      </button>
    </header>
  );
}
