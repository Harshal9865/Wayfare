import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EditorialLoader from "@/components/EditorialLoader";

export default function StaysLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#131313] transition-colors">
      <Navbar />
      <main className="flex-1 w-full pt-32 pb-20 flex flex-col items-center justify-center">
        <EditorialLoader
          size="lg"
          label="Loading Curated Sanctuaries..."
          sublabel="Volume IV — Preservation Grade Shelters"
        />
      </main>
      <Footer />
    </div>
  );
}
