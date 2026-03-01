import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { MessageSquare, ShieldAlert, Eye } from "lucide-react";

export default async function AdminMessagesPage() {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          user: {
            reportsReceived: { some: {} },
          },
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              reportsReceived: { select: { id: true } },
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          content: true,
          createdAt: true,
          sender: { select: { name: true } },
        },
      },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mesaj Moderasyonu</h1>
        <p className="text-sm text-gray-500 mt-1">
          Şikayet almış kullanıcıların dahil olduğu {conversations.length} konuşma
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Şikayet edilen kullanıcıya ait konuşma bulunamadı.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Katılımcılar</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Son Mesaj</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Mesaj</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Tarih</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {conversations.map((c) => {
                const lastMsg = c.messages[0];
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="space-y-1">
                        {c.participants.map((p) => {
                          const isReported = p.user.reportsReceived.length > 0;
                          return (
                            <div key={p.id} className="flex items-center gap-1.5">
                              {isReported && (
                                <ShieldAlert className="h-3 w-3 text-red-500 shrink-0" />
                              )}
                              <span className={`text-xs ${isReported ? "font-semibold text-red-700" : "text-gray-600"}`}>
                                {p.user.name ?? p.user.email}
                              </span>
                              {isReported && (
                                <span className="text-[10px] text-red-400">
                                  ({p.user.reportsReceived.length} şikayet)
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs max-w-[220px]">
                      {lastMsg ? (
                        <div>
                          <span className="font-medium text-gray-700">{lastMsg.sender.name ?? "—"}:</span>{" "}
                          <span className="truncate block max-w-[200px]">{lastMsg.content}</span>
                        </div>
                      ) : (
                        <span className="italic text-gray-300">Mesaj yok</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-sm font-medium">
                      {c._count.messages}
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {lastMsg ? format(lastMsg.createdAt, "dd.MM.yyyy HH:mm") : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <a
                        href={`/admin/messages/${c.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-brand-600 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" /> Görüntüle
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
