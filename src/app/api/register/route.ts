import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/user";
import { sendMail, verifyEmailEmail } from "@/lib/email";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const body = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      district: (formData.get("district") as string) || undefined,
      bio: (formData.get("bio") as string) || undefined,
    };
    const avatarFile = formData.get("avatar") as File | null;

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    if (avatarFile && avatarFile.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(avatarFile.type)) {
        return NextResponse.json(
          { error: "Only JPEG, PNG and WebP allowed." },
          { status: 400 }
        );
      }
      if (avatarFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File must be 5 MB or less." },
          { status: 400 }
        );
      }
    }

    const { name, email, password, district, bio } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 409 }
      );
    }

    let avatarUrl: string | null = null;
    if (avatarFile && avatarFile.size > 0) {
      const ext = avatarFile.type === "image/png" ? "png" : avatarFile.type === "image/webp" ? "webp" : "jpg";
      const filename = `avatars/${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
      const blob = await put(filename, avatarFile, { access: "public" });
      avatarUrl = blob.url;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        image: avatarUrl,
        profile: {
          create: {
            district: district || null,
            avatarUrl: avatarUrl,
            bio: bio || null,
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
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
