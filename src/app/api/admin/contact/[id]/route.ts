import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const { isRead } = await request.json();

  await (prisma as any).contactMessage.update({
    where: { id: params.id },
    data: { isRead: !!isRead },
  });

  return NextResponse.json({ success: true });
}
