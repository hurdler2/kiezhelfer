import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const message = await prisma.message.findUnique({
      where: { id: params.messageId },
    });

    if (!message || message.conversationId !== params.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Only the sender can delete their own message
    if (message.senderId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Already hidden for this user — no-op
    if ((message.deletedFor as string[]).includes(userId)) {
      return NextResponse.json({ ok: true });
    }

    await prisma.message.update({
      where: { id: params.messageId },
      data: { deletedFor: { push: userId } },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Message delete error:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
