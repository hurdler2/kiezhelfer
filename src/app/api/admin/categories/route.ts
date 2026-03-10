import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { listings: true } } },
  });

  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug, nameKey, iconName, sortOrder } = await req.json();

  if (!slug || !nameKey) {
    return NextResponse.json({ error: "slug and nameKey are required." }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "This slug is already in use." }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: {
      slug,
      nameKey,
      iconName: iconName || null,
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
