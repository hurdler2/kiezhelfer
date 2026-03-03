import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/de/login?error=invalid-token", request.url));
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const emailToken = await prisma.emailToken.findUnique({
      where: { tokenHash },
    });

    if (!emailToken || emailToken.type !== "VERIFY_EMAIL" || emailToken.usedAt) {
      return NextResponse.redirect(new URL("/de/login?error=invalid-token", request.url));
    }

    if (emailToken.expiresAt < new Date()) {
      return NextResponse.redirect(new URL("/de/login?error=token-expired", request.url));
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: emailToken.userId },
        data: { emailVerifiedAt: new Date() },
      }),
      prisma.emailToken.update({
        where: { id: emailToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.redirect(new URL("/de/email-verified", request.url));
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.redirect(new URL("/de/login?error=server-error", request.url));
  }
}
