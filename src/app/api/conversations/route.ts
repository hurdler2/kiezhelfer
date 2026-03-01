import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { userId: session.user.id } },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile: { select: { avatarUrl: true } },
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Conversations fetch error:", error);
    return NextResponse.json(
      { error: "Nachrichten konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
    }

    const { recipientId, listingId } = await request.json();

    if (!recipientId) {
      return NextResponse.json({ error: "Empfänger fehlt." }, { status: 400 });
    }

    if (recipientId === session.user.id) {
      return NextResponse.json(
        { error: "Du kannst dir selbst keine Nachrichten senden." },
        { status: 400 }
      );
    }

    // Check if conversation already exists between these two users for this listing
    const existing = await prisma.conversation.findFirst({
      where: {
        ...(listingId && { listingId }),
        participants: { every: { userId: { in: [session.user.id, recipientId] } } },
      },
      include: { participants: true },
    });

    if (existing && existing.participants.length === 2) {
      return NextResponse.json(existing);
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        listingId: listingId ?? null,
        participants: {
          create: [
            { userId: session.user.id },
            { userId: recipientId },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile: { select: { avatarUrl: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error("Conversation create error:", error);
    return NextResponse.json(
      { error: "Konversation konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}
