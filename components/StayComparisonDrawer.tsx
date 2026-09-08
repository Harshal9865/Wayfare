"use client";

import React from "react";
import { buildBookingAffiliateUrl } from "@/lib/utils";

export interface StayComparisonItem {
  id: string;
  name: string;
  location: string;
  rating: string;
  pricePerNight: string;
  category: string;
  silenceScore: number;
  distanceToHeritage: string;
  perks: string;
  imageUrl: string;
}

interface StayComparisonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStays: StayComparisonItem[];
  onRemoveStay: (id: string) => void;
}

export default function StayComparisonDrawer({
  isOpen,
  onClose,
  selectedStays,
  onRemoveStay,
}: StayComparisonDrawerProps) {
  if (!isOpen || selectedStays.length === 0) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6 bg-black/50 backdrop-blur-sm animate-in slide-in-from-bottom duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl mx-auto bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[36px] p-6 md:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-surface-container dark:border-[#2A2A2A]">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-1">
              Comparative Analysis Matrix
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-on-surface dark:text-[#FAF7F2] font-normal">
              Compare Curated Shelters ({selectedStays.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close comparison"
            className="w-9 h-9 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#201F1F] flex items-center justify-center text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-2">
          {selectedStays.map((stay) => (
            <div
              key={stay.id}
              className="p-5 rounded-[24px] bg-surface-container-low dark:bg-[#201F1F] border-2 border-on-surface/30 dark:border-[rgba(250,247,242,0.25)] flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="relative h-40 w-full rounded-[18px] overflow-hidden border-2 border-on-surface/20 mb-3">
                  <img
                    src={stay.imageUrl}
                    alt={stay.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onRemoveStay(stay.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center text-xs hover:bg-black cursor-pointer"
                    title="Remove from comparison"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>

                <span className="font-sans text-[10px] uppercase tracking-wider text-outline dark:text-[rgba(250,247,242,0.5)] block">
                  {stay.category} · {stay.location}
                </span>
                <h4 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-normal mt-0.5 truncate">
                  {stay.name}
                </h4>
              </div>

              {/* Metrics Matrix */}
              <div className="space-y-2 text-xs font-sans">
                <div className="flex items-center justify-between pb-1.5 border-b border-on-surface/10">
                  <span className="text-on-surface-variant dark:text-[rgba(250,247,242,0.6)]">Rate</span>
                  <span className="font-semibold text-primary dark:text-[#1E8C80]">{stay.pricePerNight}</span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-on-surface/10">
                  <span className="text-on-surface-variant dark:text-[rgba(250,247,242,0.6)]">Silence Score</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {stay.silenceScore}/100 Quiet
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-on-surface/10">
                  <span className="text-on-surface-variant dark:text-[rgba(250,247,242,0.6)]">To Sanctuary</span>
                  <span className="font-medium text-on-surface dark:text-[#FAF7F2]">{stay.distanceToHeritage}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant dark:text-[rgba(250,247,242,0.6)]">Perks</span>
                  <span className="font-medium text-on-surface dark:text-[#FAF7F2] truncate max-w-[150px]">{stay.perks}</span>
                </div>
              </div>

              {/* Outbound Booking CTA */}
              <a
                href={buildBookingAffiliateUrl(stay.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-wider font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Reserve via Partner</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
