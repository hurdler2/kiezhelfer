import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@kiezhelfer.com";

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
