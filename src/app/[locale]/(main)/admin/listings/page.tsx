import { prisma } from "@/lib/prisma";
import AdminListingActions from "./AdminListingActions";
import AdminListingsFilter from "./AdminListingsFilter";
import { Suspense } from "react";

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string };
}) {
  const q = searchParams.q?.trim() ?? "";
  const status = searchParams.status ?? "";

  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      ...(status ? { status: status as any } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { user: { name: { contains: q, mode: "insensitive" } } },
              { user: { email: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      category: true,
      user: { select: { name: true, email: true } },
      _count: { select: { reviews: true } },
    },
  });

  const pendingCount = await prisma.listing.count({ where: { status: "PENDING" } });

  const statusLabel: Record<string, string> = { PENDING: "Onay Bekliyor", ACTIVE: "Aktif", PAUSED: "Duraklatıldı", DELETED: "Silindi" };
  const statusColor: Record<string, string> = {
    PENDING: "bg-purple-100 text-purple-700",
    ACTIVE: "bg-green-100 text-green-700",
    PAUSED: "bg-amber-100 text-amber-700",
    DELETED: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İlanlar</h1>
          <p className="text-sm text-gray-500 mt-1">
            {listings.length} ilan listeleniyor
            {pendingCount > 0 && <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">{pendingCount} onay bekliyor</span>}
          </p>
        </div>
        <Suspense>
          <AdminListingsFilter />
        </Suspense>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {listings.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">Sonuç bulunamadı</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">İlan</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Kategori</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Kullanıcı</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Yorum</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Durum</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900 max-w-[220px] truncate">{l.title}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[220px]">{l.description}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{l.category.slug}</td>
                  <td className="px-5 py-3">
                    <p className="text-gray-700 text-xs">{l.user.name}</p>
                    <p className="text-gray-400 text-xs">{l.user.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{l._count.reviews}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor[l.status]}`}>
                      {statusLabel[l.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
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
