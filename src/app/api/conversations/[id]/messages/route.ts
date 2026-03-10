import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId: params.id,
          userId: session.user.id,
        },
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { content } = await request.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: { conversationId: params.id, senderId: session.user.id, content },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profile: { select: { avatarUrl: true } },
          },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: params.id },
      data: { updatedAt: new Date() },
    });

    await prisma.conversationParticipant.updateMany({
      where: { conversationId: params.id, userId: { not: session.user.id } },
      data: { unreadCount: { increment: 1 } },
    });

    // Emit socket event for real-time updates
    const io = (global as Record<string, unknown>).io as {
      to: (room: string) => { emit: (event: string, data: unknown) => void };
    } | undefined;
    if (io) {
      io.to(`conversation:${params.id}`).emit("new_message", message);
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Message send error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Verify participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId: params.id,
          userId: session.user.id,
        },
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = 30;

    const messages = await prisma.message.findMany({
      where: {
        conversationId: params.id,
        deletedAt: null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profile: { select: { avatarUrl: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });

    // Mark as read
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId: params.id,
          userId: session.user.id,
        },
      },
      data: { unreadCount: 0, lastReadAt: new Date() },
    });

    return NextResponse.json({
      messages: messages.reverse(),
      nextCursor: messages.length === limit ? messages[0].id : null,
    });
  } catch (error) {
    console.error("Messages fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load messages." },
      { status: 500 }
    );
  }
}
