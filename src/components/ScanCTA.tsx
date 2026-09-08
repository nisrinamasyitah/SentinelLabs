import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { startScan } from "../portal/api";

export default function ScanCTA({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await startScan(email.trim(), domain.trim());
      setSent(true);
      setDevLink(res.devLink ?? null);
      setEmailError(res.emailError ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function continueDevLink() {
    if (!devLink) return;
    const url = new URL(devLink);
    navigate(url.pathname + url.search);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-[var(--brand-green)] px-6 py-4 font-display text-sm text-white shadow-lg transition-transform hover:scale-[1.03]"
      >
        <span className="mr-1 text-[var(--brand-red)]">!</span>
        Book A Free Threat Scan
      </button>
    );
  }

  if (sent) {
    return (
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/80">
        {emailError ? (
          <p className="text-amber-300">{emailError}</p>
        ) : (
          <p>
            Scan started for <span className="text-white">{domain}</span>.
            Check <span className="text-white">{email}</span> for a link to
            watch it live.
          </p>
        )}
        {devLink && (
          <button
            onClick={continueDevLink}
            className="mt-3 rounded-md bg-[var(--brand-green)] px-4 py-2 font-display text-xs text-white"
          >
            Dev mode: watch it now
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2">
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError(null);
        }}
        type="email"
        required
        placeholder="you@company.com"
        autoFocus
        name="scan-lead-email"
        autoComplete="email"
        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 outline-none focus:border-[var(--brand-green)]"
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <input
          value={domain}
          onChange={(e) => {
            setDomain(e.target.value);
            setError(null);
          }}
          placeholder="yourcompany.com"
          name="scan-target-domain"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          data-1p-ignore
          data-lpignore="true"
          className="w-full flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-4 font-mono text-sm text-white placeholder:text-white/30 outline-none focus:border-[var(--brand-green)]"
        />
        <button
          type="submit"
          disabled={submitting}
          className="shrink-0 rounded-lg bg-[var(--brand-green)] px-6 py-4 font-display text-sm text-white shadow-lg transition-transform hover:scale-[1.03] disabled:opacity-60"
        >
          {submitting ? "Starting..." : "Start Free Scan"}
        </button>
      </div>
      {error && <p className="text-xs text-[var(--brand-red)]">{error}</p>}
    </form>
  );
}
