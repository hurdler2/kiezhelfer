import { prisma } from "@/lib/prisma";
import AdminReportActions from "./AdminReportActions";
import { format } from "date-fns";

const REASON_LABEL: Record<string, string> = {
  spam: "Spam / Reklam", fake: "Sahte Profil", harassment: "Taciz / Hakaret",
  scam: "Dolandırıcılık", inappropriate: "Uygunsuz İçerik", other: "Diğer",
};
const STATUS_LABEL: Record<string, string> = { PENDING: "Bekliyor", REVIEWED: "İncelendi", DISMISSED: "Reddedildi" };
const STATUS_COLOR: Record<string, string> = { PENDING: "bg-amber-100 text-amber-700", REVIEWED: "bg-blue-100 text-blue-700", DISMISSED: "bg-gray-100 text-gray-500" };

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      reporter: { select: { id: true, name: true, email: true } },
      reported: { select: { id: true, name: true, email: true, profile: { select: { banned: true } } } },
    },
  });

  const pending = reports.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Şikayetler</h1>
          <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
            Toplam {reports.length} şikayet
            {pending > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-100 text-amber-700 text-[11px] font-bold rounded-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                {pending} bekliyor
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {reports.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">Henüz şikayet yok</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Şikayet Eden</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Şikayet Edilen</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Neden</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Açıklama</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tarih</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Durum</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((r) => (
                <tr
                  key={r.id}
                  className={`transition-colors ${
                    r.status === "PENDING"
                      ? "bg-amber-50/40 hover:bg-amber-50/70"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {/* Reporter */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                        {r.reporter.name ? r.reporter.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 text-[13px] truncate">{r.reporter.name ?? "—"}</p>
                        <p className="text-slate-400 text-[11px] truncate">{r.reporter.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Reported */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        r.reported.profile?.banned
                          ? "bg-red-100 text-red-600"
                          : "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600"
                      }`}>
                        {r.reported.name ? r.reported.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium text-slate-800 text-[13px] truncate">{r.reported.name ?? "—"}</p>
                          {r.reported.profile?.banned && (
                            <span className="shrink-0 text-[9px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-bold uppercase tracking-wide">Banlı</span>
                          )}
                        </div>
                        <p className="text-slate-400 text-[11px] truncate">{r.reported.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Reason */}
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-lg whitespace-nowrap">
                      {REASON_LABEL[r.reason] ?? r.reason}
                    </span>
                  </td>

                  {/* Details */}
                  <td className="px-5 py-3.5 text-slate-500 text-[12px] max-w-[180px]">
                    {r.details
                      ? <span className="truncate block" title={r.details}>{r.details}</span>
                      : <span className="text-slate-300 italic">—</span>
                    }
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3.5 text-slate-400 text-[12px] whitespace-nowrap">
                    {format(r.createdAt, "dd.MM.yyyy")}
                    <p className="text-slate-300 text-[10px]">{format(r.createdAt, "HH:mm")}</p>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${STATUS_COLOR[r.status]}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                      {STATUS_LABEL[r.status]}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <AdminReportActions
                      reportId={r.id}
                      currentStatus={r.status}
                      isBanned={!!r.reported.profile?.banned}
                      reason={r.reason}
                      details={r.details ?? null}
                      reportedName={r.reported.name ?? null}
                    />
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
