import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

    const { listingId, targetUserId, rating, comment } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid review data." }, { status: 400 });
    }

    // ── A) İlan değerlendirmesi (listingId var) ──────────────────────────────
    if (listingId) {
      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing) {
        return NextResponse.json({ error: "Listing not found." }, { status: 404 });
      }
      if (listing.userId === session.user.id) {
        return NextResponse.json(
          { error: "You cannot review your own listing." },
          { status: 400 }
        );
      }

      const existingReview = await prisma.review.findUnique({
        where: { listingId_authorId: { listingId, authorId: session.user.id } },
      });
      if (existingReview) {
        return NextResponse.json(
          { error: "You have already reviewed this listing." },
          { status: 409 }
        );
      }

      const review = await prisma.$transaction(async (tx) => {
        const newReview = await tx.review.create({
          data: {
            listingId,
            authorId: session.user.id,
            targetId: listing.userId,
            rating,
            comment: comment || null,
          },
          include: {
            author: {
              select: { id: true, name: true, profile: { select: { avatarUrl: true } } },
            },
          },
        });

        // Listing ortalama güncelle
        const listingAgg = await tx.review.aggregate({
          where: { listingId, status: "APPROVED" },
          _avg: { rating: true },
          _count: true,
        });
        await tx.listing.update({
          where: { id: listingId },
          data: { averageRating: listingAgg._avg.rating ?? 0, reviewCount: listingAgg._count },
        });

        // Kullanıcı profil ortalama güncelle
        const userAgg = await tx.review.aggregate({
          where: { targetId: listing.userId, status: "APPROVED" },
          _avg: { rating: true },
          _count: true,
        });
        await tx.profile.updateMany({
          where: { userId: listing.userId },
          data: { averageRating: userAgg._avg.rating ?? 0, reviewCount: userAgg._count },
        });

        return newReview;
      });

      return NextResponse.json(review, { status: 201 });
    }

    // ── B) Kullanıcı profil değerlendirmesi (targetUserId var) ───────────────
    if (targetUserId) {
      if (targetUserId === session.user.id) {
        return NextResponse.json(
          { error: "You cannot review yourself." },
          { status: 400 }
        );
      }

      const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
      if (!targetUser) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      // Aynı kullanıcıyı daha önce değerlendirdi mi? (listingId NULL olan)
      const existingUserReview = await prisma.review.findFirst({
        where: { targetId: targetUserId, authorId: session.user.id, listingId: null },
      });
      if (existingUserReview) {
        return NextResponse.json(
          { error: "You have already reviewed this user." },
          { status: 409 }
        );
      }

      const review = await prisma.$transaction(async (tx) => {
        const newReview = await tx.review.create({
          data: {
            listingId: null,
            authorId: session.user.id,
            targetId: targetUserId,
            rating,
            comment: comment || null,
          },
          include: {
            author: {
              select: { id: true, name: true, profile: { select: { avatarUrl: true } } },
            },
          },
        });

        // Kullanıcı profil ortalama güncelle
        const userAgg = await tx.review.aggregate({
          where: { targetId: targetUserId, status: "APPROVED" },
          _avg: { rating: true },
          _count: true,
        });
        await tx.profile.updateMany({
          where: { userId: targetUserId },
          data: { averageRating: userAgg._avg.rating ?? 0, reviewCount: userAgg._count },
        });

        return newReview;
      });

      return NextResponse.json(review, { status: 201 });
    }

    return NextResponse.json(
      { error: "Either listingId or targetUserId is required." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Review create error:", error);
    return NextResponse.json(
      { error: "Failed to save review." },
      { status: 500 }
    );
  }
}
