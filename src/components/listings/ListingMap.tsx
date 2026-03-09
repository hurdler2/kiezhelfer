"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useRef } from "react";

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
    return <div className="h-[180px] rounded-xl bg-gray-100 animate-pulse" />;
  }

  const position = { lat, lng };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 h-[180px]">
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
