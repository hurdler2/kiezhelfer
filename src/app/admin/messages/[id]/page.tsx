import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default async function AdminConversationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: params.id },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              reportsReceived: { select: { id: true, reason: true } },
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!conversation) notFound();

  const participantMap = Object.fromEntries(
    conversation.participants.map((p) => [p.userId, p.user])
  );

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-center gap-3">
        <a
          href="/admin/messages"
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </a>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Konuşma Detayı</h1>
          <p className="text-sm text-gray-500 mt-0.5">{conversation.messages.length} mesaj</p>
        </div>
      </div>

      {/* Katılımcı Bilgileri */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Katılımcılar</h2>
        <div className="flex flex-wrap gap-4">
          {conversation.participants.map((p) => {
            const isReported = p.user.reportsReceived.length > 0;
            return (
              <div
                key={p.id}
                className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-sm ${
                  isReported
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {isReported && <ShieldAlert className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />}
                <div>
                  <p className={`font-medium ${isReported ? "text-red-700" : "text-gray-800"}`}>
                    {p.user.name ?? "—"}
                  </p>
                  <p className="text-xs text-gray-400">{p.user.email}</p>
                  {isReported && (
                    <p className="text-xs text-red-500 mt-0.5">
                      {p.user.reportsReceived.length} şikayet aldı
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mesajlar */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 text-sm">Mesajlar</h2>
        </div>
        {conversation.messages.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">Mesaj bulunamadı.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {conversation.messages.map((msg) => {
              const sender = participantMap[msg.senderId];
              const isReported = (sender?.reportsReceived.length ?? 0) > 0;
              return (
                <div
                  key={msg.id}
                  className={`px-5 py-3 flex gap-3 ${isReported ? "bg-red-50/40" : ""}`}
                >
                  {/* Avatar placeholder */}
                  <div
                    className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                      isReported
                        ? "bg-red-200 text-red-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {msg.sender.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-xs font-semibold ${
                          isReported ? "text-red-700" : "text-gray-800"
                        }`}
                      >
                        {msg.sender.name ?? "—"}
                        {isReported && (
                          <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-medium">
                            Şikayet Edildi
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {format(msg.createdAt, "dd.MM.yyyy HH:mm")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
