import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { listingSchema } from "@/lib/validations/listing";
import { DISTRICT_COORDS } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const district = searchParams.get("district");
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = 48;

    const listings = await prisma.listing.findMany({
      where: {
        status: "ACTIVE",
        ...(category && { category: { slug: category } }),
        ...(district && { district }),
        ...(q && {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                avatarUrl: true,
                district: true,
                averageRating: true,
                reviewCount: true,
              },
            },
          },
        },
        category: true,
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await prisma.listing.count({
      where: {
        status: "ACTIVE",
        ...(category && { category: { slug: category } }),
        ...(district && { district }),
        ...(q && {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }),
      },
    });

    return NextResponse.json({ listings, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Listings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load listings." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { emailVerifiedAt: true },
    });
    if (!currentUser?.emailVerifiedAt) {
      return NextResponse.json(
        { error: "Please verify your email address first." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = listingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { title, description, categoryId, district, priceType, priceAmount, tags, latitude, longitude } = result.data;

    const coords = district ? DISTRICT_COORDS[district] ?? null : null;

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        categoryId,
        district: district || null,
        priceType,
        priceAmount: priceAmount ?? null,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        latitude: latitude ?? coords?.lat ?? null,
        longitude: longitude ?? coords?.lng ?? null,
        userId: session.user.id,
        status: "PENDING",
      },
      include: { category: true },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("Listing create error:", error);
    return NextResponse.json(
      { error: "Failed to create listing." },
      { status: 500 }
    );
  }
}
