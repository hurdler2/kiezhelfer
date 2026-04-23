import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        listings: {
          where: { status: { not: "DELETED" } },
          include: { category: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();

    // Update user name and/or image if provided
    if (body.name || body.avatarUrl !== undefined) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          ...(body.name && { name: body.name }),
          ...(body.avatarUrl !== undefined && { image: body.avatarUrl }),
        },
      });
    }

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.district !== undefined && { district: body.district }),
        ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl }),
        ...(body.skillTags !== undefined && { skillTags: body.skillTags }),
        ...(body.preferredLocale && { preferredLocale: body.preferredLocale }),
      },
      create: {
        userId: session.user.id,
        bio: body.bio,
        phone: body.phone,
        district: body.district,
        avatarUrl: body.avatarUrl,
        skillTags: body.skillTags ?? [],
        preferredLocale: body.preferredLocale ?? "de",
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
