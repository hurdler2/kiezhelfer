import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import ListingCard from "@/components/listings/ListingCard";
import ListingsFilter from "@/components/listings/ListingsFilter";
import { Link } from "@/i18n/navigation";
import { Plus } from "lucide-react";

interface Props {
  params: { locale: string };
  searchParams: { category?: string; district?: string; q?: string; page?: string };
}

export default async function ListingsPage({ params, searchParams }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations("listings");
  const page = parseInt(searchParams.page ?? "1");
  const limit = 48;

  const [listings, total, categories] = await Promise.all([
    prisma.listing.findMany({
      where: {
        status: "ACTIVE",
        ...(searchParams.category && { category: { slug: searchParams.category } }),
        ...(searchParams.district && { district: searchParams.district }),
        ...(searchParams.q && {
          OR: [
            { title: { contains: searchParams.q, mode: "insensitive" } },
            { description: { contains: searchParams.q, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: {
              select: { avatarUrl: true, district: true, averageRating: true, reviewCount: true },
            },
          },
        },
        category: true,
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.listing.count({
      where: {
        status: "ACTIVE",
        ...(searchParams.category && { category: { slug: searchParams.category } }),
        ...(searchParams.district && { district: searchParams.district }),
      },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("resultsFound", { count: total })}</p>
        </div>
        <Link
          href="/listings/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t("newListing")}
        </Link>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <ListingsFilter
            categories={categories}
            locale={params.locale}
            currentCategory={searchParams.category}
            currentDistrict={searchParams.district}
            currentQ={searchParams.q}
          />
        </div>

        {/* Listings grid */}
        <div className="flex-1">
          {listings.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing as any}
                    locale={params.locale}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/listings?page=${p}${searchParams.category ? `&category=${searchParams.category}` : ""}${searchParams.district ? `&district=${searchParams.district}` : ""}` as any}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        p === page
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">{t("noResults")}</h3>
              <p className="text-sm text-gray-500">{t("noResultsHint")}</p>
              <Link
                href="/listings/new"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                {t("newListing")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
