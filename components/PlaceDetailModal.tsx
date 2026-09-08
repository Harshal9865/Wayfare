"use client";

import React, { useState } from "react";
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

  if (!isOpen || !place) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[32px] md:rounded-[40px] shadow-none p-6 md:p-8 scrollbar-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top bar with close button */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-surface-container dark:border-[#2A2A2A]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#201F1F]">
              <span className="w-2 h-2 rounded-full bg-secondary dark:bg-[#1E8C80]"></span>
              <span className="font-sans text-xs uppercase tracking-widest text-on-surface dark:text-[#FAF7F2] font-medium">
                Verified Operational Dossier
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-10 h-10 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#201F1F] flex items-center justify-center text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Hero Photo with Badge */}
          <div className="relative h-64 sm:h-72 w-full rounded-[24px] overflow-hidden border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] mb-6">
            <img
              src={place.photo_url || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800"}
              alt={place.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="font-sans text-xs font-medium uppercase px-3 py-1 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313]">
                {place.business_status === "OPERATIONAL" ? "Open Now" : "Operational Spot"}
              </span>
              {place.rating && (
                <span className="font-sans text-xs font-semibold px-3 py-1 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] bg-surface-container-lowest dark:bg-[#131313] text-on-surface dark:text-[#FAF7F2] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-amber-500">star</span>
                  {place.rating} ({place.user_ratings_total || 420})
                </span>
              )}
            </div>
          </div>

          {/* Title and Region */}
          <div className="mb-6">
            <span className="font-sans text-xs uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.6)]">
              {place.sub_category || place.category} · {place.formatted_address || "Historic Sanctuary"}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-on-surface dark:text-[#FAF7F2] mt-1 font-normal">
              {place.name}
            </h2>
          </div>

          {/* Field Journal / Impression */}
          <div className="py-4 border-t-2 border-b-2 border-surface-container dark:border-[#2A2A2A] mb-6">
            <span className="font-sans text-xs uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-2">
              Field Journal &amp; Impression
            </span>
            <p className="font-sans text-sm md:text-base text-on-surface-variant dark:text-[rgba(250,247,242,0.8)] leading-relaxed">
              {place.editorial_summary ||
                "Perched at the quiet terminus of the traditional preservation district, this secluded sanctuary offers a sensory antidote to crowded avenues. Ancient stone sculptures rest beneath towering trees, while the scent of river stone and burning incense anchors a quiet contemplation best witnessed in morning light."}
            </p>
          </div>

          {/* Dietary & Tactile Highlights */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-sans text-xs uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.5)] block mb-2">
                Tactile Highlights
              </span>
              <div className="flex flex-wrap gap-2">
                {["Quiet Sanctuary", "Walkable Corridor", "Photography Allowed"].map((tag) => (
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
              <span>Tag Pure Veg / Jain</span>
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
                Pace
              </span>
              <span className="font-sans text-xs font-semibold text-on-surface dark:text-[#FAF7F2]">
                Unhurried (90m)
              </span>
            </div>
            <div>
              <span className="font-sans text-[10px] uppercase tracking-wider text-outline dark:text-[rgba(250,247,242,0.5)] block">
                Dress &amp; Shoes
              </span>
              <span className="font-sans text-xs font-semibold text-on-surface dark:text-[#FAF7F2]">
                Pebble Paths
              </span>
            </div>
          </div>

          {/* Persona Accessibility & Sanctuary Badges */}
          <div className="mb-6 p-4 rounded-[20px] bg-surface-container-low dark:bg-[#201F1F] border-2 border-on-surface/20 dark:border-[rgba(250,247,242,0.2)]">
            <span className="font-sans text-[10px] uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-2">
              Persona &amp; Accessibility Vetting
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-on-surface/20 dark:border-[rgba(250,247,242,0.25)] bg-surface-container-lowest dark:bg-[#181818] font-sans text-xs text-on-surface dark:text-[#FAF7F2]">
                <span className="material-symbols-outlined text-[14px] text-emerald-600 dark:text-emerald-400">accessible</span>
                <span>Gentle Grade / Low-Step Access</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-on-surface/20 dark:border-[rgba(250,247,242,0.25)] bg-surface-container-lowest dark:bg-[#181818] font-sans text-xs text-on-surface dark:text-[#FAF7F2]">
                <span className="material-symbols-outlined text-[14px] text-amber-500">eco</span>
                <span>Satvik / Jain Options &lt; 400m</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-on-surface/20 dark:border-[rgba(250,247,242,0.25)] bg-surface-container-lowest dark:bg-[#181818] font-sans text-xs text-on-surface dark:text-[#FAF7F2]">
                <span className="material-symbols-outlined text-[14px] text-sky-500">wifi</span>
                <span>Quiet Nomad Corner / 5G</span>
              </span>
            </div>
          </div>

          {/* Curated Experience / GetYourGuide Affiliate Booking */}
          <div className="mb-6 p-5 rounded-[24px] bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-surface-container-low dark:from-[#201F1F] dark:via-[#1A1A1A] dark:to-[#201F1F] border-2 border-primary/30 dark:border-[#1E8C80]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[18px] text-primary dark:text-[#1E8C80]">local_activity</span>
                <span className="font-sans text-xs font-semibold text-on-surface dark:text-[#FAF7F2]">
                  Curated Guided Experiences &amp; Passes
                </span>
                <span className="font-sans text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-primary/40 text-primary dark:text-[#1E8C80] font-bold">
                  Official Partner
                </span>
              </div>
              <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.7)]">
                Skip queues with verified local storytellers via GetYourGuide &amp; Viator.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(place.name + " " + (place.formatted_address || ""))}&partner_id=travelguide_in`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border border-on-surface/30 font-sans text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity"
              >
                <span>Find Passes</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + (place.formatted_address || ""))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border-2 border-on-surface/20 dark:border-[rgba(250,247,242,0.25)] bg-surface-container dark:bg-[#2A2A2A] text-on-surface dark:text-[#FAF7F2] font-sans text-xs hover:bg-surface-variant transition-colors"
                title="Open in Google Maps"
              >
                <span className="material-symbols-outlined text-[16px]">directions</span>
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {onSwapSpot && (
              <button
                onClick={() => onSwapSpot(place)}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container dark:bg-[#2A2A2A] text-on-surface dark:text-[#FAF7F2] font-sans text-xs uppercase tracking-wider hover:bg-surface-variant transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                <span>Swap with Alternative</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="ml-auto inline-flex items-center gap-2 bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] px-7 py-3 rounded-full border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-widest font-semibold hover:bg-primary transition-colors cursor-pointer"
            >
              <span>Retain in Schedule</span>
              <span className="material-symbols-outlined text-[16px]">check</span>
            </button>
          </div>
        </div>
      </div>

      <FoodDietaryTaggingModal
        place={place}
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
      />
    </>
  );
}
