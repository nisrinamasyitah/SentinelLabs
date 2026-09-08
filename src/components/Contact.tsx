import { useState, type FormEvent } from "react";
import { submitContactMessage } from "../portal/api";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await submitContactMessage(name.trim(), email.trim(), message.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-6 py-24 md:px-16"
    >
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-display text-sm tracking-widest text-[var(--brand-green)]">
            GET IN TOUCH
          </p>
          <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] text-white md:text-5xl">
            Talk to a
            <span className="relative mx-2 inline-block -rotate-2 bg-[var(--brand-green)] px-3 py-1">
              human
            </span>
            about your risk
          </h2>
          <p className="mt-6 max-w-md text-white/70">
            Tell us about your environment and what you're trying to
            protect. An analyst — not a bot — will get back to you to scope
            an engagement.
          </p>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/60">
            <div>
              <p className="text-white/40">Prefer a live scan first?</p>
              <a href="#top" className="text-white hover:text-[var(--brand-green)]">
                Book a free threat scan →
              </a>
            </div>
            <div>
              <p className="text-white/40">Already a client?</p>
              <a href="/portal" className="text-white hover:text-[var(--brand-green)]">
                Sign in to your portal →
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          {sent ? (
            <div className="flex flex-col items-start gap-2">
              <p className="font-display text-lg text-white">
                Message sent.
              </p>
              <p className="text-sm text-white/60">
                Thanks, {name.split(" ")[0] || "there"} — we'll be in touch
                at {email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  required
                  placeholder="Your name"
                  name="contact-name"
                  autoComplete="name"
                  className="rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[var(--brand-green)]"
                />
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  type="email"
                  required
                  placeholder="you@company.com"
                  name="contact-email"
                  autoComplete="email"
                  className="rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[var(--brand-green)]"
                />
              </div>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setError(null);
                }}
                required
                rows={5}
                placeholder="What are you looking to secure?"
                name="contact-message"
                className="resize-none rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[var(--brand-green)]"
              />
              {error && <p className="text-sm text-[var(--brand-red)]">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="self-start rounded-lg bg-[var(--brand-green)] px-6 py-3 font-display text-sm text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
