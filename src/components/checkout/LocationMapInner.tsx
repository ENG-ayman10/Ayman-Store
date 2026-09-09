"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { LocateFixed, MapPin, ExternalLink, Loader2, Compass, ChevronDown } from "lucide-react";
import { YEMEN_GOVERNORATES, type YemenGovernorate } from "@/config/yemenGovernorates";

export interface SelectedLocation {
  lat: number;
  lng: number;
  googleMapsUrl: string;
}

interface LocationMapInnerProps {
  onSelectLocation: (loc: SelectedLocation) => void;
  initialLat?: number;
  initialLng?: number;
  targetCoords?: { lat: number; lng: number } | null;
  locale: "ar" | "en";
}

export default function LocationMapInner({
  onSelectLocation,
  initialLat = 15.3694,
  initialLng = 44.191,
  targetCoords,
  locale,
}: LocationMapInnerProps) {
  const isAr = locale === "ar";
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerInstanceRef = useRef<LeafletMarker | null>(null);

  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const currentGoogleUrl = `https://www.google.com/maps?q=${currentPos.lat.toFixed(6)},${currentPos.lng.toFixed(6)}`;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Custom Vector Pin Icon
      const customPinIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #e11d48, #be123c); border: 2.5px solid #ffffff; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
              📍
            </div>
            <div style="width: 8px; height: 8px; background: #be123c; transform: rotate(45deg); margin-top: -4px;"></div>
            <div style="width: 14px; height: 4px; border-radius: 50%; background: rgba(0,0,0,0.25); margin-top: 2px;"></div>
          </div>
        `,
        iconSize: [38, 46],
        iconAnchor: [19, 46],
      });

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // Add Zoom Control in convenient corner
      L.control.zoom({ position: isAr ? "topleft" : "topright" }).addTo(map);

      // OpenStreetMap Tiles (Fast, Free, High-Detail for Yemen)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        subdomains: ["a", "b", "c"],
      }).addTo(map);

      // Marker
      const marker = L.marker([initialLat, initialLng], {
        icon: customPinIcon,
        draggable: true,
      }).addTo(map);

      const updatePosition = (lat: number, lng: number) => {
        setCurrentPos({ lat, lng });
        const gUrl = `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
        onSelectLocation({ lat, lng, googleMapsUrl: gUrl });
      };

      // Marker drag event
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        updatePosition(pos.lat, pos.lng);
      });

      // Map click event
      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        updatePosition(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
      markerInstanceRef.current = marker;

      // Initial callback
      updatePosition(initialLat, initialLng);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerInstanceRef.current = null;
      }
    };
  }, [initialLat, initialLng, isAr, onSelectLocation]);

  // Handle GPS detection
  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      setGpsError(isAr ? "المتصفح لا يدعم تحديد الموقع (GPS)" : "Geolocation not supported");
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCurrentPos({ lat, lng });

        if (mapInstanceRef.current && markerInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 17, { animate: true });
          markerInstanceRef.current.setLatLng([lat, lng]);
        }

        const gUrl = `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
        onSelectLocation({ lat, lng, googleMapsUrl: gUrl });
        setGpsLoading(false);
      },
      (err) => {
        console.warn("GPS Error:", err);
        setGpsLoading(false);
        if (err.code === 1) {
          setGpsError(
            isAr
              ? "يرجى السماح بصلاحية الموقع من إعدادات المتصفح لالتقاط مكانك بدقة."
              : "Please allow location permission in your browser."
          );
        } else {
          setGpsError(
            isAr
              ? "تعذر التقاط إشارة الـ GPS، يمكنك تحريك الدبوس على الخريطة يدوياً."
              : "Unable to retrieve GPS. You can drag the pin manually."
          );
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Respond to targetCoords changes from parent governorate selector
  useEffect(() => {
    if (!targetCoords) return;
    setCurrentPos(targetCoords);
    if (mapInstanceRef.current && markerInstanceRef.current) {
      mapInstanceRef.current.setView([targetCoords.lat, targetCoords.lng], 14, { animate: true });
      markerInstanceRef.current.setLatLng([targetCoords.lat, targetCoords.lng]);
    }
    const gUrl = `https://www.google.com/maps?q=${targetCoords.lat.toFixed(6)},${targetCoords.lng.toFixed(6)}`;
    onSelectLocation({ lat: targetCoords.lat, lng: targetCoords.lng, googleMapsUrl: gUrl });
  }, [targetCoords, onSelectLocation]);

  // Jump to specific city/governorate
  const handleJumpCity = (gov: YemenGovernorate) => {
    setCurrentPos({ lat: gov.lat, lng: gov.lng });
    if (mapInstanceRef.current && markerInstanceRef.current) {
      mapInstanceRef.current.setView([gov.lat, gov.lng], 14, { animate: true });
      markerInstanceRef.current.setLatLng([gov.lat, gov.lng]);
    }
    const gUrl = `https://www.google.com/maps?q=${gov.lat.toFixed(6)},${gov.lng.toFixed(6)}`;
    onSelectLocation({ lat: gov.lat, lng: gov.lng, googleMapsUrl: gUrl });
  };

  return (
    <div className="space-y-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-3.5 shadow-sm">
      {/* Top Bar: GPS Button & Yemen Quick City Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={handleGetGPS}
          disabled={gpsLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-black text-xs shadow-md shadow-rose-600/20 active:scale-95 transition disabled:opacity-50 shrink-0"
        >
          {gpsLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LocateFixed className="w-4 h-4 animate-pulse" />
          )}
          <span>{isAr ? "📍 التقاط موقعي الحالي (GPS)" : "📍 Pin My Live GPS"}</span>
        </button>

        {/* Governorates selector on map */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px] justify-end">
          <Compass className="w-3.5 h-3.5 text-gold-500 shrink-0" />
          <div className="relative">
            <select
              onChange={(e) => {
                const gov = YEMEN_GOVERNORATES.find((g) => g.id === e.target.value);
                if (gov) handleJumpCity(gov);
              }}
              defaultValue=""
              className="py-1.5 ps-2.5 pe-7 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold focus:ring-1 focus:ring-gold-500 appearance-none cursor-pointer"
            >
              <option value="" disabled>
                {isAr ? "الانتقال لمحافظة أخرى (22 محافظة)..." : "Jump to Governorate..."}
              </option>
              {YEMEN_GOVERNORATES.map((g) => (
                <option key={g.id} value={g.id}>
                  {isAr ? g.nameAr : g.nameEn}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute top-2 end-2 pointer-events-none" />
          </div>
        </div>
      </div>

      {gpsError && (
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-200 text-xs font-semibold">
          {gpsError}
        </div>
      )}

      {/* Map Display Container */}
      <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Helpful overlay hint */}
        <div className="absolute bottom-2 inset-x-2 z-20 pointer-events-none flex justify-center">
          <span className="bg-neutral-950/80 text-white backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold shadow-md">
            {isAr
              ? "اسحبي الدبوس أو انقري فوق منزلك لتثبيت الموقع بدقة"
              : "Drag the pin or click on the map to place precisely"}
          </span>
        </div>
      </div>

      {/* Selected Coordinates & Google Maps Link Preview */}
      <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-bold">
          <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
          <span>
            {isAr ? "الإحداثيات المحددة:" : "Coordinates:"}{" "}
            <span className="font-mono text-neutral-900 dark:text-white">
              {currentPos.lat.toFixed(4)}, {currentPos.lng.toFixed(4)}
            </span>
          </span>
        </div>

        <a
          href={currentGoogleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 hover:underline font-bold text-[11px] self-end sm:self-auto"
        >
          <span>{isAr ? "معاينة الرابط في خرائط جوجل" : "Preview in Google Maps"}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
