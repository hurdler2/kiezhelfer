import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { MessageSquare, ShieldAlert, Eye } from "lucide-react";

export default async function AdminMessagesPage() {
  // Şikayet almış kullanıcıların dahil olduğu konuşmalar
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
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Mesaj Moderasyonu</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Şikayet almış kullanıcıların dahil olduğu {conversations.length} konuşma
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-6 w-6 text-slate-300" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Şikayet edilen kullanıcıya ait konuşma bulunamadı.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Katılımcılar</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Son Mesaj</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Toplam</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tarih</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {conversations.map((c) => {
                const lastMsg = c.messages[0];
                const hasReportedUser = c.participants.some((p) => p.user.reportsReceived.length > 0);
                return (
                  <tr key={c.id} className={`transition-colors ${hasReportedUser ? "bg-red-50/20 hover:bg-red-50/40" : "hover:bg-slate-50"}`}>

                    {/* Participants */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-2">
                        {c.participants.map((p) => {
                          const isReported = p.user.reportsReceived.length > 0;
                          return (
                            <div key={p.id} className="flex items-center gap-2">
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                                isReported
                                  ? "bg-red-100 text-red-600"
                                  : "bg-slate-100 text-slate-500"
                              }`}>
                                {p.user.name ? p.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
                              </div>
                              <div className="min-w-0">
                                <span className={`text-[12px] font-medium truncate ${isReported ? "text-red-700" : "text-slate-700"}`}>
                                  {p.user.name ?? p.user.email}
                                </span>
                                {isReported && (
                                  <span className="ml-1.5 text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded font-semibold">
                                    {p.user.reportsReceived.length} şikayet
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Last message */}
                    <td className="px-5 py-3.5 max-w-[240px]">
                      {lastMsg ? (
                        <div>
                          <span className="text-[11px] font-semibold text-slate-500">{lastMsg.sender.name ?? "—"}: </span>
                          <span className="text-[12px] text-slate-500 truncate block">{lastMsg.content}</span>
                        </div>
                      ) : (
                        <span className="italic text-slate-300 text-[12px]">Mesaj yok</span>
                      )}
                    </td>

                    {/* Count */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-semibold">
                        <MessageSquare className="h-3 w-3" />
                        {c._count.messages}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5 text-slate-400 text-[12px] whitespace-nowrap">
                      {lastMsg ? (
                        <>
                          {format(lastMsg.createdAt, "dd.MM.yyyy")}
                          <p className="text-slate-300 text-[10px]">{format(lastMsg.createdAt, "HH:mm")}</p>
                        </>
                      ) : "—"}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5">
                      <a
                        href={`/admin/messages/${c.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all"
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
