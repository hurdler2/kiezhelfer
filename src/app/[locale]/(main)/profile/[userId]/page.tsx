import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Avatar from "@/components/ui/Avatar";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import ListingCard from "@/components/listings/ListingCard";
import ProfileReviewForm from "@/components/reviews/ProfileReviewForm";
import ReportUserButton from "@/components/reports/ReportUserButton";
import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";

interface Props {
  params: { userId: string; locale: string };
}

export default async function PublicProfilePage({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations("profile");
  const tListings = await getTranslations("listings");
  const tReviews = await getTranslations("reviews");

  const session = await auth();
  const currentUserId = session?.user?.id ?? null;

  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: {
      id: true,
      name: true,
      createdAt: true,
      profile: {
        select: {
          bio: true,
          avatarUrl: true,
          district: true,
          averageRating: true,
          reviewCount: true,
          skillTags: true,
        },
      },
      listings: {
        where: { status: "ACTIVE" },
        include: {
          category: true,
          user: {
            select: {
              id: true,
              name: true,
              profile: {
                select: { avatarUrl: true, district: true, averageRating: true, reviewCount: true },
              },
            },
          },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      },
    },
  });

  if (!user) notFound();

  // Bu kullanıcıya ait yorumları çek
  const reviews = await prisma.review.findMany({
    where: { targetId: params.userId, status: "APPROVED" },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      author: {
        select: { id: true, name: true, profile: { select: { avatarUrl: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  // Mevcut kullanıcı bu profili zaten değerlendirdi mi?
  const alreadyReviewed = currentUserId
    ? !!(await prisma.review.findFirst({
        where: { targetId: params.userId, authorId: currentUserId, listingId: null },
      }))
    : false;

  // Kendi profilini mi görüntülüyor?
  const isOwnProfile = currentUserId === params.userId;

  const joinDate = format(user.createdAt, "MMMM yyyy", {
    locale: params.locale === "de" ? de : enUS,
  });

  const reviewTranslations = {
    title: tReviews("writeProfileReview"),
    ratingLabel: tReviews("rating"),
    commentLabel: tReviews("comment"),
    commentPlaceholder: tReviews("commentPlaceholder"),
    submit: tReviews("submit"),
    submitting: tReviews("submitting"),
    alreadyReviewed: tReviews("profileReviewAlreadyDone"),
    success: tReviews("profileReviewSuccess"),
    loginRequired: tReviews("loginToReview"),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <Avatar src={user.profile?.avatarUrl} name={user.name} size="xl" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              {user.profile?.district && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {user.profile.district.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{t("memberSince")} {joinDate}</span>
              </div>
            </div>

            {(user.profile?.averageRating ?? 0) > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={user.profile!.averageRating} />
                <span className="text-sm text-gray-600 font-medium">
                  {user.profile!.averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">
                  ({user.profile!.reviewCount} {t("reviews")})
                </span>
              </div>
            )}

            {user.profile?.bio && (
              <p className="text-gray-600 mt-3 text-sm">{user.profile.bio}</p>
            )}

            {!isOwnProfile && currentUserId && (
            <div className="mt-3">
              <ReportUserButton reportedId={params.userId} reportedName={user.name ?? "Kullanıcı"} />
            </div>
          )}

          {(user.profile?.skillTags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {user.profile!.skillTags.map((tag) => (
                  <Badge key={tag} variant="info">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Listings + Reviews */}
        <div className="lg:col-span-2 space-y-10">
          {/* Listings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {tListings("title")} ({user.listings.length})
            </h2>
            {user.listings.length === 0 ? (
              <p className="text-gray-400 text-sm">{tListings("noResults")}</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {user.listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing as any}
                    locale={params.locale}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                {tReviews("userReviews")} ({reviews.length})
              </h2>
              {(user.profile?.averageRating ?? 0) > 0 && (
                <div className="flex items-center gap-1.5">
                  <StarRating rating={user.profile!.averageRating} size="sm" />
                  <span className="text-sm font-semibold text-gray-700">
                    {user.profile!.averageRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-8 text-center">
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-gray-400 text-sm">{tReviews("noReviews")}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-4">
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
                      <span className="ml-auto text-xs text-gray-400">
                        {format(review.createdAt, "dd.MM.yyyy")}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Review Form */}
        {!isOwnProfile && (
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ProfileReviewForm
                targetUserId={params.userId}
                alreadyReviewed={alreadyReviewed}
                translations={reviewTranslations}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
