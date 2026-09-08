const NODES = [
  { x: 460, y: 160 },
  { x: 340, y: 90 },
  { x: 560, y: 300 },
  { x: 380, y: 400 },
  { x: 520, y: 480 },
  { x: 250, y: 520 },
  { x: 300, y: 260 },
];

const HUB = { x: 420, y: 300 };

const EDGES = [0, 1, 2, 3, 4, 5, 6].map((i) => [HUB, NODES[i]] as const);

export default function ThreatMap() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[55%] select-none opacity-70 md:block"
    >
      <svg viewBox="0 0 700 700" className="h-full w-full">
        <defs>
          <filter id="nodeGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#4a7c4e"
            strokeWidth="1"
            strokeOpacity="0.35"
            strokeDasharray="2 6"
          />
        ))}

        {NODES.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="10" fill="#4a7c4e" opacity="0.25" filter="url(#nodeGlow)" />
            <circle cx={n.x} cy={n.y} r="3" fill="#7CFF8C" opacity="0.8" />
          </g>
        ))}

        <circle cx={HUB.x} cy={HUB.y} r="22" fill="#4a7c4e" opacity="0.2" filter="url(#nodeGlow)" />
        <circle cx={HUB.x} cy={HUB.y} r="6" fill="#7CFF8C" />
        <circle cx={HUB.x} cy={HUB.y} r="34" fill="none" stroke="#7CFF8C" strokeOpacity="0.3" strokeWidth="1" />
      </svg>
    </div>
  );
}
