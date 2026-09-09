"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, ChevronDown, ChevronUp, Loader2, CheckCircle2 } from "lucide-react";
import type { SelectedLocation } from "./LocationMapInner";

// Dynamically import Leaflet map with SSR disabled
const LocationMapInner = dynamic(() => import("./LocationMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center justify-center gap-2 text-neutral-400">
      <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
      <span className="text-xs font-bold">جاري تحميل الخريطة التفاعلية...</span>
    </div>
  ),
});

interface LocationPickerMapProps {
  onLocationChange: (url: string | null) => void;
  targetCoords?: { lat: number; lng: number } | null;
  locale: "ar" | "en";
}

export function LocationPickerMap({ onLocationChange, targetCoords, locale }: LocationPickerMapProps) {
  const isAr = locale === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const [hasPinned, setHasPinned] = useState(false);
  const [googleUrl, setGoogleUrl] = useState<string | null>(null);

  const handleSelect = (loc: SelectedLocation) => {
    setHasPinned(true);
    setGoogleUrl(loc.googleMapsUrl);
    onLocationChange(loc.googleMapsUrl);
  };

  return (
    <div className="space-y-3 pt-1">
      {/* Toggle Header Button */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60 transition">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-neutral-900 dark:text-white">
                {isAr ? "تحديد الموقع بدقة عبر الخريطة (GPS)" : "Precise GPS Map Location"}
              </span>
              {hasPinned && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  {isAr ? "تم التحديد" : "Pinned"}
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-500">
              {isAr
                ? "يساعد مندوب التوصيل في الوصول لباب بيتك مباشرة بدون اتصالات متكررة"
                : "Helps delivery courier reach your exact doorstep directly"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-gold-500 text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1 transition active:scale-95 shadow-2xs shrink-0"
        >
          <span>
            {isOpen
              ? isAr ? "إخفاء الخريطة" : "Hide Map"
              : isAr ? "فتح الخريطة 🗺️" : "Open Map 🗺️"}
          </span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Map View */}
      {isOpen && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <LocationMapInner
            onSelectLocation={handleSelect}
            targetCoords={targetCoords}
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}
export default LocationPickerMap;
