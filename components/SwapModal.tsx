"use client";

import React, { useState, useEffect } from "react";
import { Place } from "@/lib/types";
import EditorialLoader from "@/components/EditorialLoader";

interface SwapModalProps {
  targetPlace: Place | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSwap: (oldPlaceId: string, newPlace: Place) => void;
  excludedPlaceIds?: string[];
}

export default function SwapModal({
  targetPlace,
  isOpen,
  onClose,
  onConfirmSwap,
  excludedPlaceIds = [],
}: SwapModalProps) {
  const [alternatives, setAlternatives] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !targetPlace) return;

    setLoading(true);
    fetch("/api/places/swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        place_id: targetPlace.place_id,
        category: targetPlace.category,
        excluded_place_ids: excludedPlaceIds,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.alternatives) {
          setAlternatives(data.alternatives);
        }
      })
      .catch((err) => console.error("Swap fetch error:", err))
      .finally(() => setLoading(false));
  }, [isOpen, targetPlace, excludedPlaceIds]);

  if (!isOpen || !targetPlace) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[36px] p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-surface-container dark:border-[#2A2A2A]">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-1">
              Alternative Operational Spots
            </span>
            <h3 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal">
              Swap &ldquo;{targetPlace.name}&rdquo;
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#201F1F] flex items-center justify-center text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {loading ? (
          <div className="py-8">
            <EditorialLoader
              size="md"
              label="Querying Operational Sanctuaries..."
              sublabel="Live anti-hallucination verification"
            />
          </div>
        ) : alternatives.length === 0 ? (
          <div className="py-8 text-center text-on-surface-variant dark:text-[rgba(250,247,242,0.6)]">
            <p className="font-sans text-sm">
              No further verified alternatives found within this immediate corridor.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {alternatives.map((alt) => (
              <div
                key={alt.place_id}
                className="p-4 bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] rounded-[24px] flex flex-col sm:flex-row gap-4 items-center justify-between group hover:border-primary transition-all"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={alt.photo_url || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300"}
                    alt={alt.name}
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 rounded-[16px] object-cover border-2 border-on-surface dark:border-[rgba(250,247,242,0.2)] shrink-0"
                  />
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-wider text-outline dark:text-[rgba(250,247,242,0.5)] block">
                      {alt.sub_category || alt.category}
                    </span>
                    <h4 className="font-serif text-lg text-on-surface dark:text-[#FAF7F2] font-normal">
                      {alt.name}
                    </h4>
                    <span className="font-sans text-xs text-primary dark:text-[#1E8C80] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">star</span>
                      {alt.rating} · Verified Open
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onConfirmSwap(targetPlace.place_id, alt);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-wider font-semibold hover:bg-primary transition-colors cursor-pointer shrink-0"
                >
                  Select &amp; Replace
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
