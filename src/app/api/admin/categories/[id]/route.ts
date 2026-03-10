import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug, nameKey, iconName, sortOrder } = await req.json();

  if (slug) {
    const existing = await prisma.category.findFirst({
      where: { slug, NOT: { id: params.id } },
    });
    if (existing) {
      return NextResponse.json({ error: "Bu slug zaten kullanılıyor" }, { status: 409 });
    }
  }

  const category = await prisma.category.update({
    where: { id: params.id },
    data: {
      ...(slug !== undefined && { slug }),
      ...(nameKey !== undefined && { nameKey }),
      ...(iconName !== undefined && { iconName: iconName || null }),
      ...(sortOrder !== undefined && { sortOrder }),
    },
  });

  return NextResponse.json(category);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const listingCount = await prisma.listing.count({
    where: { categoryId: params.id },
  });

  if (listingCount > 0) {
    return NextResponse.json(
      { error: `Bu kategoride ${listingCount} ilan var, silinemez` },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
