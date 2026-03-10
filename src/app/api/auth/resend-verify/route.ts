import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendMail, verifyEmailEmail } from "@/lib/email";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true, emailVerifiedAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.emailVerifiedAt) {
      return NextResponse.json({ error: "Email already verified." }, { status: 400 });
    }

    // Invalidate existing verify tokens
    await prisma.emailToken.deleteMany({
      where: { userId: session.user.id, type: "VERIFY_EMAIL", usedAt: null },
    });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailToken.create({
      data: { userId: session.user.id, type: "VERIFY_EMAIL", tokenHash, expiresAt },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://kiezhelfer.com";
    const verifyUrl = `${appUrl}/api/auth/verify-email?token=${rawToken}`;

    const { subject, html } = verifyEmailEmail(user.name ?? "", verifyUrl);
    await sendMail({ to: user.email, subject, html });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend verify error:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
