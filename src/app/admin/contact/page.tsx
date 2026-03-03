import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import AdminContactActions from "./AdminContactActions";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const messages = await (prisma as any).contactMessage.findMany({
    orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
  });

  const unread = messages.filter((m: any) => !m.isRead).length;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Kontakt Mesajları</h1>
          <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
            Toplam {messages.length} mesaj
            {unread > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-100 text-amber-700 text-[11px] font-bold rounded-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                {unread} okunmadı
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {messages.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">Henüz mesaj yok</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Gönderen</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Mesaj</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tarih</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Durum</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {messages.map((m: any) => (
                <tr
                  key={m.id}
                  className={`transition-colors ${
                    !m.isRead ? "bg-amber-50/40 hover:bg-amber-50/70" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-800 text-[13px]">{m.name}</p>
                    <a href={`mailto:${m.email}`} className="text-teal-600 text-[11px] hover:underline">{m.email}</a>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 text-[12px] max-w-xs">
                    <p className="line-clamp-3 whitespace-pre-wrap">{m.message}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-[12px] whitespace-nowrap">
                    {format(new Date(m.createdAt), "dd.MM.yyyy")}
                    <p className="text-slate-300 text-[10px]">{format(new Date(m.createdAt), "HH:mm")}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    {m.isRead ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                        Okundu
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                        Okunmadı
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <AdminContactActions messageId={m.id} isRead={m.isRead} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
