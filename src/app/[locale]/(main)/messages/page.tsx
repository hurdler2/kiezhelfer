import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import Avatar from "@/components/ui/Avatar";
import { formatRelativeTime } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

export default async function MessagesPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const session = await auth();

  if (!session?.user) {
    redirect(`/${params.locale}/login`);
  }

  const t = await getTranslations("messages");
  const tDash = await getTranslations("dashboard");

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
        where: {
          deletedAt: null,
          NOT: { deletedFor: { has: session.user.id } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("title")}</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-1">{t("noConversations")}</h3>
          <p className="text-sm text-gray-400">{t("noConversationsHint")}</p>
          <Link
            href="/listings"
            className="mt-4 inline-block text-teal-600 hover:text-teal-700 font-medium text-sm"
          >
            {t("startConversation")}
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => {
            const otherParticipant = conv.participants.find(
              (p) => p.userId !== session.user.id
            );
            const lastMessage = conv.messages[0];

            return (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}` as any}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-sm transition-all"
              >
                <Avatar
                  src={otherParticipant?.user.profile?.avatarUrl}
                  name={otherParticipant?.user.name}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">
                      {otherParticipant?.user.name ?? tDash("unknown")}
                    </p>
                    {lastMessage && (
                      <span className="text-xs text-gray-400">
                        {formatRelativeTime(lastMessage.createdAt, params.locale)}
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <p className="text-sm text-gray-500 truncate mt-0.5">
                      {lastMessage.senderId === session.user.id ? `${t("you")}: ` : ""}
                      {lastMessage.content}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
