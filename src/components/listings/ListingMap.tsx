"use client";

import { useCallback, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };

interface Props {
  lat: number;
  lng: number;
}

export default function ListingMap({ lat, lng }: Props) {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) return null;

  if (!isLoaded) {
    return <div className="h-[220px] rounded-xl bg-gray-100 animate-pulse" />;
  }

  // Prisma Float → garantili JS number
  const position = { lat: Number(lat), lng: Number(lng) };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 h-[220px]">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={position}
        zoom={15}
        onLoad={onLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          gestureHandling: "cooperative",
          styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
        }}
      >
        <Marker position={position} />
      </GoogleMap>
    </div>
  );
}
