"use client";

import React, { useState, useEffect } from "react";
import { ItineraryDay, Place } from "@/lib/types";
import { resolveLocationCoords } from "@/lib/geo-resolver";

interface MapViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
  days: ItineraryDay[];
  onSelectPlace: (place: Place) => void;
  lat?: number;
  lng?: number;
}

export default function MapViewModal({
  isOpen,
  onClose,
  locationName,
  days,
  onSelectPlace,
  lat,
  lng,
}: MapViewModalProps) {
  const geo = resolveLocationCoords(locationName || "India");
  const [mapLat, setMapLat] = useState(lat || geo.lat);
  const [mapLng, setMapLng] = useState(lng || geo.lng);
  const [isGeoLoading, setIsGeoLoading] = useState(!lat && !geo.lat);

  useEffect(() => {
    if (!isOpen) return;

    if (lat && lng) {
      setMapLat(lat);
      setMapLng(lng);
      setIsGeoLoading(false);
    } else if (geo.lat && geo.lng) {
      setMapLat(geo.lat);
      setMapLng(geo.lng);
      setIsGeoLoading(false);
    } else {
      setIsGeoLoading(true);
      fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`
      )
        .then((res) => res.json())
        .then((results) => {
          if (results && results[0]) {
            setMapLat(parseFloat(results[0].lat));
            setMapLng(parseFloat(results[0].lon));
          }
        })
        .catch((err) => console.error("Nominatim geocode error:", err))
        .finally(() => setIsGeoLoading(false));
    }
  }, [isOpen, lat, lng, locationName]);

  if (!isOpen) return null;

  const allItems = days.flatMap((d) => d.items);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl h-[85vh] bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[36px] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-surface-container dark:border-[#2A2A2A] flex items-center justify-between bg-surface-container-low dark:bg-[#201F1F]">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-1">
              Geographic Cartography
            </span>
            <h3 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal">
              Active Corridor Map • {locationName}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-10 h-10 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#131313] flex items-center justify-center text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Map Body & Stops Sidebar */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Stops List (5 cols) */}
          <div className="md:col-span-5 border-r-2 border-surface-container dark:border-[#2A2A2A] overflow-y-auto p-6 space-y-4 bg-surface-container-lowest dark:bg-[#1A1A1A]">
            <span className="font-sans text-xs uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.5)] block mb-2">
              Sequenced Waypoints ({allItems.length})
            </span>

            {days.map((day) => (
              <div key={day.day_number} className="mb-4">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-primary dark:text-[#1E8C80] block mb-2">
                  Day {day.day_number}: {day.theme_title}
                </span>

                <div className="space-y-2">
                  {day.items.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onClose();
                        onSelectPlace(item.place);
                      }}
                      className="p-3 rounded-[16px] bg-surface-container-low dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.2)] flex items-center justify-between cursor-pointer hover:border-primary transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] font-sans text-xs font-semibold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-serif text-sm text-on-surface dark:text-[#FAF7F2] block font-normal truncate max-w-[180px]">
                            {item.place.name}
                          </span>
                          <span className="font-sans text-[10px] text-on-surface-variant dark:text-[rgba(250,247,242,0.5)] uppercase">
                            {item.time_slot}
                          </span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[16px] text-outline group-hover:translate-x-0.5 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Real OpenStreetMap Embed (7 cols) */}
          <div className="md:col-span-7 relative bg-[#EBE8E3] dark:bg-[#2A2A2A] flex items-center justify-center overflow-hidden">
            {isGeoLoading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-4 border-[#1E8C80]/30 border-t-[#1E8C80] animate-spin" />
                <span className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] uppercase tracking-wider">
                  Locating {locationName}…
                </span>
              </div>
            ) : (
              <>
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - 0.08},${mapLat - 0.08},${mapLng + 0.08},${mapLat + 0.08}&layer=mapnik&marker=${mapLat},${mapLng}`}
                  className="w-full h-full border-none"
                  title="Map"
                  allowFullScreen
                  loading="lazy"
                />
                <a
                  href={`https://www.openstreetmap.org/?mlat=${mapLat}&mlon=${mapLng}#map=13/${mapLat}/${mapLng}`}
                  target="_blank"
                  rel="noopener"
                  className="absolute bottom-3 right-3 text-[10px] font-sans bg-white/80 dark:bg-[#131313]/80 text-primary dark:text-[#1E8C80] px-2 py-1 rounded-full border font-medium hover:bg-white transition-colors z-10"
                >
                  View Full Map ↗
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
