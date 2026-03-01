import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body; // "dismiss" | "review" | "ban"

  const report = await prisma.report.findUnique({ where: { id: params.id } });
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  if (action === "dismiss") {
    await prisma.report.update({
      where: { id: params.id },
      data: { status: "DISMISSED" },
    });
  } else if (action === "review") {
    await prisma.report.update({
      where: { id: params.id },
      data: { status: "REVIEWED" },
    });
  } else if (action === "ban") {
    // Ban the reported user + mark report as reviewed
    await Promise.all([
      prisma.profile.upsert({
        where: { userId: report.reportedId },
        update: { banned: true },
        create: { userId: report.reportedId, banned: true },
      }),
      prisma.report.update({
        where: { id: params.id },
        data: { status: "REVIEWED" },
      }),
    ]);
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
