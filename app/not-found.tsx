"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";

export default function NotFound() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#131313] transition-colors">
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} />

      <main className="flex-1 flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-lg">
          {/* Large editorial 404 */}
          <div className="relative mb-8 select-none">
            <span className="font-serif text-[160px] sm:text-[200px] leading-none text-on-surface/5 dark:text-[rgba(250,247,242,0.04)] font-normal">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[64px] text-primary dark:text-[#1E8C80]">
                travel_explore
              </span>
            </div>
          </div>

          {/* Editorial stamp */}
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#1C1B1B]">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="font-sans text-xs uppercase tracking-widest text-on-surface dark:text-[#FAF7F2] font-medium">
              Route Not Found
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl text-on-surface dark:text-[#FAF7F2] font-normal leading-tight mb-4">
            This trail doesn't exist.
          </h1>
          <p className="font-sans text-sm text-on-surface-variant dark:text-[rgba(250,247,242,0.65)] leading-relaxed mb-8">
            The page you're looking for has either moved, been archived, or never existed. Perhaps the destination you seek is yet undiscovered.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] px-6 py-3 rounded-full border-2 border-on-surface dark:border-[#1E8C80] font-sans text-sm font-semibold hover:bg-primary dark:hover:bg-[#1A7A70] transition-all hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              Return Home
            </Link>
            <Link
              href="/itinerary"
              className="inline-flex items-center gap-2 bg-surface-container-lowest dark:bg-[#1A1A1A] text-on-surface dark:text-[#FAF7F2] px-6 py-3 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] font-sans text-sm font-medium hover:bg-surface-container dark:hover:bg-[#2A2A2A] transition-all hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">map</span>
              Plan a Trip
            </Link>
          </div>

          {/* Suggested destinations */}
          <div className="mt-10 pt-8 border-t-2 border-surface-container dark:border-[#2A2A2A]">
            <span className="font-sans text-xs uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.5)] block mb-4">
              Try these instead
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {["Varanasi", "Leh Ladakh", "Kerala Backwaters", "Jaipur", "Rishikesh"].map((dest) => (
                <Link
                  key={dest}
                  href={`/itinerary?location=${encodeURIComponent(dest + ", India")}`}
                  className="font-sans text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full border-2 border-on-surface/20 dark:border-[rgba(250,247,242,0.2)] bg-surface-container-low dark:bg-[#1C1B1B] text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container dark:hover:bg-[#2A2A2A] transition-all hover:scale-105 cursor-pointer"
                >
                  {dest}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
