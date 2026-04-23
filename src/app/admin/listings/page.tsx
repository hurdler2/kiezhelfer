import { prisma } from "@/lib/prisma";
import AdminListingActions from "./AdminListingActions";
import AdminListingsFilter from "./AdminListingsFilter";
import { Suspense } from "react";
import Link from "next/link";

export default async function AdminListingsPage({ searchParams }: { searchParams: { q?: string; status?: string } }) {
  const q = searchParams.q?.trim() ?? "";
  const status = searchParams.status ?? "";

  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      ...(status ? { status: status as any } : {}),
      ...(q ? { OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { user: { name: { contains: q, mode: "insensitive" } } },
        { user: { email: { contains: q, mode: "insensitive" } } },
      ]} : {}),
    },
    include: { category: true, user: { select: { name: true, email: true } }, _count: { select: { reviews: true } } },
  });

  const pendingCount = await prisma.listing.count({ where: { status: "PENDING" } });

  const statusLabel: Record<string, string> = { PENDING: "Onay Bekliyor", ACTIVE: "Aktif", PAUSED: "Duraklatıldı", DELETED: "Silindi" };
  const statusColor: Record<string, string> = { PENDING: "bg-purple-100 text-purple-700", ACTIVE: "bg-green-100 text-green-700", PAUSED: "bg-amber-100 text-amber-700", DELETED: "bg-red-100 text-red-700" };
  const categoryLabel: Record<string, string> = {
    "reparaturen-montage": "Kleine Reparaturen & Montageservice",
    "technik-computer": "Technik & Computerhilfe",
    "alltag-nachbarschaft": "Alltags & Nachbarschaftshilfe",
    "garten-outdoor": "Garten & Outdoor-Hilfe",
    "transport-kurier": "Umzugshilfe",
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">İlanlar</h1>
          <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
            {listings.length} ilan listeleniyor
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-100 text-amber-700 text-[11px] font-bold rounded-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                {pendingCount} onay bekliyor
              </span>
            )}
          </p>
        </div>
        <Suspense><AdminListingsFilter /></Suspense>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {listings.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-sm">Sonuç bulunamadı</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">İlan</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Kategori</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Kullanıcı</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Yorum</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Durum</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listings.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/listings/${l.id}`} className="hover:underline">
                      <p className="font-medium text-slate-800 max-w-[220px] truncate">{l.title}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[220px] mt-0.5">{l.description}</p>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                      {categoryLabel[l.category.slug] ?? l.category.slug}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] text-slate-700 font-medium">{l.user.name}</p>
                    <p className="text-[11px] text-slate-400">{l.user.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-slate-600">{l._count.reviews}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${statusColor[l.status]}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                      {statusLabel[l.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <AdminListingActions listingId={l.id} currentStatus={l.status} />
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
