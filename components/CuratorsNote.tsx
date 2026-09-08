"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CuratorsNote() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);

  const toggleSoundscape = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <>
      <section className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-12 content-visibility-auto">
        <div className="bg-surface-container-low dark:bg-[#1C1B1B] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[40px] md:rounded-[60px] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
          {/* Text column */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-sans text-xs uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold">
                Curator&apos;s Note • Autumn &amp; Winter Edition
              </span>

              {/* Ambient Soundscape Toggle Pill */}
              <button
                onClick={toggleSoundscape}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 text-[11px] font-sans font-semibold transition-all cursor-pointer ${
                  isPlayingAudio
                    ? "bg-primary-container text-white border-on-surface dark:bg-[#1E8C80] dark:text-[#131313]"
                    : "bg-surface-container-lowest dark:bg-[#201F1F] text-on-surface dark:text-[#FAF7F2] border-on-surface/20"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {isPlayingAudio ? "volume_up" : "graphic_eq"}
                </span>
                <span>{isPlayingAudio ? "Ambient: Rain & Bells" : "Soundscape"}</span>
                {isPlayingAudio && (
                  <span className="flex items-end gap-[2px] h-3 ml-0.5">
                    <span className="w-0.5 h-3 bg-white dark:bg-[#131313] animate-pulse"></span>
                    <span className="w-0.5 h-2 bg-white dark:bg-[#131313] animate-bounce"></span>
                    <span className="w-0.5 h-3.5 bg-white dark:bg-[#131313] animate-pulse"></span>
                  </span>
                )}
              </button>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-on-surface dark:text-[#FAF7F2] mt-1 tracking-tight font-normal leading-[1.1]">
              Travel as an act of quiet observation.
            </h2>

            {/* Editorial Drop-Cap Paragraph */}
            <p className="font-sans text-base md:text-lg text-on-surface-variant dark:text-[rgba(250,247,242,0.75)] mt-6 leading-relaxed">
              <span className="float-left text-5xl md:text-6xl font-serif text-primary dark:text-[#1E8C80] leading-none pr-3 pt-1 font-normal select-none">
                W
              </span>
              e reject the checklist trip. Wayfare charters journeys intended for the contemplative voyager: properties hand-built by local families, routes charted along slow train corridors, verified operational sanctuaries, and meals taken in kitchen-table taverns.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link
                href="/itinerary"
                className="inline-flex items-center gap-2 bg-primary dark:bg-[#1E8C80] text-on-primary dark:text-[#131313] px-7 py-3.5 rounded-full border-2 border-on-surface dark:border-[#1E8C80] font-sans text-sm font-medium hover:bg-surface-tint dark:hover:bg-[#1A7A70] transition-all hover:scale-105 active:scale-95"
              >
                <span>Explore The Itinerary</span>
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
              </Link>
              <button
                onClick={() => setShowCriteriaModal(true)}
                className="inline-flex items-center gap-2 bg-surface-container-lowest dark:bg-[#1A1A1A] text-on-surface dark:text-[#FAF7F2] px-6 py-3.5 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] font-sans text-sm font-medium hover:bg-surface-variant dark:hover:bg-[#2A2A2A] transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Our Criteria</span>
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </button>
            </div>
          </div>

          {/* Feature Image Frame with Vintage Vignette Filter */}
          <div className="lg:w-1/2 w-full">
            <div className="relative w-full h-[360px] md:h-[440px] rounded-[32px] md:rounded-[44px] overflow-hidden border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] group">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80"
                alt="Traveler journaling at stone villa"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 bg-surface-container-lowest/95 dark:bg-[#131313]/95 backdrop-blur-sm border-2 border-on-surface dark:border-[#FAF7F2] px-4 py-2 rounded-full">
                <span className="font-sans text-xs uppercase tracking-wider text-on-surface dark:text-[#FAF7F2]">
                  Peloponnese, Greece • Villa Kerasia
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Criteria Modal */}
      {showCriteriaModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowCriteriaModal(false)}
        >
          <div
            className="relative w-full max-w-lg bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[36px] p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-surface-container dark:border-[#2A2A2A]">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-1">
                  Editorial Protocol
                </span>
                <h3 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal">
                  The Four Wayfare Criteria
                </h3>
              </div>
              <button
                onClick={() => setShowCriteriaModal(false)}
                className="w-9 h-9 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#201F1F] flex items-center justify-center text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-4 font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.75)]">
              <div className="p-3.5 rounded-[18px] bg-surface-container-low dark:bg-[#201F1F] border-2 border-on-surface/20">
                <strong className="text-on-surface dark:text-[#FAF7F2] block mb-1 font-semibold">
                  1. Real &amp; Operational Only
                </strong>
                Every destination is verified against live status databases. We reject hallucinated places.
              </div>

              <div className="p-3.5 rounded-[18px] bg-surface-container-low dark:bg-[#201F1F] border-2 border-on-surface/20">
                <strong className="text-on-surface dark:text-[#FAF7F2] block mb-1 font-semibold">
                  2. Tactile Silence &amp; Character
                </strong>
                We favor properties with under 30 beds, masonry stone, courtyards, and acoustic privacy over generic hotel towers.
              </div>

              <div className="p-3.5 rounded-[18px] bg-surface-container-low dark:bg-[#201F1F] border-2 border-on-surface/20">
                <strong className="text-on-surface dark:text-[#FAF7F2] block mb-1 font-semibold">
                  3. Respect for Dietary Rites
                </strong>
                Clear honesty about 100% Pure Veg and Jain availability rather than opaque assumptions.
              </div>

              <div className="p-3.5 rounded-[18px] bg-surface-container-low dark:bg-[#201F1F] border-2 border-on-surface/20">
                <strong className="text-on-surface dark:text-[#FAF7F2] block mb-1 font-semibold">
                  4. Zero Service Inflation
                </strong>
                We provide discovery and outbound links with zero hidden transaction markups.
              </div>
            </div>

            <button
              onClick={() => setShowCriteriaModal(false)}
              className="mt-6 w-full py-3 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-widest font-semibold hover:bg-primary transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
}
