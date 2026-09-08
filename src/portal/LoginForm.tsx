import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { requestMagicLink } from "./api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await requestMagicLink(email.trim());
      setSent(true);
      setDevLink(res.devLink ?? null);
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

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <a href="/" className="mb-10 font-display text-xl leading-tight text-white">
        Sentinel
        <br />
        Labs<span className="text-[var(--brand-red)]">.</span>
      </a>

      <h1 className="font-display text-3xl text-white">Client Portal</h1>

      {sent ? (
        <div className="mt-6 flex flex-col gap-4">
          <p className="text-sm text-white/70">
            Check <span className="text-white">{email}</span> for a sign-in
            link. It expires in 15 minutes.
          </p>
          {devLink && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              <p className="mb-2 font-medium text-white/70">
                Dev mode — no SMTP configured, so the email wasn't actually
                sent. Continue with the link that would have been emailed:
              </p>
              <button
                onClick={continueDevLink}
                className="rounded-md bg-[var(--brand-green)] px-4 py-2 font-display text-xs text-white"
              >
                Continue to portal
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm text-white/60">
            Enter the email your engagement was set up with — we'll send you
            a sign-in link.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
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
              name="portal-login-email"
              autoComplete="email"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm tracking-wide text-white placeholder:text-white/30 outline-none focus:border-[var(--brand-green)]"
            />
            {error && <p className="text-sm text-[var(--brand-red)]">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[var(--brand-green)] px-6 py-3 font-display text-sm text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send Sign-In Link"}
            </button>
          </form>

          <div className="mt-10 rounded-lg border border-white/10 bg-white/5 p-4 text-xs text-white/50">
            <p className="mb-1 font-medium text-white/70">Demo accounts</p>
            <p>dana@acmecorp.com — Acme Corp</p>
            <p>ravi@northwindlogistics.com — Northwind Logistics</p>
          </div>
        </>
      )}
    </div>
  );
}
