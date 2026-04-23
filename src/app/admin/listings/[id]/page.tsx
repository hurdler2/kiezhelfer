import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminListingActions from "../AdminListingActions";

export default async function AdminListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          profile: { select: { avatarUrl: true, bio: true, phone: true, district: true } },
        },
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!listing) notFound();

  const statusLabel: Record<string, string> = { PENDING: "Onay Bekliyor", ACTIVE: "Aktif", PAUSED: "Duraklatıldı", DELETED: "Silindi" };
  const statusColor: Record<string, string> = { PENDING: "bg-amber-100 text-amber-700", ACTIVE: "bg-green-100 text-green-700", PAUSED: "bg-slate-100 text-slate-700", DELETED: "bg-red-100 text-red-700" };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Geri */}
      <Link href="/admin/listings" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        İlanlara Dön
      </Link>

      {/* Başlık + Durum + İşlemler */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{listing.title}</h1>
            <p className="text-xs text-slate-400 mt-1">ID: {listing.id}</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${statusColor[listing.status]}`}>
            {statusLabel[listing.status]}
          </span>
        </div>

        <AdminListingActions listingId={listing.id} currentStatus={listing.status} />
      </div>

      {/* İlan Detayları */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">İlan Bilgileri</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Kategori</p>
            <p className="font-medium text-slate-800">{listing.category.slug}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Fiyat</p>
            <p className="font-medium text-slate-800">
              {listing.priceAmount != null ? `${listing.priceAmount} €` : "—"}
              {listing.priceType === "hourly" ? " / Std." : listing.priceType === "negotiable" ? " (Verhandelbar)" : ""}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Bezirk</p>
            <p className="font-medium text-slate-800">{listing.district ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Yorum Sayısı</p>
            <p className="font-medium text-slate-800">{listing._count.reviews}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Oluşturulma</p>
            <p className="font-medium text-slate-800">{new Date(listing.createdAt).toLocaleDateString("de-DE")}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Etiketler</p>
            <p className="font-medium text-slate-800">{listing.tags?.length ? listing.tags.join(", ") : "—"}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">Açıklama</p>
          <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed border border-slate-100 rounded-xl p-4 bg-slate-50">{listing.description}</p>
        </div>

        {/* Görseller */}
        {listing.imageUrls && listing.imageUrls.length > 0 && (
          <div>
            <p className="text-xs text-slate-400 mb-2">Görseller</p>
            <div className="flex gap-3 flex-wrap">
              {listing.imageUrls.map((url, i) => (
                <div key={i} className="relative w-32 h-24 rounded-xl overflow-hidden border border-slate-200">
                  <Image src={url} alt={`Görsel ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Kullanıcı Bilgileri */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">İlan Sahibi</h2>
        <div className="flex items-center gap-4">
          {(listing.user.profile?.avatarUrl || listing.user.image) && (
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image src={listing.user.profile?.avatarUrl ?? listing.user.image!} alt={listing.user.name ?? ""} fill className="object-cover" />
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-800">{listing.user.name}</p>
            <p className="text-sm text-slate-400">{listing.user.email}</p>
            {listing.user.profile?.phone && <p className="text-sm text-slate-400">{listing.user.profile.phone}</p>}
            {listing.user.profile?.district && <p className="text-xs text-slate-400 mt-0.5">Bezirk: {listing.user.profile.district}</p>}
          </div>
        </div>
        {listing.user.profile?.bio && (
          <div>
            <p className="text-xs text-slate-400 mb-1">Hakkında</p>
            <p className="text-sm text-slate-700 italic">{listing.user.profile.bio}</p>
          </div>
        )}
        <Link href={`/admin/users/${listing.user.id}`} className="inline-block text-xs text-brand-600 hover:underline mt-1">
          Kullanıcı profiline git →
        </Link>
      </div>
    </div>
  );
}
