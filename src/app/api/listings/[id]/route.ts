import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            profile: {
              select: {
                avatarUrl: true,
                bio: true,
                district: true,
                averageRating: true,
                reviewCount: true,
                skillTags: true,
              },
            },
          },
        },
        category: true,
        reviews: {
          where: { status: "APPROVED" },
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
          take: 10,
        },
        _count: { select: { reviews: true } },
      },
    });

    if (!listing || listing.status === "DELETED") {
      return NextResponse.json({ error: "Angebot nicht gefunden." }, { status: 404 });
    }

    // Increment view count
    await prisma.listing.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Listing fetch error:", error);
    return NextResponse.json(
      { error: "Angebot konnte nicht geladen werden." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
    }

    const listing = await prisma.listing.findUnique({ where: { id: params.id } });
    if (!listing) {
      return NextResponse.json({ error: "Angebot nicht gefunden." }, { status: 404 });
    }
    if (listing.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403 });
    }

    const body = await request.json();
    const updated = await prisma.listing.update({
      where: { id: params.id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.categoryId && { categoryId: body.categoryId }),
        ...(body.district !== undefined && { district: body.district }),
        ...(body.priceType && { priceType: body.priceType }),
        ...(body.priceAmount !== undefined && { priceAmount: body.priceAmount }),
        ...(body.tags !== undefined && {
          tags: typeof body.tags === "string"
            ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
            : body.tags,
        }),
        ...(body.status && { status: body.status }),
        ...(body.imageUrls !== undefined && { imageUrls: body.imageUrls }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Listing update error:", error);
    return NextResponse.json(
      { error: "Angebot konnte nicht aktualisiert werden." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
    }

    const listing = await prisma.listing.findUnique({ where: { id: params.id } });
    if (!listing) {
      return NextResponse.json({ error: "Angebot nicht gefunden." }, { status: 404 });
    }
    if (listing.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403 });
    }

    await prisma.listing.update({
      where: { id: params.id },
      data: { status: "DELETED" },
    });

    return NextResponse.json({ message: "Angebot gelöscht." });
  } catch (error) {
    console.error("Listing delete error:", error);
    return NextResponse.json(
      { error: "Angebot konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}
