import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import ScanRunner from "./ScanRunner";
import Background from "../components/Background";
import { getCurrentEngagement, getMe, logout } from "./api";
import type { ClientProfile, Engagement } from "./types";

export default function PortalApp() {
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientProfile | null | undefined>(undefined);
  const [engagement, setEngagement] = useState<Engagement | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function load() {
    try {
      const me = await getMe();
      setClient(me);
      if (me) {
        setEngagement(await getCurrentEngagement());
      } else {
        setEngagement(null);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load portal");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleLogout() {
    await logout();
    setClient(null);
    setEngagement(null);
    navigate("/");
  }

  // undefined = still checking session on first load
  if (client === undefined) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07080a]">
      <Background />
      <div className="relative z-10">
        {loadError ? (
          <p className="p-10 text-sm text-[var(--brand-red)]">{loadError}</p>
        ) : !client ? (
          <LoginForm />
        ) : !engagement ? (
          <NoEngagement clientEmail={client.email} onLogout={handleLogout} />
        ) : engagement.liveRunPending ? (
          <ScanRunner engagement={engagement} onComplete={setEngagement} />
        ) : (
          <Dashboard engagement={engagement} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

function NoEngagement({
  clientEmail,
  onLogout,
}: {
  clientEmail: string;
  onLogout: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-start justify-center px-6">
      <a href="/" className="mb-10 font-display text-xl leading-tight text-white">
        Sentinel
        <br />
        Labs<span className="text-[var(--brand-red)]">.</span>
      </a>
      <h1 className="font-display text-2xl text-white">No engagement yet</h1>
      <p className="mt-2 text-sm text-white/60">
        {clientEmail} isn't attached to an active engagement. Start a free
        scan from the homepage to kick one off.
      </p>
      <div className="mt-6 flex gap-3">
        <a
          href="/"
          className="rounded-lg bg-[var(--brand-green)] px-5 py-2.5 font-display text-sm text-white"
        >
          Back to homepage
        </a>
        <button
          onClick={onLogout}
          className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-white/70"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
