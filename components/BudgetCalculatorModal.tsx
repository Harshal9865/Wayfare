"use client";

import React, { useState } from "react";
import { BudgetBreakdown } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { useCurrency } from "@/lib/currency";

interface BudgetCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  days: number;
  travelersCount: number;
  tripStyle: string;
}

export default function BudgetCalculatorModal({
  isOpen,
  onClose,
  days,
  travelersCount,
  tripStyle,
}: BudgetCalculatorModalProps) {
  const { formatPrice } = useCurrency();
  const [tier, setTier] = useState<"backpacker" | "moderate" | "heritage">(
    tripStyle === "backpacker" ? "backpacker" : tripStyle === "family" ? "heritage" : "moderate"
  );

  if (!isOpen) return null;

  // Dynamic cost estimates based on tier
  const rates = {
    backpacker: { stayPerNight: 1200, mealPerDay: 500, transportPerDay: 250, passPerDay: 200 },
    moderate: { stayPerNight: 4500, mealPerDay: 1200, transportPerDay: 600, passPerDay: 400 },
    heritage: { stayPerNight: 12000, mealPerDay: 2500, transportPerDay: 1500, passPerDay: 800 },
  };

  const selectedRate = rates[tier];
  const totalStays = selectedRate.stayPerNight * Math.max(1, days - 1);
  const totalMeals = selectedRate.mealPerDay * days * travelersCount;
  const totalTransport = selectedRate.transportPerDay * days;
  const totalPasses = selectedRate.passPerDay * days * travelersCount;
  const totalMin = Math.round((totalStays + totalMeals + totalTransport + totalPasses) * 0.9);
  const totalMax = Math.round((totalStays + totalMeals + totalTransport + totalPasses) * 1.15);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[36px] p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-surface-container dark:border-[#2A2A2A]">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-1">
              Estimated Expedition Outlay
            </span>
            <h3 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal">
              Budget Estimator
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

        {/* Tier Selector */}
        <div className="flex rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] p-1 bg-surface-container-low dark:bg-[#201F1F] mb-6">
          {(["backpacker", "moderate", "heritage"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`flex-1 py-1.5 rounded-full font-sans text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                tier === t
                  ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80]"
                  : "text-on-surface-variant dark:text-[rgba(250,247,242,0.6)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Cost Breakdown Items */}
        <div className="space-y-3 mb-6 font-sans text-xs">
          <div className="flex items-center justify-between p-3 bg-surface-container-lowest dark:bg-[#201F1F] rounded-[16px] border-2 border-on-surface dark:border-[rgba(250,247,242,0.2)]">
            <span className="text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">hotel</span>
              Accommodations ({days - 1} Nights)
            </span>
            <span className="font-semibold text-on-surface dark:text-[#FAF7F2]">
              {formatPrice(totalStays)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-surface-container-lowest dark:bg-[#201F1F] rounded-[16px] border-2 border-on-surface dark:border-[rgba(250,247,242,0.2)]">
            <span className="text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">restaurant</span>
              Dining &amp; Tea ({travelersCount} Travelers)
            </span>
            <span className="font-semibold text-on-surface dark:text-[#FAF7F2]">
              {formatPrice(totalMeals)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-surface-container-lowest dark:bg-[#201F1F] rounded-[16px] border-2 border-on-surface dark:border-[rgba(250,247,242,0.2)]">
            <span className="text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">directions_transit</span>
              Corridor Transit &amp; Autos
            </span>
            <span className="font-semibold text-on-surface dark:text-[#FAF7F2]">
              {formatPrice(totalTransport)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-surface-container-lowest dark:bg-[#201F1F] rounded-[16px] border-2 border-on-surface dark:border-[rgba(250,247,242,0.2)]">
            <span className="text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
              Heritage Passes &amp; Boat Charters
            </span>
            <span className="font-semibold text-on-surface dark:text-[#FAF7F2]">
              {formatPrice(totalPasses)}
            </span>
          </div>
        </div>

        {/* Total Estimate Band */}
        <div className="p-4 bg-surface-container-low dark:bg-[#222222] rounded-[24px] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] flex items-center justify-between mb-4">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.5)] block">
              Estimated Total Band
            </span>
            <span className="font-serif text-2xl text-primary dark:text-[#1E8C80] font-normal">
              {formatPrice(totalMin)} – {formatPrice(totalMax)}
            </span>
          </div>
          <span className="font-sans text-[10px] uppercase tracking-wider text-outline dark:text-[rgba(250,247,242,0.5)] max-w-[120px] text-right">
            *Always an estimate, not a live fixed fee
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-widest font-semibold hover:bg-primary transition-colors cursor-pointer"
        >
          Confirm &amp; Apply to Dossier
        </button>
      </div>
    </div>
  );
}
