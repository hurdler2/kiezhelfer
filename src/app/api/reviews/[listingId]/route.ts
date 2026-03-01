import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    const reviews = await prisma.review.findMany({
      where: { listingId: params.listingId, status: "APPROVED" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: { select: { avatarUrl: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json(
      { error: "Bewertungen konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}
