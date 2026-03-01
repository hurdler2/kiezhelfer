import { prisma } from "@/lib/prisma";
import { Users, List, Star, MessageCircle, ShieldAlert, Ban, TrendingUp, ArrowUpRight } from "lucide-react";
import DailyChart from "./DailyChart";
import CategoryChart from "./CategoryChart";
import Link from "next/link";

export default async function AdminDashboard() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [
    userCount, activeListingCount, reviewCount, messageCount,
    pendingReviews, bannedUsers, recentUsers, recentListings,
    dailyUsersRaw, dailyListingsRaw, categoryStats, pendingListings,
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
    prisma.listing.count({ where: { status: "PENDING" } }),
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
    { label: "Toplam Kullanıcı",      value: userCount,          icon: Users,         href: "/admin/users",    gradient: "from-blue-500 to-blue-600",     bg: "bg-blue-50",     text: "text-blue-600",    border: "border-blue-100" },
    { label: "Aktif İlanlar",         value: activeListingCount, icon: List,          href: "/admin/listings", gradient: "from-brand-500 to-brand-600",   bg: "bg-brand-50",    text: "text-brand-600",   border: "border-brand-100" },
    { label: "Toplam Yorum",          value: reviewCount,        icon: Star,          href: "/admin/reviews",  gradient: "from-amber-500 to-amber-600",   bg: "bg-amber-50",    text: "text-amber-600",   border: "border-amber-100" },
    { label: "Toplam Mesaj",          value: messageCount,       icon: MessageCircle, href: "/admin/messages", gradient: "from-violet-500 to-violet-600", bg: "bg-violet-50",   text: "text-violet-600",  border: "border-violet-100" },
    { label: "Onay Bekleyen Yorum",   value: pendingReviews,     icon: ShieldAlert,   href: "/admin/reviews",  gradient: "from-orange-500 to-orange-600", bg: "bg-orange-50",   text: "text-orange-600",  border: "border-orange-100", alert: pendingReviews > 0 },
    { label: "Banlı Kullanıcı",       value: bannedUsers,        icon: Ban,           href: "/admin/users",    gradient: "from-red-500 to-red-600",       bg: "bg-red-50",      text: "text-red-600",     border: "border-red-100" },
  ];

  return (
    <div className="space-y-8 max-w-7xl">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">KiezHelfer platform özeti</p>
        </div>
        {pendingListings > 0 && (
          <Link
            href="/admin/listings?status=PENDING"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-sm font-medium hover:bg-amber-100 transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            {pendingListings} ilan onay bekliyor
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group relative bg-white rounded-2xl border ${s.border} p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">{s.label}</p>
                <p className={`text-3xl font-bold tabular-nums ${(s as any).alert ? "text-orange-600" : "text-slate-900"}`}>
                  {s.value.toLocaleString()}
                </p>
              </div>
              <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                <s.icon className={`h-5 w-5 ${s.text}`} />
              </div>
            </div>
            {(s as any).alert && (
              <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-orange-500 animate-pulse block" />
            )}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${s.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid xl:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Son 7 Gün</h2>
              <p className="text-xs text-slate-400 mt-0.5">Yeni kullanıcı & ilan kayıtları</p>
            </div>
            <TrendingUp className="h-4 w-4 text-slate-300" />
          </div>
          <DailyChart data={dailyData} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-slate-800">Kategori Dağılımı</h2>
            <p className="text-xs text-slate-400 mt-0.5">Aktif ilanlara göre</p>
          </div>
          <CategoryChart data={categoryData} />
        </div>
      </div>

      {/* Recent tables */}
      <div className="grid xl:grid-cols-2 gap-5">

        {/* Recent users */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Son Kayıt Olan Kullanıcılar</h2>
            <Link href="/admin/users" className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              Tümünü gör <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[11px] font-bold text-slate-600 shrink-0">
                  {u.name ? u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-slate-800 truncate">{u.name ?? "-"}</p>
                  <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${
                  u.role === "ADMIN" ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-500"
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent listings */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Son Eklenen İlanlar</h2>
            <Link href="/admin/listings" className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              Tümünü gör <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentListings.map((l) => (
              <div key={l.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                  <List className="h-3.5 w-3.5 text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-slate-800 truncate">{l.title}</p>
                  <p className="text-[11px] text-slate-400 truncate">{l.user.name} · {l.category.slug}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
