import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import MapView from "@/components/map/MapView";
import type { Metadata } from "next";

const BASE_URL = "https://kiezhelfer.vercel.app";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isDE = params.locale === "de";
  return {
    title: isDE ? "Karte – Angebote in Berlin" : "Map – Listings in Berlin",
    description: isDE
      ? "Entdecke Nachbarschaftshilfe auf der interaktiven Karte. Finde Handwerker und Helfer in deinem Berliner Bezirk."
      : "Discover neighborhood help on the interactive map. Find craftsmen and helpers in your Berlin district.",
    alternates: {
      canonical: `${BASE_URL}/${params.locale}/map`,
      languages: { de: `${BASE_URL}/de/map`, en: `${BASE_URL}/en/map` },
    },
  };
}

export default async function MapPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("map");

  const listings = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      latitude: { not: null },
      longitude: { not: null },
    },
    select: {
      id: true,
      title: true,
      latitude: true,
      longitude: true,
      priceType: true,
      priceAmount: true,
      district: true,
      category: { select: { slug: true, iconName: true } },
    },
  });

  const validListings = listings.filter(
    (l): l is typeof l & { latitude: number; longitude: number } =>
      l.latitude !== null && l.longitude !== null
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {t("listingCount", { count: validListings.length })}
        </p>
      </div>

      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
        <MapView listings={validListings} locale={params.locale} />
      ) : (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-center">
            <p className="text-gray-500 font-medium">{t("apiKeyMissing")}</p>
            <p className="text-sm text-gray-400 mt-1">
              {t("apiKeyHint")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
