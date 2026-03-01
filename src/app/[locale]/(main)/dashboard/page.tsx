import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import Avatar from "@/components/ui/Avatar";
import { formatPrice, formatRelativeTime } from "@/lib/utils";
import { Plus, Eye, MessageCircle, ExternalLink } from "lucide-react";
import ListingStatusToggle from "@/components/dashboard/ListingStatusToggle";

export default async function DashboardPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const session = await auth();

  if (!session?.user) {
    redirect(`/${params.locale}/login`);
  }

  const t = await getTranslations("dashboard");
  const tListings = await getTranslations("listings");

  const [user, conversations] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        listings: {
          where: { status: { not: "DELETED" } },
          include: { category: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.conversation.findMany({
      where: { participants: { some: { userId: session.user.id } } },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        participants: {
          where: { userId: { not: session.user.id } },
          include: {
            user: { select: { name: true, profile: { select: { avatarUrl: true } } } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  if (!user) redirect(`/${params.locale}/login`);

  const activeListings = user.listings.filter((l) => l.status === "ACTIVE");
  const totalViews = user.listings.reduce((sum, l) => sum + l.viewCount, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar src={user.profile?.avatarUrl ?? user.image} name={user.name} size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("hello", { name: user.name })}</h1>
          <p className="text-gray-500 text-sm">
            {user.profile?.district
              ? `${user.profile.district.replace(/-/g, " ")} · `
              : ""}
            {t("memberSince", { year: new Date(user.createdAt).getFullYear() })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: t("activeListings"), value: activeListings.length, icon: "📋" },
          { label: t("totalViews"), value: totalViews, icon: "👁️" },
          { label: t("rating"), value: user.profile?.averageRating?.toFixed(1) ?? "–", icon: "⭐" },
          { label: t("messages"), value: conversations.length, icon: "💬" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* My Listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t("myListings")}</h2>
            <Link
              href="/listings/new"
              className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              <Plus className="h-4 w-4" />
              {tListings("newListing")}
            </Link>
          </div>

          {user.listings.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <p className="text-gray-400 text-sm mb-3">{t("noListings")}</p>
              <Link
                href="/listings/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                {t("createFirst")}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {user.listings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">{listing.title}</p>
                      <Link
                        href={`/listings/${listing.id}` as any}
                        className="text-gray-300 hover:text-teal-500 transition-colors flex-shrink-0"
                        title="Angebot ansehen"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {listing.viewCount}
                      </span>
                      <span className="text-xs text-teal-700 font-medium">
                        {formatPrice(listing.priceType, listing.priceAmount, params.locale)}
                      </span>
                    </div>
                  </div>
                  <ListingStatusToggle
                    listingId={listing.id}
                    initialStatus={listing.status as "ACTIVE" | "PAUSED" | "DELETED"}
                    activeLabel={tListings("active")}
                    pausedLabel={tListings("paused")}
                    deleteLabel={tListings("deleteListing")}
                    deleteConfirm={tListings("deleteConfirm")}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent messages */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t("messages")}</h2>
            <Link href="/messages" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              {t("viewAll")}
            </Link>
          </div>

          {conversations.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">{t("noListings")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map((conv) => {
                const other = conv.participants[0];
                const lastMsg = conv.messages[0];
                return (
                  <Link
                    key={conv.id}
                    href={`/messages/${conv.id}` as any}
                    className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:border-teal-300 transition-colors"
                  >
                    <Avatar
                      src={other?.user.profile?.avatarUrl}
                      name={other?.user.name}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{other?.user.name ?? t("unknown")}</p>
                      {lastMsg && (
                        <p className="text-xs text-gray-400 truncate">{lastMsg.content}</p>
                      )}
                    </div>
                    {lastMsg && (
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatRelativeTime(lastMsg.createdAt, params.locale)}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
