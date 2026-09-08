import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

const smtpConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: Number(SMTP_PORT ?? 587) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

/**
 * Sends the magic-link email. If no SMTP credentials are configured (local dev
 * default), the link is logged to the server console and returned to the
 * caller instead, so the login flow is fully testable without a mail provider.
 */
export async function sendMagicLinkEmail(
  to: string,
  link: string,
): Promise<{ devLink?: string }> {
  if (!transporter) {
    console.log(`\n[dev email] Magic link for ${to}:\n  ${link}\n`);
    return { devLink: link };
  }

  await transporter.sendMail({
    from: SMTP_FROM ?? "Sentinel Labs <noreply@sentinellabs.dev>",
    to,
    subject: "Your Sentinel Labs sign-in link",
    text: `Sign in to your Sentinel Labs client portal:\n\n${link}\n\nThis link expires in 15 minutes.`,
    html: `<p>Sign in to your Sentinel Labs client portal:</p><p><a href="${link}">${link}</a></p><p>This link expires in 15 minutes.</p>`,
  });
  return {};
}

const CONTACT_INBOX = process.env.CONTACT_INBOX;

/**
 * Notifies the site owner of a new contact-form submission. Same dev
 * fallback as the magic-link sender: no SMTP configured means it's logged
 * instead of sent, so the form is testable without a mail provider.
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

  if (!transporter) {
    console.log(
      `\n[dev email] Contact notification (would go to ${CONTACT_INBOX}):\n  from: ${entry.name} <${entry.email}>\n  ${entry.message}\n`,
    );
    return { devLogged: true };
  }

  await transporter.sendMail({
    from: SMTP_FROM ?? "Sentinel Labs <noreply@sentinellabs.dev>",
    to: CONTACT_INBOX,
    replyTo: entry.email,
    subject: `New contact form message from ${entry.name}`,
    text: `From: ${entry.name} <${entry.email}>\n\n${entry.message}`,
    html: `<p><strong>From:</strong> ${entry.name} &lt;${entry.email}&gt;</p><p>${entry.message.replace(/\n/g, "<br>")}</p>`,
  });
  return {};
}
