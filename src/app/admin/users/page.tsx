import { prisma } from "@/lib/prisma";
import AdminUserActions from "./AdminUserActions";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim() ?? "";

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, role: true, createdAt: true, emailVerifiedAt: true,
      _count: { select: { listings: true, reviewsGiven: true } },
      profile: { select: { district: true, banned: true } },
    },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Kullanıcılar</h1>
          <p className="text-sm text-slate-500 mt-0.5">Toplam {users.length} kullanıcı</p>
        </div>
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="İsim veya e-posta ile ara..."
            className="w-full pl-4 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-medium bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors shadow-sm shadow-brand-500/20"
        >
          Ara
        </button>
        {q && (
          <a
            href="?"
            className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Temizle
          </a>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Kullanıcı</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">İlan</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Yorum</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Rol</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Email</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Durum</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className={`group transition-colors ${u.profile?.banned ? "bg-red-50/50 hover:bg-red-50" : "hover:bg-slate-50"}`}>
                <td className="px-5 py-3.5">
                  <a href={`/admin/users/${u.id}`} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[11px] font-bold text-slate-600 shrink-0">
                      {u.name ? u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 group-hover:text-brand-600 transition-colors truncate">{u.name ?? "-"}</p>
                      <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                    </div>
                  </a>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-slate-600 font-medium">{u._count.listings}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-slate-600 font-medium">{u._count.reviewsGiven}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${
                    u.role === "ADMIN" ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {u.emailVerifiedAt ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700">
                      ✓ Onaylı
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700">
                      Onaysız
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  {u.profile?.banned ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Banlı
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Aktif
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <AdminUserActions userId={u.id} currentRole={u.role} isBanned={!!u.profile?.banned} emailVerifiedAt={u.emailVerifiedAt} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
