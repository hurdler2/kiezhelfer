import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        profile: {
          select: {
            bio: true,
            avatarUrl: true,
            district: true,
            averageRating: true,
            reviewCount: true,
            skillTags: true,
          },
        },
        listings: {
          where: { status: "ACTIVE" },
          include: { category: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { listings: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load user." },
      { status: 500 }
    );
  }
}
