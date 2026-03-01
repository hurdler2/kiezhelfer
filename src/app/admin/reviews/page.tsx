import { prisma } from "@/lib/prisma";
import AdminReviewActions from "./AdminReviewActions";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, email: true } },
      target: { select: { name: true, email: true } },
      listing: { select: { title: true } },
    },
  });

  const statusLabel: Record<string, string> = { PENDING: "Bekliyor", APPROVED: "Onaylı", REJECTED: "Reddedildi" };
  const statusColor: Record<string, string> = { PENDING: "bg-amber-100 text-amber-700", APPROVED: "bg-green-100 text-green-700", REJECTED: "bg-red-100 text-red-700" };
  const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

  const pendingCount = reviews.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Yorumlar</h1>
          <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
            Toplam {reviews.length} yorum
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-100 text-amber-700 text-[11px] font-bold rounded-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                {pendingCount} bekliyor
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Yazar</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Hedef</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">İlan</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Puan</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Yorum</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Durum</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviews.map((r) => (
              <tr key={r.id} className={`transition-colors ${
                r.status === "PENDING" ? "bg-amber-50/30 hover:bg-amber-50/50" : "hover:bg-slate-50"
              }`}>
                {/* Author */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                      {r.author.name ? r.author.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 text-[13px] truncate">{r.author.name ?? "-"}</p>
                      <p className="text-slate-400 text-[11px] truncate">{r.author.email}</p>
                    </div>
                  </div>
                </td>

                {/* Target */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-[10px] font-bold text-brand-700 shrink-0">
                      {r.target.name ? r.target.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-700 text-[13px] font-medium truncate">{r.target.name ?? "-"}</p>
                      <p className="text-slate-400 text-[11px] truncate">{r.target.email}</p>
                    </div>
                  </div>
                </td>

                {/* Listing */}
                <td className="px-5 py-3.5 max-w-[140px]">
                  {r.listing?.title
                    ? <span className="text-slate-600 text-[12px] truncate block">{r.listing.title}</span>
                    : <span className="text-slate-300 italic text-[12px]">—</span>
                  }
                </td>

                {/* Rating */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-[11px] font-semibold text-slate-500">{r.rating}</span>
                  </div>
                </td>

                {/* Comment */}
                <td className="px-5 py-3.5 max-w-[200px]">
                  {r.comment
                    ? <span className="text-slate-500 text-[12px] truncate block" title={r.comment}>{r.comment}</span>
                    : <span className="text-slate-300 italic text-[12px]">—</span>
                  }
                </td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${statusColor[r.status]}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                    {statusLabel[r.status]}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5">
                  <AdminReviewActions reviewId={r.id} currentStatus={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
