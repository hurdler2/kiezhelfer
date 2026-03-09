"use client";

import { useCallback, useEffect, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import { DISTRICT_COORDS } from "@/types";

const BERLIN_CENTER = { lat: 52.52, lng: 13.405 };
const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };

interface Props {
  lat: number | null | undefined;
  lng: number | null | undefined;
  districtSlug?: string;
  onChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ lat, lng, districtSlug, onChange }: Props) {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  // District değişince haritayı o ilçeye götür
  useEffect(() => {
    if (!mapRef.current || !districtSlug) return;
    const coords = DISTRICT_COORDS[districtSlug];
    if (coords) {
      mapRef.current.panTo({ lat: coords.lat, lng: coords.lng });
      mapRef.current.setZoom(13);
      // Henüz konum seçilmediyse district merkezini ata
      if (!lat && !lng) {
        onChange(coords.lat, coords.lng);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtSlug]);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        onChange(e.latLng.lat(), e.latLng.lng());
      }
    },
    [onChange]
  );

  const onMarkerDrag = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        onChange(e.latLng.lat(), e.latLng.lng());
      }
    },
    [onChange]
  );

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return null;
  }

  if (!isLoaded) {
    return (
      <div className="h-[220px] sm:h-[280px] rounded-xl bg-gray-100 animate-pulse flex items-center justify-center">
        <span className="text-sm text-gray-400">Karte wird geladen...</span>
      </div>
    );
  }

  const markerPos = lat && lng ? { lat, lng } : null;
  const center = markerPos ?? (districtSlug && DISTRICT_COORDS[districtSlug]
    ? { lat: DISTRICT_COORDS[districtSlug].lat, lng: DISTRICT_COORDS[districtSlug].lng }
    : BERLIN_CENTER);

  return (
    <div>
      <div className="rounded-xl overflow-hidden border border-gray-200 h-[220px] sm:h-[280px]">
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={center}
          zoom={markerPos ? 15 : districtSlug ? 13 : 11}
          onClick={onMapClick}
          onLoad={onMapLoad}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            clickableIcons: false,
            styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
          }}
        >
          {markerPos && (
            <Marker
              position={markerPos}
              draggable
              onDragEnd={onMarkerDrag}
            />
          )}
        </GoogleMap>
      </div>
      {markerPos ? (
        <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1 flex-wrap">
          <MapPin className="h-3 w-3 text-brand-500 flex-shrink-0" />
          <span>{markerPos.lat.toFixed(5)}, {markerPos.lng.toFixed(5)}</span>
          <span className="text-gray-400 hidden sm:inline">— Marker ziehen zum Anpassen</span>
        </p>
      ) : (
        <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span>Auf die Karte klicken, um den genauen Standort zu wählen</span>
        </p>
      )}
    </div>
  );
}
