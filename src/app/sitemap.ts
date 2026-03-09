import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://kiezhelfer.vercel.app";
const locales = ["de", "en"];

const staticRoutes = [
  "",
  "/listings",
  "/map",
  "/about",
  "/contact",
  "/login",
  "/register",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Statik sayfalar — her iki dil için
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "daily" : ("weekly" as const),
      priority: route === "" ? 1.0 : route === "/listings" ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE_URL}/${l}${route}`])
        ),
      },
    }))
  );

  // Dinamik ilan sayfaları
  let listingEntries: MetadataRoute.Sitemap = [];
  try {
    const listings = await prisma.listing.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 1000,
    });

    listingEntries = listings.flatMap((listing) =>
      locales.map((locale) => ({
        url: `${BASE_URL}/${locale}/listings/${listing.id}`,
        lastModified: listing.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/listings/${listing.id}`])
          ),
        },
      }))
    );
  } catch {
    // DB bağlantı hatası olursa sadece statik sayfaları döndür
  }

  return [...staticEntries, ...listingEntries];
}
