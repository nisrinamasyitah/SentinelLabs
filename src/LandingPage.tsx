import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import About from "./components/About";
import Contact from "./components/Contact";
import GetStarted from "./components/GetStarted";
import ThreatMap from "./components/ThreatMap";
import Background from "./components/Background";

export default function LandingPage() {
  return (
    <div id="top" className="bg-[#07080a]">
      <Navbar />
      <div className="relative overflow-hidden">
        <Background />
        <ThreatMap />
        <div className="relative z-10">
          <Hero />
        </div>
      </div>
      <Services />
      <About />
      <Contact />
      <GetStarted />
    </div>
  );
}
