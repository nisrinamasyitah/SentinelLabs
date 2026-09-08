import { useState } from "react";
import { STAGES, type Engagement } from "./types";
import ProgressTracker from "./ProgressTracker";
import StatTiles from "./StatTiles";
import FindingsTable from "./FindingsTable";
import { updateFindingStatus } from "./api";

export default function Dashboard({
  engagement,
  onLogout,
}: {
  engagement: Engagement;
  onLogout: () => void;
}) {
  const [findings, setFindings] = useState(engagement.findings);

  async function handleRemediate(findingId: string) {
    const prev = findings;
    setFindings((cur) =>
      cur.map((f) => (f.id === findingId ? { ...f, status: "verifying" } : f)),
    );
    try {
      await updateFindingStatus(findingId, "verifying");
    } catch {
      setFindings(prev);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:px-10">
      <div className="mb-10 flex items-start justify-between">
        <a href="/" className="font-display text-xl leading-tight text-white">
          Sentinel
          <br />
          Labs<span className="text-[var(--brand-red)]">.</span>
        </a>
        <button
          onClick={onLogout}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white"
        >
          Log out
        </button>
      </div>

      <p className="text-sm text-white/50">{engagement.client.name}</p>
      <h1 className="mt-1 font-display text-2xl text-white md:text-3xl">
        {engagement.name}
      </h1>
      <p className="mt-1 text-sm text-white/40">
        Target {engagement.target} · Started{" "}
        {new Date(engagement.startedOn).toISOString().slice(0, 10)} · Contact{" "}
        {engagement.client.contactName}
      </p>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
        <ProgressTracker stageIndex={STAGES.indexOf(engagement.stage)} />
      </div>

      <div className="mt-8">
        <StatTiles findings={findings} />
      </div>

      <h2 className="mb-4 mt-10 font-display text-lg text-white">Findings</h2>
      <FindingsTable findings={findings} onRemediate={handleRemediate} />
    </div>
  );
}
