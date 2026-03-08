"use client";

import { useState, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";

const BERLIN_CENTER = { lat: 52.52, lng: 13.405 };
const MAP_CONTAINER_STYLE = { width: "100%", height: "calc(100vh - 12rem)" };

interface MapListing {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  priceType: string;
  priceAmount: number | null;
  district: string | null;
  category: { slug: string; iconName: string | null };
}

interface Props {
  listings: MapListing[];
  locale?: string;
}

export default function MapView({ listings, locale = "de" }: Props) {
  const t = useTranslations("map");

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  const [selectedListing, setSelectedListing] = useState<MapListing | null>(null);

  const onMarkerClick = useCallback((listing: MapListing) => {
    setSelectedListing(listing);
  }, []);

  const onMapClick = useCallback(() => {
    setSelectedListing(null);
  }, []);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl">
        <p className="text-gray-500">{t("loadError")}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl animate-pulse">
        <p className="text-gray-400">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={BERLIN_CENTER}
        zoom={11}
        onClick={onMapClick}
        options={{
          styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={{ lat: listing.latitude, lng: listing.longitude }}
            onClick={() => onMarkerClick(listing)}
            icon={{
              url: `data:image/svg+xml,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="14" fill="#0d9488" stroke="white" stroke-width="2"/>
                  <text x="16" y="21" text-anchor="middle" fill="white" font-size="14">
                    ${listing.category.iconName === "Wrench" ? "🔧" :
                      listing.category.iconName === "Sparkles" ? "✨" :
                      listing.category.iconName === "Monitor" ? "💻" :
                      listing.category.iconName === "BookOpen" ? "📚" : "🤝"}
                  </text>
                </svg>
              `)}`,
              scaledSize: new window.google.maps.Size(32, 32),
            }}
          />
        ))}

        {selectedListing && (
          <InfoWindow
            position={{
              lat: selectedListing.latitude,
              lng: selectedListing.longitude,
            }}
            onCloseClick={() => setSelectedListing(null)}
          >
            <div className="max-w-[200px] p-1">
              <p className="font-semibold text-gray-900 text-sm">{selectedListing.title}</p>
              {selectedListing.district && (
                <p className="text-xs text-gray-500 mt-0.5">📍 {selectedListing.district}</p>
              )}
              <p className="text-sm font-medium text-brand-700 mt-1">
                {formatPrice(selectedListing.priceType, selectedListing.priceAmount, locale)}
              </p>
              <a
                href={`/${locale}/listings/${selectedListing.id}`}
                className="text-xs text-brand-600 hover:underline block mt-1"
              >
                {t("viewDetails")}
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
