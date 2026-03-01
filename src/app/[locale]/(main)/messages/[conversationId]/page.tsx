import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import ChatWindow from "@/components/messages/ChatWindow";

interface Props {
  params: { conversationId: string; locale: string };
}

export default async function ConversationPage({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations("common");
  const session = await auth();

  if (!session?.user) {
    redirect(`/${params.locale}/login`);
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.conversationId },
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

  if (!conversation) notFound();

  const isParticipant = conversation.participants.some(
    (p) => p.userId === session.user.id
  );
  if (!isParticipant) notFound();

  const otherParticipant = conversation.participants.find(
    (p) => p.userId !== session.user.id
  );

  // Fetch initial messages — exclude globally deleted AND messages this user deleted for themselves
  const messages = await prisma.message.findMany({
    where: {
      conversationId: params.conversationId,
      deletedAt: null,
      NOT: { deletedFor: { has: session.user.id } },
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
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  // Mark as read
  await prisma.conversationParticipant.update({
    where: {
      conversationId_userId: {
        conversationId: params.conversationId,
        userId: session.user.id,
      },
    },
    data: { unreadCount: 0, lastReadAt: new Date() },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
      <Link
        href="/messages"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        {t("back")}
      </Link>

      <ChatWindow
        conversationId={params.conversationId}
        initialMessages={messages as any}
        otherUser={{
          id: otherParticipant?.user.id ?? "",
          name: otherParticipant?.user.name ?? null,
          avatarUrl: otherParticipant?.user.profile?.avatarUrl,
        }}
      />
    </div>
  );
}
