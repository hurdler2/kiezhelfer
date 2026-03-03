import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password || password.length < 8) {
      return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const emailToken = await prisma.emailToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!emailToken || emailToken.type !== "RESET_PASSWORD") {
      return NextResponse.json({ error: "Ungültiger oder abgelaufener Link." }, { status: 400 });
    }

    if (emailToken.usedAt) {
      return NextResponse.json({ error: "Dieser Link wurde bereits verwendet." }, { status: 400 });
    }

    if (emailToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Dieser Link ist abgelaufen." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: emailToken.userId },
        data: { passwordHash },
      }),
      prisma.emailToken.update({
        where: { id: emailToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Fehler beim Zurücksetzen des Passworts." }, { status: 500 });
  }
}
