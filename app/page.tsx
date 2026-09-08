"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import TrendingDestinations from "@/components/TrendingDestinations";
import CuratorsNote from "@/components/CuratorsNote";
import TravelReelsGallery from "@/components/TravelReelsGallery";
import LoginModal from "@/components/LoginModal";
import ItineraryAuthGate from "@/components/ItineraryAuthGate";

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Auth gate state: stores the pending destination + redirect URL
  const [authGate, setAuthGate] = useState<{
    isOpen: boolean;
    destination: string;
    redirectUrl: string;
  }>({ isOpen: false, destination: "", redirectUrl: "" });

  const handleRequireLogin = (destination: string, redirectUrl: string) => {
    setAuthGate({ isOpen: true, destination, redirectUrl });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#131313] transition-colors">
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} />

      <main className="flex-1 w-full pt-20">
        <HeroSearch onRequireLogin={handleRequireLogin} />
        <TrendingDestinations />
        <CuratorsNote />
        <TravelReelsGallery />
      </main>

      <Footer />

      {/* Standard login modal (from Navbar profile button) */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Itinerary auth gate — shown when unauthenticated user hits Search */}
      <ItineraryAuthGate
        isOpen={authGate.isOpen}
        onClose={() => setAuthGate((s) => ({ ...s, isOpen: false }))}
        destination={authGate.destination}
        redirectUrl={authGate.redirectUrl}
      />
    </div>
  );
}
