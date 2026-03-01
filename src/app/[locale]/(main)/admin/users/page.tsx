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
      id: true, name: true, email: true, role: true, createdAt: true,
      _count: { select: { listings: true, reviewsGiven: true } },
      profile: { select: { district: true, banned: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kullanıcılar</h1>
        <p className="text-sm text-gray-500 mt-1">Toplam {users.length} kullanıcı</p>
      </div>

      <form method="GET" className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="İsim veya e-posta ile ara..."
          className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          Ara
        </button>
        {q && (
          <a
            href="?"
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Temizle
          </a>
        )}
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Kullanıcı</th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">İlan</th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Yorum</th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Rol</th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Durum</th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className={`hover:bg-gray-50 ${u.profile?.banned ? "bg-red-50/40" : ""}`}>
                <td className="px-5 py-3">
                  <a href={`/admin/users/${u.id}`} className="group">
                    <p className="font-medium text-gray-900 group-hover:text-brand-600 group-hover:underline">{u.name ?? "-"}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </a>
                </td>
                <td className="px-5 py-3 text-gray-600">{u._count.listings}</td>
                <td className="px-5 py-3 text-gray-600">{u._count.reviewsGiven}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    u.role === "ADMIN" ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {u.profile?.banned
                    ? <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">Banlı</span>
                    : <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">Aktif</span>
                  }
                </td>
                <td className="px-5 py-3">
                  <AdminUserActions
                    userId={u.id}
                    currentRole={u.role}
                    isBanned={!!u.profile?.banned}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
