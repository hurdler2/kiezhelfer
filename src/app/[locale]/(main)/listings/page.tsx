import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import ListingCard from "@/components/listings/ListingCard";
import ListingsFilter from "@/components/listings/ListingsFilter";
import MobileListingsFilter from "@/components/listings/MobileListingsFilter";
import { Link } from "@/i18n/navigation";
import { Plus } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const BASE_URL = "https://kiezhelfer.vercel.app";

interface Props {
  params: { locale: string };
  searchParams: { category?: string; district?: string; q?: string; page?: string };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const isDE = params.locale === "de";
  const q = searchParams.q;
  const category = searchParams.category;

  const title = q
    ? isDE ? `„${q}" – Angebote in Berlin` : `"${q}" – Listings in Berlin`
    : category
      ? isDE ? `${category.replace(/-/g, " ")} – Angebote Berlin` : `${category.replace(/-/g, " ")} – Listings Berlin`
      : isDE ? "Alle Angebote in Berlin" : "All Listings in Berlin";

  return {
    title,
    description: isDE
      ? "Durchsuche Handwerker, Nachhilfe, Alltags- & Nachbarschaftshilfe auf KiezHelfer – günstig, lokal, direkt in deinem Berliner Kiez."
      : "Browse craftsmen, tutoring, everyday and neighborhood help on KiezHelfer – affordable, local, right in your Berlin neighborhood.",
    alternates: {
      canonical: `${BASE_URL}/${params.locale}/listings`,
      languages: { de: `${BASE_URL}/de/listings`, en: `${BASE_URL}/en/listings` },
    },
  };
}

export default async function ListingsPage({ params, searchParams }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations("listings");
  const page = parseInt(searchParams.page ?? "1");
  const limit = 48;

  const searchWords = searchParams.q?.trim().split(/\s+/).filter(Boolean) ?? [];

  // Fuzzy arama: pg_trgm varsa kullan, yoksa Prisma ORM fallback
  let searchIds: string[] | null = null;
  if (searchWords.length > 0) {
    try {
      // Her kelime için arama koşulu oluştur
      let combinedCond = Prisma.sql`(
        l.title ILIKE ${`%${searchWords[0]}%`}
        OR l.description ILIKE ${`%${searchWords[0]}%`}
        OR c.slug ILIKE ${`%${searchWords[0]}%`}
        OR EXISTS (SELECT 1 FROM unnest(l.tags) AS tag WHERE tag ILIKE ${`%${searchWords[0]}%`})
        OR similarity(l.title, ${searchWords[0]}) > 0.2
        OR similarity(l.description, ${searchWords[0]}) > 0.2
      )`;

      for (let i = 1; i < searchWords.length; i++) {
        const word = searchWords[i];
        combinedCond = Prisma.sql`${combinedCond} AND (
          l.title ILIKE ${`%${word}%`}
          OR l.description ILIKE ${`%${word}%`}
          OR c.slug ILIKE ${`%${word}%`}
          OR EXISTS (SELECT 1 FROM unnest(l.tags) AS tag WHERE tag ILIKE ${`%${word}%`})
          OR similarity(l.title, ${word}) > 0.3
          OR similarity(l.description, ${word}) > 0.3
        )`;
      }

      let whereClause = Prisma.sql`l.status::text = 'ACTIVE' AND (${combinedCond})`;
      if (searchParams.category) {
        whereClause = Prisma.sql`${whereClause} AND c.slug = ${searchParams.category}`;
      }
      if (searchParams.district) {
        whereClause = Prisma.sql`${whereClause} AND l.district = ${searchParams.district}`;
      }

      const rows = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
        SELECT DISTINCT l.id
        FROM "Listing" l
        JOIN "Category" c ON l."categoryId" = c.id
        WHERE ${whereClause}
      `);

      searchIds = rows.map((r) => r.id);
    } catch {
      // pg_trgm yoksa Prisma ORM ile basit arama
      const fallback = await prisma.listing.findMany({
        where: {
          status: "ACTIVE",
          ...(searchParams.category && { category: { slug: searchParams.category } }),
          ...(searchParams.district && { district: searchParams.district }),
          AND: searchWords.map((word) => ({
            OR: [
              { title: { contains: word, mode: "insensitive" } },
              { description: { contains: word, mode: "insensitive" } },
              { category: { slug: { contains: word, mode: "insensitive" } } },
            ],
          })),
        },
        select: { id: true },
      });
      searchIds = fallback.map((l) => l.id);
    }
  }

  const baseWhere: Prisma.ListingWhereInput =
    searchIds !== null
      ? { id: { in: searchIds } }
      : {
          status: "ACTIVE",
          ...(searchParams.category && { category: { slug: searchParams.category } }),
          ...(searchParams.district && { district: searchParams.district }),
        };

  const [listings, total, categories] = await Promise.all([
    prisma.listing.findMany({
      where: baseWhere,
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
    searchIds !== null
      ? Promise.resolve(searchIds.length)
      : prisma.listing.count({ where: baseWhere }),
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

      {/* Mobile category pills + filter — only on < lg */}
      <div className="lg:hidden mb-4">
        <MobileListingsFilter
          categories={categories}
          currentCategory={searchParams.category}
          currentDistrict={searchParams.district}
          currentQ={searchParams.q}
        />
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
