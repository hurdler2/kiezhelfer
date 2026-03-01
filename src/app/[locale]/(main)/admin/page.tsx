import { prisma } from "@/lib/prisma";
import { Users, List, Star, MessageCircle, ShieldAlert, Ban } from "lucide-react";
import DailyChart from "./DailyChart";
import CategoryChart from "./CategoryChart";

export default async function AdminDashboard() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [
    userCount, activeListingCount, reviewCount, messageCount,
    pendingReviews, bannedUsers, recentUsers, recentListings,
    dailyUsersRaw, dailyListingsRaw, categoryStats,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count({ where: { status: "ACTIVE" } }),
    prisma.review.count(),
    prisma.message.count(),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { profile: { banned: true } } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, createdAt: true, role: true } }),
    prisma.listing.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { category: true, user: { select: { name: true } } } }),
    prisma.user.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
    prisma.listing.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
    prisma.category.findMany({ include: { _count: { select: { listings: { where: { status: "ACTIVE" } } } } }, orderBy: { sortOrder: "asc" } }),
  ]);

  const dayKeys = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const dailyData = dayKeys.map((key) => {
    const label = new Date(key + "T12:00:00").toLocaleDateString("tr-TR", { weekday: "short", day: "numeric" });
    return {
      day: label,
      users: dailyUsersRaw.filter((u) => u.createdAt.toISOString().split("T")[0] === key).length,
      listings: dailyListingsRaw.filter((l) => l.createdAt.toISOString().split("T")[0] === key).length,
    };
  });

  const categoryData = categoryStats
    .filter((c) => c._count.listings > 0)
    .sort((a, b) => b._count.listings - a._count.listings)
    .slice(0, 8)
    .map((c) => ({ name: c.slug, count: c._count.listings }));

  const stats = [
    { label: "Toplam Kullanıcı",  value: userCount,          icon: Users,         color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100" },
    { label: "Aktif İlanlar",     value: activeListingCount, icon: List,          color: "text-brand-600",  bg: "bg-brand-50",  border: "border-brand-100" },
    { label: "Toplam Yorum",      value: reviewCount,        icon: Star,          color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100" },
    { label: "Toplam Mesaj",      value: messageCount,       icon: MessageCircle, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
    { label: "Bekleyen Yorum",    value: pendingReviews,     icon: ShieldAlert,   color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
    { label: "Banlı Kullanıcı",  value: bannedUsers,        icon: Ban,           color: "text-red-600",    bg: "bg-red-50",    border: "border-red-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">KiezHelfer yönetim paneline hoş geldin.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white rounded-xl border ${s.border} p-5 flex items-center gap-4`}>
            <div className={`h-12 w-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={`h-6 w-6 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Son 7 Gün — Yeni Kayıtlar</h2>
          <DailyChart data={dailyData} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Kategori Dağılımı (Aktif İlanlar)</h2>
          <CategoryChart data={categoryData} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">Son Kullanıcılar</h2>
            <a href="users" className="text-xs text-brand-600 hover:underline">Tümü →</a>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">Ad</th>
                <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">E-posta</th>
                <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{u.name ?? "-"}</td>
                  <td className="px-5 py-3 text-gray-500 truncate max-w-[160px]">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${u.role === "ADMIN" ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-600"}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">Son İlanlar</h2>
            <a href="listings" className="text-xs text-brand-600 hover:underline">Tümü →</a>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">İlan</th>
                <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">Kategori</th>
                <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">Kullanıcı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentListings.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900 truncate max-w-[180px]">{l.title}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{l.category.slug}</td>
                  <td className="px-5 py-3 text-gray-500">{l.user.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
