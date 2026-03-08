import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import ContactButton from "@/components/listings/ContactButton";
import ListingImageUpload from "@/components/listings/ListingImageUpload";
import ListingOwnerActions from "@/components/listings/ListingOwnerActions";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReportListingButton from "@/components/reports/ReportListingButton";
import { formatPrice, formatRelativeTime } from "@/lib/utils";
import { MapPin, Calendar, Eye, Tag } from "lucide-react";

interface Props {
  params: { id: string; locale: string };
}

export default async function ListingDetailPage({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations("listings");
  const tCategories = await getTranslations("categories");
  const session = await auth();

  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          createdAt: true,
          profile: {
            select: {
              avatarUrl: true,
              bio: true,
              district: true,
              averageRating: true,
              reviewCount: true,
              skillTags: true,
            },
          },
        },
      },
      category: true,
      reviews: {
        where: { status: "APPROVED" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              profile: { select: { avatarUrl: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!listing || listing.status === "DELETED") {
    notFound();
  }

  // PENDING veya PAUSED ilan sadece sahibi ve admin görebilir
  const isOwnerOrAdmin =
    session?.user?.id === listing.userId ||
    (session?.user as any)?.role === "ADMIN";

  if (
    (listing.status === "PENDING" || listing.status === "PAUSED") &&
    !isOwnerOrAdmin
  ) {
    notFound();
  }

  const isOwner = session?.user?.id === listing.userId;

  // Giriş yapmış kullanıcı bu ilanı daha önce değerlendirdi mi?
  const alreadyReviewed = session?.user?.id
    ? listing.reviews.some((r) => r.author.id === session.user!.id)
    : false;

  // Kategori adını çeviri dosyasından al
  const nameKey = listing.category.nameKey?.replace("categories.", "") ?? listing.category.slug;
  let categoryDisplayName: string;
  try {
    categoryDisplayName = tCategories(nameKey as Parameters<typeof tCategories>[0]);
  } catch {
    categoryDisplayName = listing.category.slug;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* PENDING banner */}
      {listing.status === "PENDING" && (
        <div className="mb-6 px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl text-sm text-purple-800">
          <strong>{t("pendingTitle")}</strong> {t("pendingBanner")}
        </div>
      )}

      {/* PAUSED banner */}
      {listing.status === "PAUSED" && (
        <div className="mb-6 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
          <strong>{t("paused")}:</strong> {t("pausedBanner")}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div>
            <div className="rounded-xl overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100 h-64 flex items-center justify-center">
              {listing.imageUrls.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={listing.imageUrls[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl opacity-40">
                  {listing.category.iconName === "Wrench" ? "🔧" :
                   listing.category.iconName === "Sparkles" ? "✨" :
                   listing.category.iconName === "Monitor" ? "💻" :
                   listing.category.iconName === "BookOpen" ? "📚" : "🤝"}
                </span>
              )}
            </div>
            {/* Thumbnail row (> 1 image) */}
            {listing.imageUrls.length > 1 && (
              <div className="flex gap-2 mt-2">
                {listing.imageUrls.slice(1).map((url) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={url}
                    src={url}
                    alt={listing.title}
                    className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                  />
                ))}
              </div>
            )}
            {/* Upload section – only for owner */}
            {isOwner && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-xs font-medium text-gray-600 mb-1">Fotos verwalten</p>
                <ListingImageUpload
                  listingId={listing.id}
                  currentImages={listing.imageUrls}
                />
              </div>
            )}
          </div>

          {/* Title & info */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
              {isOwner && (
                <Link
                  href={`/listings/${listing.id}/edit` as any}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
                >
                  {t("editListing")}
                </Link>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Badge variant="info">{categoryDisplayName}</Badge>
              {listing.district && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{listing.district}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatRelativeTime(listing.createdAt, params.locale)}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Eye className="h-3.5 w-3.5" />
                <span>{listing.viewCount}</span>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-2xl font-bold text-teal-700">
                {formatPrice(listing.priceType, listing.priceAmount, params.locale)}
              </span>
            </div>

            {/* Owner actions: pause/delete (not shown for PENDING) */}
            {isOwner && listing.status !== "PENDING" && (
              <div className="mt-4">
                <ListingOwnerActions
                  listingId={listing.id}
                  initialStatus={listing.status as "ACTIVE" | "PAUSED"}
                  locale={params.locale}
                  activeLabel={t("active")}
                  pausedLabel={t("paused")}
                  deleteLabel={t("deleteListing")}
                  deleteConfirm={t("deleteConfirm")}
                  pauseLabel={t("pauseListing")}
                  unpauseLabel={t("unpauseListing")}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t("description")}</h2>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{listing.description}</p>
          </div>

          {/* Tags */}
          {listing.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-gray-400" />
                {listing.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {t("reviews")} ({listing.reviewCount})
              </h2>
              {listing.averageRating > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={listing.averageRating} size="sm" />
                  <span className="text-sm font-medium text-gray-700">
                    {listing.averageRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {listing.reviews.length === 0 ? (
              <p className="text-sm text-gray-400 mb-4">{t("noResults")}</p>
            ) : (
              <div className="space-y-3 mb-6">
                {listing.reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar
                        src={review.author.profile?.avatarUrl}
                        name={review.author.name}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{review.author.name}</p>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Review form – only for logged-in non-owners */}
            {session?.user && !isOwner && (
              <ReviewForm
                listingId={listing.id}
                alreadyReviewed={alreadyReviewed}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Provider card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <Link href={`/profile/${listing.user.id}` as any}>
                <Avatar
                  src={listing.user.profile?.avatarUrl}
                  name={listing.user.name}
                  size="lg"
                />
              </Link>
              <div>
                <Link
                  href={`/profile/${listing.user.id}` as any}
                  className="font-semibold text-gray-900 hover:text-teal-600"
                >
                  {listing.user.name}
                </Link>
                {listing.user.profile?.district && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {listing.user.profile.district}
                  </p>
                )}
                {(listing.user.profile?.averageRating ?? 0) > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <StarRating rating={listing.user.profile!.averageRating} size="sm" />
                    <span className="text-xs text-gray-500">
                      ({listing.user.profile!.reviewCount})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {listing.user.profile?.bio && (
              <p className="text-sm text-gray-500 mb-4 line-clamp-3">{listing.user.profile.bio}</p>
            )}

            {!isOwner && (
              <ContactButton
                recipientId={listing.userId}
                listingId={listing.id}
                listingTitle={listing.title}
              />
            )}
          </div>

          {/* Price card */}
          <div className="bg-teal-50 rounded-xl p-4">
            <p className="text-sm text-teal-700 font-medium mb-1">{t("price")}</p>
            <p className="text-xl font-bold text-teal-800">
              {formatPrice(listing.priceType, listing.priceAmount, params.locale)}
            </p>
          </div>

          {/* Report listing */}
          {session?.user && !isOwner && (
            <div className="pt-1">
              <ReportListingButton
                listingId={listing.id}
                listingTitle={listing.title}
                ownerId={listing.userId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
