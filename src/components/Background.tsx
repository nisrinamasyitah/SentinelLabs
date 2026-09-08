export default function Background() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#07080a]">
      {/* graph-paper grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,255,140,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(124,255,140,0.15) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at 70% 35%, black 0%, black 35%, transparent 75%)",
        }}
      />

      {/* soft brand glow, upper right where the visual panel sits */}
      <div className="absolute right-[-10%] top-[8%] h-[55%] w-[55%] rounded-full bg-[var(--brand-green)]/15 blur-[140px]" />
      <div className="absolute left-[-5%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-[var(--brand-green)]/5 blur-[140px]" />

      {/* vignette to keep focus on the copy */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.5)_80%,rgba(0,0,0,0.85)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
    </div>
  );
}
