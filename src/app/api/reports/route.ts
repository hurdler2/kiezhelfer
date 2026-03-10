import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const VALID_REASONS = ["spam", "fake", "harassment", "scam", "inappropriate", "other"];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const reporterId = (session.user as any).id as string;
  const body = await req.json();
  const { reportedId, listingId, reason, details } = body;

  if (!reportedId || !VALID_REASONS.includes(reason)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (reporterId === reportedId) {
    return NextResponse.json({ error: "You cannot report yourself." }, { status: 400 });
  }

  const reported = await prisma.user.findUnique({ where: { id: reportedId } });
  if (!reported) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (listingId) {
    const existing = await prisma.report.findFirst({
      where: { reporterId, listingId, status: "PENDING" },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You already have a pending report for this listing." },
        { status: 409 }
      );
    }
  } else {
    const existing = await prisma.report.findFirst({
      where: { reporterId, reportedId, listingId: null, status: "PENDING" },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You already have a pending report for this user." },
        { status: 409 }
      );
    }
  }

  await prisma.report.create({
    data: {
      reporterId,
      reportedId,
      listingId: listingId ?? null,
      reason,
      details: details?.trim() || null,
    },
  });

  return NextResponse.json({ ok: true });
}
