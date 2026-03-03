import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail, resetPasswordEmail } from "@/lib/email";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email?.trim()) {
      return NextResponse.json({ error: "E-Mail-Adresse fehlt." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });

    // Always return success to avoid user enumeration
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Invalidate existing reset tokens for this user
    await prisma.emailToken.deleteMany({
      where: { userId: user.id, type: "RESET_PASSWORD", usedAt: null },
    });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.emailToken.create({
      data: { userId: user.id, type: "RESET_PASSWORD", tokenHash, expiresAt },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://kiezhelfer.com";
    const resetUrl = `${appUrl}/de/reset-password?token=${rawToken}`;

    const { subject, html } = resetPasswordEmail(user.name ?? "", resetUrl);
    await sendMail({ to: user.email, subject, html });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Fehler beim Senden der E-Mail." }, { status: 500 });
  }
}
