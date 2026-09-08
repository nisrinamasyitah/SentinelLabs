import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyMagicLink } from "./api";

export default function VerifyPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const token = params.get("token");
  // magic-link tokens are single-use server-side; a ref (not a cancelled
  // flag) is required here so StrictMode's dev-mode double-invoke doesn't
  // fire the verify request twice and spuriously burn the token
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token) {
      setError("Missing sign-in token.");
      return;
    }
    if (hasRun.current) return;
    hasRun.current = true;

    verifyMagicLink(token)
      .then(() => navigate("/portal", { replace: true }))
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Sign-in failed");
      });
  }, [token, navigate]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-start justify-center px-6">
      <a href="/" className="mb-10 font-display text-xl leading-tight text-white">
        Sentinel
        <br />
        Labs<span className="text-[var(--brand-red)]">.</span>
      </a>

      {error ? (
        <>
          <p className="text-sm text-[var(--brand-red)]">{error}</p>
          <a
            href="/portal"
            className="mt-4 rounded-lg bg-[var(--brand-green)] px-6 py-3 font-display text-sm text-white"
          >
            Back to sign in
          </a>
        </>
      ) : (
        <p className="text-sm text-white/60">Signing you in...</p>
      )}
    </div>
  );
}
