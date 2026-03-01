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

  const body = await req.json();
  const { banned, role } = body;

  if (typeof banned === "boolean") {
    await prisma.profile.upsert({
      where: { userId: params.id },
      update: { banned },
      create: { userId: params.id, banned },
    });
  }

  if (role === "ADMIN" || role === "USER") {
    await prisma.user.update({
      where: { id: params.id },
      data: { role },
    });
  }

  return NextResponse.json({ ok: true });
}
