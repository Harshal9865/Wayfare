"use client";

import React from "react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[36px] md:rounded-[44px] p-6 md:p-10 shadow-2xl scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-surface-container dark:border-[#2A2A2A]">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-1">
              Beginner Guide • Simple 3-Step Walkthrough
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-on-surface dark:text-[#FAF7F2] font-normal">
              How Wayfare Helps You
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close guide"
            className="w-10 h-10 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#201F1F] flex items-center justify-center text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Intro banner for non-tech-savvy / first-time visitors */}
        <div className="p-4 mb-6 rounded-[24px] bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-[#1C2C28] dark:via-[#1A1A1A] dark:to-[#1C2C28] border-2 border-emerald-600/30 dark:border-[#1E8C80]/40 flex items-start gap-3">
          <span className="material-symbols-outlined text-2xl text-emerald-700 dark:text-[#1E8C80] shrink-0 mt-0.5">
            help_center
          </span>
          <div>
            <h4 className="font-sans text-sm font-semibold text-on-surface dark:text-[#FAF7F2]">
              New here? Welcome to WAYFARE!
            </h4>
            <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.8)] mt-0.5 leading-relaxed">
              Wayfare is your personal AI travel assistant. Tell us where you want to go (in India or anywhere in the world), and we generate a complete daily schedule with real open places, timings, pure vegetarian food spots, weather, and budget estimates!
            </p>
          </div>
        </div>

        {/* 3 Step Visual Guide */}
        <div className="space-y-4 mb-8">
          {/* Step 1 */}
          <div className="p-5 rounded-[28px] bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface/20 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] font-serif text-lg font-bold flex items-center justify-center shrink-0 border-2 border-on-surface dark:border-[#1E8C80]">
              1
            </div>
            <div>
              <h4 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-medium mb-1">
                Type Any Destination or Pick India / Abroad
              </h4>
              <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] leading-relaxed">
                Type any city like <strong>“Varanasi”</strong>, <strong>“Jaipur”</strong>, <strong>“Leh Ladakh”</strong>, or <strong>“Kyoto”</strong> in the search bar. You can toggle between <strong>🇮🇳 India</strong> or <strong>🌐 Abroad</strong> in the top navbar to customize suggestions.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-[28px] bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface/20 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] font-serif text-lg font-bold flex items-center justify-center shrink-0 border-2 border-on-surface dark:border-[#1E8C80]">
              2
            </div>
            <div>
              <h4 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-medium mb-1">
                Get an Authentic Daily Schedule with Food &amp; Timings
              </h4>
              <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] leading-relaxed">
                Our AI checks real Google Places data to build day-by-day plans. It shows optimal morning/evening light, <strong>Satvik / Pure-Veg food options</strong>, live weather forecasts, and walking distances between places.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-[28px] bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface/20 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] font-serif text-lg font-bold flex items-center justify-center shrink-0 border-2 border-on-surface dark:border-[#1E8C80]">
              3
            </div>
            <div>
              <h4 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-medium mb-1">
                Save to Phone, Split Group Bills via UPI, or Print!
              </h4>
              <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] leading-relaxed">
                Save your journey to your account, print it out for paper reference, or open the <strong>Expense Splitter</strong> to calculate group bills and pay instantly via Google Pay, PhonePe, or Paytm!
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 text-center">
          <div className="p-3 rounded-[16px] bg-surface-container-low dark:bg-[#201F1F] border border-on-surface/20 text-xs font-sans">
            <span className="material-symbols-outlined text-[20px] text-emerald-600 dark:text-emerald-400 block mb-1">verified</span>
            <span className="font-medium text-on-surface dark:text-[#FAF7F2]">100% Real Places</span>
          </div>
          <div className="p-3 rounded-[16px] bg-surface-container-low dark:bg-[#201F1F] border border-on-surface/20 text-xs font-sans">
            <span className="material-symbols-outlined text-[20px] text-amber-500 block mb-1">eco</span>
            <span className="font-medium text-on-surface dark:text-[#FAF7F2]">Pure Veg / Jain</span>
          </div>
          <div className="p-3 rounded-[16px] bg-surface-container-low dark:bg-[#201F1F] border border-on-surface/20 text-xs font-sans">
            <span className="material-symbols-outlined text-[20px] text-sky-500 block mb-1">payments</span>
            <span className="font-medium text-on-surface dark:text-[#FAF7F2]">UPI Settlement</span>
          </div>
          <div className="p-3 rounded-[16px] bg-surface-container-low dark:bg-[#201F1F] border border-on-surface/20 text-xs font-sans">
            <span className="material-symbols-outlined text-[20px] text-primary dark:text-[#1E8C80] block mb-1">wb_sunny</span>
            <span className="font-medium text-on-surface dark:text-[#FAF7F2]">Live Weather</span>
          </div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onClose}
          className="w-full py-4 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-widest font-semibold hover:bg-primary transition-all hover:scale-[1.01] cursor-pointer"
        >
          Got it! Start Exploring →
        </button>
      </div>
    </div>
  );
}
