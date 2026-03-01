import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ArrowLeft, Mail, MapPin, Calendar, Star, List, ShieldAlert } from "lucide-react";
import AdminUserActions from "../AdminUserActions";

const REASON_LABEL: Record<string, string> = {
  spam: "Spam / Reklam", fake: "Sahte Profil", harassment: "Taciz / Hakaret",
  scam: "Dolandırıcılık", inappropriate: "Uygunsuz İçerik", other: "Diğer",
};
const STATUS_LABEL: Record<string, string> = { PENDING: "Bekliyor", REVIEWED: "İncelendi", DISMISSED: "Reddedildi" };
const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  REVIEWED: "bg-blue-100 text-blue-700",
  DISMISSED: "bg-gray-100 text-gray-500",
};
const LISTING_STATUS_LABEL: Record<string, string> = { PENDING: "Onay Bekliyor", ACTIVE: "Aktif", PAUSED: "Duraklatıldı", DELETED: "Silindi" };
const LISTING_STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-purple-100 text-purple-700",
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-amber-100 text-amber-700",
  DELETED: "bg-red-100 text-red-700",
};

export default async function AdminUserDetailPage({ params }: { params: { id: string; locale: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      profile: true,
      listings: {
        orderBy: { createdAt: "desc" },
        include: { category: true },
      },
      reportsReceived: {
        orderBy: { createdAt: "desc" },
        include: { reporter: { select: { name: true, email: true } } },
      },
      reviewsReceived: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { author: { select: { name: true } } },
      },
    },
  });

  if (!user) notFound();

  const pendingReports = user.reportsReceived.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-center gap-3">
        <a href="/admin/users" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </a>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name ?? "İsimsiz Kullanıcı"}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kullanıcı Detayı</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sol: Profil Kartı */}
        <div className="space-y-4">
          {/* Profil */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            {/* Avatar + isim */}
            <div className="flex items-center gap-3">
              {user.profile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profile.avatarUrl} alt={user.name ?? ""} className="h-14 w-14 rounded-full object-cover" />
              ) : (
                <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                  {user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{user.name ?? "-"}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${user.role === "ADMIN" ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-600"}`}>
                    {user.role}
                  </span>
                  {user.profile?.banned ? (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">Banlı</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">Aktif</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bilgiler */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.profile?.district && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{user.profile.district}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                <span>Kayıt: {format(user.createdAt, "dd.MM.yyyy")}</span>
              </div>
              {(user.profile?.averageRating ?? 0) > 0 && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{user.profile!.averageRating.toFixed(1)} / 5 ({user.profile!.reviewCount} yorum)</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {user.profile?.bio && (
              <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                {user.profile.bio}
              </p>
            )}

            {/* Aksiyonlar */}
            <div className="border-t border-gray-100 pt-3">
              <AdminUserActions userId={user.id} currentRole={user.role} isBanned={!!user.profile?.banned} />
            </div>
          </div>

          {/* Özet sayılar */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "İlan", value: user.listings.length, icon: List, color: "text-brand-600", bg: "bg-brand-50" },
              { label: "Yorum", value: user.reviewsReceived.length, icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Şikayet", value: user.reportsReceived.length, icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                <s.icon className={`h-5 w-5 ${s.color} mx-auto mb-1`} />
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-[10px] text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ: İlanlar + Şikayetler + Yorumlar */}
        <div className="lg:col-span-2 space-y-6">
          {/* İlanlar */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">İlanlar ({user.listings.length})</h2>
            </div>
            {user.listings.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Henüz ilan yok</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">Başlık</th>
                    <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">Kategori</th>
                    <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">Durum</th>
                    <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">Tarih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {user.listings.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900 truncate max-w-[180px]">{l.title}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{l.category.slug}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${LISTING_STATUS_COLOR[l.status]}`}>
                          {LISTING_STATUS_LABEL[l.status]}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {format(l.createdAt, "dd.MM.yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Şikayetler */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <h2 className="font-semibold text-gray-900 text-sm">Şikayetler ({user.reportsReceived.length})</h2>
              {pendingReports > 0 && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">{pendingReports} bekliyor</span>
              )}
            </div>
            {user.reportsReceived.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Şikayet yok</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">Şikayet Eden</th>
                    <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">Neden</th>
                    <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">Açıklama</th>
                    <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">Durum</th>
                    <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">Tarih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {user.reportsReceived.map((r) => (
                    <tr key={r.id} className={`hover:bg-gray-50 ${r.status === "PENDING" ? "bg-amber-50/30" : ""}`}>
                      <td className="px-5 py-3">
                        <p className="text-xs font-medium text-gray-700">{r.reporter.name ?? "—"}</p>
                        <p className="text-xs text-gray-400">{r.reporter.email}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                          {REASON_LABEL[r.reason] ?? r.reason}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs max-w-[160px]">
                        {r.details ? (
                          <span className="truncate block max-w-[160px]" title={r.details}>{r.details}</span>
                        ) : (
                          <span className="italic text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLOR[r.status]}`}>
                          {STATUS_LABEL[r.status]}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {format(r.createdAt, "dd.MM.yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Son Yorumlar */}
          {user.reviewsReceived.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 text-sm">Son Yorumlar</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {user.reviewsReceived.map((r) => (
                  <div key={r.id} className="px-5 py-3 flex items-start gap-3">
                    <div className="flex shrink-0 mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-xs ${star <= r.rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">{r.author.name ?? "—"} · {format(r.createdAt, "dd.MM.yyyy")}</p>
                      {r.comment && <p className="text-sm text-gray-700 mt-0.5 line-clamp-2">{r.comment}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
