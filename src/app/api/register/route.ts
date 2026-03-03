import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/user";
import { sendMail, verifyEmailEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, district } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Diese E-Mail-Adresse ist bereits registriert." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        profile: {
          create: {
            district: district || null,
          },
        },
      },
    });

    // Send verification email (async, don't block response)
    try {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await prisma.emailToken.create({
        data: { userId: user.id, type: "VERIFY_EMAIL", tokenHash, expiresAt },
      });
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://kiezhelfer.com";
      const verifyUrl = `${appUrl}/api/auth/verify-email?token=${rawToken}`;
      const { subject, html } = verifyEmailEmail(user.name ?? "", verifyUrl);
      await sendMail({ to: user.email, subject, html });
    } catch (emailErr) {
      console.warn("Verification email failed:", emailErr);
    }

    return NextResponse.json(
      { message: "Konto erfolgreich erstellt.", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Etwas ist schiefgelaufen." },
      { status: 500 }
    );
  }
}
