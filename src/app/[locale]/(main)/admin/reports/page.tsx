import { prisma } from "@/lib/prisma";
import AdminReportActions from "./AdminReportActions";
import { format } from "date-fns";

const REASON_LABEL: Record<string, string> = {
  spam: "Spam / Reklam",
  fake: "Sahte Profil",
  harassment: "Taciz / Hakaret",
  scam: "Dolandırıcılık",
  inappropriate: "Uygunsuz İçerik",
  other: "Diğer",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Bekliyor",
  REVIEWED: "İncelendi",
  DISMISSED: "Reddedildi",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  REVIEWED: "bg-blue-100 text-blue-700",
  DISMISSED: "bg-gray-100 text-gray-500",
};

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      reporter: {
        select: { id: true, name: true, email: true },
      },
      reported: {
        select: {
          id: true,
          name: true,
          email: true,
          profile: { select: { banned: true } },
        },
      },
    },
  });

  const pending = reports.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Şikayetler</h1>
          <p className="text-sm text-gray-500 mt-1">
            Toplam {reports.length} şikayet
            {pending > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                {pending} bekliyor
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {reports.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">Henüz şikayet yok</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Şikayet Eden</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Şikayet Edilen</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Neden</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Açıklama</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Tarih</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Durum</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((r) => (
                <tr
                  key={r.id}
                  className={`hover:bg-gray-50 ${r.status === "PENDING" ? "bg-amber-50/30" : ""}`}
                >
                  {/* Reporter */}
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900 text-xs">{r.reporter.name ?? "—"}</p>
                    <p className="text-gray-400 text-xs">{r.reporter.email}</p>
                  </td>

                  {/* Reported */}
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900 text-xs">{r.reported.name ?? "—"}</p>
                    <p className="text-gray-400 text-xs">{r.reported.email}</p>
                    {r.reported.profile?.banned && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-medium">
                        Banlı
                      </span>
                    )}
                  </td>

                  {/* Reason */}
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                      {REASON_LABEL[r.reason] ?? r.reason}
                    </span>
                  </td>

                  {/* Details */}
                  <td className="px-5 py-3 text-gray-500 text-xs max-w-[200px]">
                    {r.details ? (
                      <span className="truncate block max-w-[200px]" title={r.details}>
                        {r.details}
                      </span>
                    ) : (
                      <span className="italic text-gray-300">—</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {format(r.createdAt, "dd.MM.yyyy HH:mm")}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLOR[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3">
                    <AdminReportActions reportId={r.id} currentStatus={r.status} isBanned={!!r.reported.profile?.banned} reason={r.reason} details={r.details ?? null} reportedName={r.reported.name ?? null} />
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
