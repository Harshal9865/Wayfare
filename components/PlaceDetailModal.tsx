"use client";

import React, { useState, useEffect } from "react";
import { Place } from "@/lib/types";
import FoodDietaryTaggingModal from "@/components/FoodDietaryTaggingModal";

interface PlaceDetailModalProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  onSwapSpot?: (place: Place) => void;
}

export default function PlaceDetailModal({
  place,
  isOpen,
  onClose,
  onSwapSpot,
}: PlaceDetailModalProps) {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Reset active photo index when place changes
  useEffect(() => {
    setActivePhotoIndex(0);
  }, [place]);

  if (!isOpen || !place) return null;

  // Build a list of 4-6 multi-angle perspective photos if place.photos is not provided
  const photoGallery =
    place.photos && place.photos.length > 0
      ? place.photos
      : [
          place.photo_url || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000",
          "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000",
          "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000",
          "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=1000",
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1000",
        ];

  const photoAngleLabels = [
    "Perspective #1 • Main Architectural Facade",
    "Perspective #2 • Golden Hour & Surrounding Horizon",
    "Perspective #3 • Interior Courtyard & Artisanal Details",
    "Perspective #4 • Atmospheric Morning Light & Promenade",
    "Perspective #5 • Panoramic Vantage Point",
  ];

  const nextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % photoGallery.length);
  };

  const prevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + photoGallery.length) % photoGallery.length);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[28px] sm:rounded-[36px] md:rounded-[44px] shadow-2xl p-5 sm:p-7 md:p-8 scrollbar-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top bar with close button */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b-2 border-surface-container dark:border-[#2A2A2A]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#201F1F]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-sans text-[11px] uppercase tracking-widest text-on-surface dark:text-[#FAF7F2] font-semibold">
                Verified Operational Dossier
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-9 h-9 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#201F1F] flex items-center justify-center text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Multi-Angle Photo Gallery Carousel */}
          <div className="relative h-64 sm:h-80 md:h-88 w-full rounded-[24px] overflow-hidden border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] mb-4 bg-black group">
            <img
              src={photoGallery[activePhotoIndex]}
              alt={`${place.name} - ${photoAngleLabels[activePhotoIndex % photoAngleLabels.length]}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

            {/* Badges on Top */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
              <span className="font-sans text-[11px] font-semibold uppercase px-3 py-1 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] shadow-md">
                {place.business_status === "OPERATIONAL" ? "Open Now" : "Operational Spot"}
              </span>
              {place.rating && (
                <span className="font-sans text-xs font-semibold px-3 py-1 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] bg-surface-container-lowest/90 dark:bg-[#131313]/90 text-on-surface dark:text-[#FAF7F2] flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-[14px] text-amber-400">star</span>
                  {place.rating} ({place.user_ratings_total || 420})
                </span>
              )}
            </div>

            {/* Carousel Navigation Arrows */}
            {photoGallery.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border-2 border-white/40 text-white flex items-center justify-center cursor-pointer hover:bg-black transition-transform active:scale-90"
                  aria-label="Previous angle"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border-2 border-white/40 text-white flex items-center justify-center cursor-pointer hover:bg-black transition-transform active:scale-90"
                  aria-label="Next angle"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </>
            )}

            {/* Current Angle Label Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
              <span className="font-sans text-[11px] font-medium bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 truncate max-w-[80%]">
                {photoAngleLabels[activePhotoIndex % photoAngleLabels.length]}
              </span>
              <span className="font-sans text-[11px] font-semibold bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                {activePhotoIndex + 1} / {photoGallery.length}
              </span>
            </div>
          </div>

          {/* Angle Thumbnails Row */}
          {photoGallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
              {photoGallery.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhotoIndex(i)}
                  className={`relative flex-none w-16 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhotoIndex === i
                      ? "border-primary dark:border-[#1E8C80] scale-105 shadow-md"
                      : "border-on-surface/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title and Region */}
          <div className="mb-6">
            <span className="font-sans text-xs uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.6)] font-semibold">
              {place.sub_category || place.category} · {place.formatted_address || "Historic Sanctuary"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-on-surface dark:text-[#FAF7F2] mt-1 font-normal">
              {place.name}
            </h2>
          </div>

          {/* Field Journal / Impression */}
          <div className="py-4 border-t-2 border-b-2 border-surface-container dark:border-[#2A2A2A] mb-6">
            <span className="font-sans text-xs uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-2">
              Field Journal &amp; Atmosphere
            </span>
            <p className="font-sans text-sm md:text-base text-on-surface-variant dark:text-[rgba(250,247,242,0.8)] leading-relaxed">
              {place.editorial_summary ||
                "Perched at the quiet terminus of the traditional preservation district, this secluded sanctuary offers a sensory antidote to crowded avenues. Ancient stone sculptures rest beneath towering trees, while the scent of river stone and burning incense anchors a quiet contemplation best witnessed in morning light."}
            </p>
          </div>

          {/* Dietary & Highlights */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-sans text-[11px] uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.5)] font-semibold block mb-2">
                Tactile Highlights
              </span>
              <div className="flex flex-wrap gap-2">
                {["Verified Spot", "Walkable Corridor", "Photography Permitted"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] bg-surface-container-low dark:bg-[#201F1F] font-sans text-xs text-on-surface dark:text-[#FAF7F2]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Community Dietary Tag button */}
            <button
              onClick={() => setIsTagModalOpen(true)}
              className="px-4 py-2 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#201F1F] font-sans text-xs font-semibold text-primary dark:text-[#1E8C80] hover:bg-surface-container flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">restaurant</span>
              <span>Tag Pure Veg / Satvik</span>
            </button>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-surface-container-low dark:bg-[#201F1F] rounded-[20px] border-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] mb-6 text-center">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-wider text-outline dark:text-[rgba(250,247,242,0.5)] block">
                Optimal Light
              </span>
              <span className="font-sans text-xs font-semibold text-on-surface dark:text-[#FAF7F2]">
                07:30 – 10:00 AM
              </span>
            </div>
            <div className="border-x-2 border-surface-container dark:border-[#2A2A2A]">
              <span className="font-sans text-[10px] uppercase tracking-wider text-outline dark:text-[rgba(250,247,242,0.5)] block">
                Recommended Duration
              </span>
              <span className="font-sans text-xs font-semibold text-on-surface dark:text-[#FAF7F2]">
                Unhurried (90m)
              </span>
            </div>
            <div>
              <span className="font-sans text-[10px] uppercase tracking-wider text-outline dark:text-[rgba(250,247,242,0.5)] block">
                Path Terrain
              </span>
              <span className="font-sans text-xs font-semibold text-on-surface dark:text-[#FAF7F2]">
                Pebble Promenade
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {onSwapSpot && (
              <button
                onClick={() => onSwapSpot(place)}
                className="w-full sm:flex-1 py-3.5 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] bg-surface-container-lowest dark:bg-[#201F1F] text-on-surface dark:text-[#FAF7F2] font-sans text-xs uppercase tracking-wider font-semibold hover:bg-surface-variant flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                <span>Swap With Custom Spot</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] font-sans text-xs uppercase tracking-widest font-semibold border-2 border-on-surface dark:border-[#1E8C80] hover:bg-primary transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>

      <FoodDietaryTaggingModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        place={place}
      />
    </>
  );
}
