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

  const statusLabel: Record<string, string> = {
    PENDING: "Bekliyor",
    APPROVED: "Onaylı",
    REJECTED: "Reddedildi",
  };
  const statusColor: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Yorumlar</h1>
        <p className="text-sm text-gray-500 mt-1">Toplam {reviews.length} yorum</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Yazar</th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Hedef</th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">İlan</th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Puan</th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Yorum</th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Durum</th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <p className="font-medium text-gray-900">{r.author.name ?? "-"}</p>
                  <p className="text-xs text-gray-400">{r.author.email}</p>
                </td>
                <td className="px-5 py-3">
                  <p className="text-gray-700 text-xs">{r.target.name ?? "-"}</p>
                  <p className="text-gray-400 text-xs">{r.target.email}</p>
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs max-w-[140px] truncate">
                  {r.listing?.title ?? <span className="italic text-gray-300">—</span>}
                </td>
                <td className="px-5 py-3 text-amber-500 text-xs tracking-tighter">
                  {stars(r.rating)}
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs max-w-[200px] truncate">
                  {r.comment ?? <span className="italic text-gray-300">—</span>}
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor[r.status]}`}>
                    {statusLabel[r.status]}
                  </span>
                </td>
                <td className="px-5 py-3">
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
