import { Resend } from "resend";

const { RESEND_API_KEY, SMTP_FROM } = process.env;
const FROM = SMTP_FROM ?? "Sentinel Labs <onboarding@resend.dev>";

// exported so callers can decide whether to await the send at all: the dev
// fallback below is instant (console.log, no network), but a real send is a
// genuine external API call. Uses Resend's HTTPS API rather than raw SMTP —
// most PaaS platforms (Railway included) block outbound SMTP ports by
// default to prevent spam abuse, which an HTTPS call on port 443 avoids.
export const emailConfigured = Boolean(RESEND_API_KEY);

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * Sends the magic-link email. If no RESEND_API_KEY is configured (local dev
 * default), the link is logged to the server console and returned to the
 * caller instead, so the login flow is fully testable without a mail provider.
 */
export async function sendMagicLinkEmail(
  to: string,
  link: string,
): Promise<{ devLink?: string }> {
  if (!resend) {
    console.log(`\n[dev email] Magic link for ${to}:\n  ${link}\n`);
    return { devLink: link };
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Your Sentinel Labs sign-in link",
    text: `Sign in to your Sentinel Labs client portal:\n\n${link}\n\nThis link expires in 15 minutes.`,
    html: `<p>Sign in to your Sentinel Labs client portal:</p><p><a href="${link}">${link}</a></p><p>This link expires in 15 minutes.</p>`,
  });
  if (error) throw new Error(error.message);
  return {};
}

const CONTACT_INBOX = process.env.CONTACT_INBOX;

/**
 * Notifies the site owner of a new contact-form submission. Same dev
 * fallback as the magic-link sender: no API key configured means it's
 * logged instead of sent, so the form is testable without a mail provider.
 */
export async function sendContactNotification(entry: {
  name: string;
  email: string;
  message: string;
}): Promise<{ devLogged?: boolean }> {
  if (!CONTACT_INBOX) {
    console.log(
      `\n[contact] No CONTACT_INBOX configured — message saved to DB only:\n  from: ${entry.name} <${entry.email}>\n  ${entry.message}\n`,
    );
    return {};
  }

  if (!resend) {
    console.log(
      `\n[dev email] Contact notification (would go to ${CONTACT_INBOX}):\n  from: ${entry.name} <${entry.email}>\n  ${entry.message}\n`,
    );
    return { devLogged: true };
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: CONTACT_INBOX,
    replyTo: entry.email,
    subject: `New contact form message from ${entry.name}`,
    text: `From: ${entry.name} <${entry.email}>\n\n${entry.message}`,
    html: `<p><strong>From:</strong> ${entry.name} &lt;${entry.email}&gt;</p><p>${entry.message.replace(/\n/g, "<br>")}</p>`,
  });
  if (error) throw new Error(error.message);
  return {};
}
