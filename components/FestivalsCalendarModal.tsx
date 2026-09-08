"use client";

import React from "react";

interface FestivalsCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
}

interface FestivalItem {
  name: string;
  season: string;
  dates: string;
  description: string;
  travelerTip: string;
}

const FESTIVAL_DATABASE: Record<string, FestivalItem[]> = {
  default: [
    {
      name: "Dev Deepawali (Festival of Lights on Ganga)",
      season: "Autumn • Full Moon of Kartik",
      dates: "November 15",
      description: "A million earthen oil lamps (diyas) illuminate all 84 ghats along the crescent river.",
      travelerTip: "Book private wooden river boats at least 6 weeks in advance for vantage viewing.",
    },
    {
      name: "Subah-e-Banaras Morning Ragas",
      season: "Year-Round • Daily at Dawn",
      dates: "Daily 05:00 AM",
      description: "Sacred Vedic chanting, classical sitar, and yoga recitals at Assi Ghat during sunrise.",
      travelerTip: "Arrive 20 minutes before first light; entry is free and open to all travelers.",
    },
  ],
  "Kyoto, Japan": [
    {
      name: "Koyo (Autumn Maple Night Illuminations)",
      season: "Autumn Peak",
      dates: "Late October – Late November",
      description: "Temples like Eikan-do and Kiyomizu-dera light up vermilion Japanese maple canopies against dark night skies.",
      travelerTip: "Visit around 19:30 to avoid sunset queues; tickets bought at the gate.",
    },
    {
      name: "Jidai Matsuri (Festival of the Ages)",
      season: "Autumn Cultural Pageant",
      dates: "October 22",
      description: "A grand historical procession featuring 2,000 participants dressed in authentic imperial period attire.",
      travelerTip: "Vantage points along the Kyoto Imperial Palace gardens offer unhurried views.",
    },
  ],
};

export default function FestivalsCalendarModal({
  isOpen,
  onClose,
  locationName,
}: FestivalsCalendarModalProps) {
  if (!isOpen) return null;

  const festivals =
    FESTIVAL_DATABASE[locationName] || FESTIVAL_DATABASE.default;

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
              Cultural Ephemera
            </span>
            <h3 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal">
              Local Festivals &amp; Seasonal Calendar
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

        {/* Festival List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {festivals.map((fest, idx) => (
            <div
              key={idx}
              className="p-5 rounded-[24px] bg-surface-container-low dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-sans text-[10px] uppercase tracking-widest text-primary dark:text-[#1E8C80] font-semibold">
                  {fest.season} · {fest.dates}
                </span>
                <span className="px-3 py-0.5 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.2)] bg-surface-container-lowest dark:bg-[#131313] font-sans text-[10px] font-semibold text-on-surface dark:text-[#FAF7F2]">
                  Verified Calendar
                </span>
              </div>

              <h4 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-normal">
                {fest.name}
              </h4>

              <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] leading-relaxed">
                {fest.description}
              </p>

              <div className="pt-2 border-t-2 border-on-surface/10 dark:border-[#2A2A2A] flex items-start gap-2 text-xs text-on-surface dark:text-[#FAF7F2]">
                <span className="material-symbols-outlined text-[16px] text-secondary dark:text-[#1E8C80] shrink-0">
                  lightbulb
                </span>
                <span className="font-sans text-[11px] text-on-surface-variant dark:text-[rgba(250,247,242,0.8)]">
                  <strong>Curator Advice:</strong> {fest.travelerTip}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 mt-4 border-t-2 border-surface-container dark:border-[#2A2A2A]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-widest font-semibold hover:bg-primary transition-colors cursor-pointer"
          >
            Close Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
