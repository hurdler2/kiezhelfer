import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.review.updateMany({
    where: { status: "PENDING" },
    data: { status: "APPROVED" },
  });

  return NextResponse.json({ ok: true, count: result.count });
}
