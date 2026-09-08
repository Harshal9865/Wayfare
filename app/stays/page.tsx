"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StaysListing from "@/components/StaysListing";
import LoginModal from "@/components/LoginModal";

export default function StaysPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#131313] transition-colors">
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} />
      
      <main className="flex-1 w-full pt-20">
        <StaysListing />
      </main>

      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
