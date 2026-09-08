"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import TrendingDestinations from "@/components/TrendingDestinations";
import CuratorsNote from "@/components/CuratorsNote";
import TravelReelsGallery from "@/components/TravelReelsGallery";
import LoginModal from "@/components/LoginModal";

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#131313] transition-colors">
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} />
      
      <main className="flex-1 w-full pt-20">
        <HeroSearch />
        <TrendingDestinations />
        <CuratorsNote />
        <TravelReelsGallery />
      </main>

      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
