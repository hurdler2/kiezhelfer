import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL ?? "info@kiezhelfer.com";

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set, skipping email send.");
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({ from: FROM, to, subject, html });
}

export function resetPasswordEmail(name: string, resetUrl: string) {
  return {
    subject: "KiezHelfer – Passwort zurücksetzen",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#0f172a">Hallo${name ? ` ${name}` : ""},</h2>
        <p>Du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt.</p>
        <p style="margin:24px 0">
          <a href="${resetUrl}" style="background:#2CB34F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
            Passwort zurücksetzen
          </a>
        </p>
        <p style="color:#64748b;font-size:14px">Dieser Link ist 1 Stunde gültig. Falls du keine Anfrage gestellt hast, kannst du diese E-Mail ignorieren.</p>
      </div>
    `,
  };
}

export function contactReplyEmail(senderName: string, originalMessage: string, replyText: string) {
  return {
    subject: "KiezHelfer – Antwort auf Ihre Nachricht",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#0f172a">Hallo ${senderName},</h2>
        <p>vielen Dank für Ihre Nachricht an KiezHelfer. Hier ist unsere Antwort:</p>
        <div style="background:#f0fdf4;border-left:4px solid #2CB34F;padding:16px;border-radius:0 8px 8px 0;margin:20px 0">
          <p style="margin:0;color:#1e293b;white-space:pre-wrap">${replyText}</p>
        </div>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
        <p style="color:#94a3b8;font-size:12px">Ihre ursprüngliche Nachricht:</p>
        <p style="color:#94a3b8;font-size:12px;white-space:pre-wrap">${originalMessage}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
        <p style="color:#64748b;font-size:13px">Mit freundlichen Grüßen,<br/><strong>Das KiezHelfer-Team</strong></p>
      </div>
    `,
  };
}

export function verifyEmailEmail(name: string, verifyUrl: string) {
  return {
    subject: "KiezHelfer – E-Mail bestätigen",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#0f172a">Willkommen bei KiezHelfer${name ? `, ${name}` : ""}!</h2>
        <p>Bitte bestätige deine E-Mail-Adresse, um alle Funktionen nutzen zu können.</p>
        <p style="margin:24px 0">
          <a href="${verifyUrl}" style="background:#2CB34F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
            E-Mail bestätigen
          </a>
        </p>
        <p style="color:#64748b;font-size:14px">Dieser Link ist 24 Stunden gültig.</p>
      </div>
    `,
  };
}
