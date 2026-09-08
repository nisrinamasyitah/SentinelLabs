import { useLayoutEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import HowWeWork from "./components/HowWeWork";
import About from "./components/About";
import Contact from "./components/Contact";
import GetStarted from "./components/GetStarted";
import ThreatMap from "./components/ThreatMap";
import Background from "./components/Background";

export default function LandingPage() {
  useLayoutEffect(() => {
    // a refresh while the URL has a "#section" hash would otherwise have the
    // browser auto-jump back there (its native scroll-restoration) — always
    // land on the homepage instead, and drop the hash so a later refresh
    // does the same
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <div id="top" className="relative min-h-screen bg-[#07080a]">
      {/* sits directly behind the sticky header at the very top of the page —
          without it, the header's backdrop-blur has nothing colorful to
          blur at scroll position 0 and the glass effect is invisible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[var(--brand-green)]/25 blur-[80px]"
      />
      <Navbar />
      <div id="home" className="relative flex min-h-[calc(100vh-98px)] items-center overflow-hidden">
        <Background />
        <ThreatMap />
        <div className="relative z-10 w-full">
          <Hero />
        </div>
      </div>
      <HowWeWork />
      <Services />
      <About />
      <Contact />
      <GetStarted />
    </div>
  );
}
