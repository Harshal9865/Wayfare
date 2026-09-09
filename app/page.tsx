"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import StatsStrip from "@/components/StatsStrip";
import TrendingDestinations from "@/components/TrendingDestinations";
import CuratorsNote from "@/components/CuratorsNote";
import Testimonials from "@/components/Testimonials";
import TravelReelsGallery from "@/components/TravelReelsGallery";
import NewsletterSignup from "@/components/NewsletterSignup";
import LoginModal from "@/components/LoginModal";
import ItineraryAuthGate from "@/components/ItineraryAuthGate";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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

      <main id="main-content" className="flex-1 w-full pt-20">
        {/* Hero search */}
        <HeroSearch onRequireLogin={handleRequireLogin} />

        {/* Trust metrics strip */}
        <StatsStrip />

        {/* Trending destinations */}
        <ErrorBoundary sectionName="Trending Destinations">
          <TrendingDestinations />
        </ErrorBoundary>

        {/* Editorial curator's note */}
        <ErrorBoundary sectionName="Curator's Note">
          <CuratorsNote />
        </ErrorBoundary>

        {/* Testimonials / social proof */}
        <ErrorBoundary sectionName="Traveler Reviews">
          <Testimonials />
        </ErrorBoundary>

        {/* Video reels & atmosphere */}
        <ErrorBoundary sectionName="Travel Reels">
          <TravelReelsGallery />
        </ErrorBoundary>

        {/* Newsletter signup */}
        <NewsletterSignup />
      </main>

      <Footer />

      {/* Standard login modal (from Navbar profile button) */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Auth gate — shown when unauthenticated user tries to plan a trip */}
      <ItineraryAuthGate
        isOpen={authGate.isOpen}
        destination={authGate.destination}
        redirectUrl={authGate.redirectUrl}
        onClose={() => setAuthGate((s) => ({ ...s, isOpen: false }))}
      />
    </div>
  );
}
