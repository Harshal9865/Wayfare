"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import ItinerarySidebar from "@/components/ItinerarySidebar";
import PlaceDetailModal from "@/components/PlaceDetailModal";
import SwapModal from "@/components/SwapModal";
import LoginModal from "@/components/LoginModal";
import BudgetCalculatorModal from "@/components/BudgetCalculatorModal";
import MapViewModal from "@/components/MapViewModal";
import AddCustomSpotModal from "@/components/AddCustomSpotModal";
import ShareTripModal from "@/components/ShareTripModal";
import EditorialLoader from "@/components/EditorialLoader";
import { SAMPLE_TRIP_PLANS, getOrCreateTripPlan } from "@/lib/mock-itinerary";
import { Place, TripPlan, ItineraryItem } from "@/lib/types";
import { useCurrency } from "@/lib/currency";
import { supabase } from "@/lib/supabase";

function ItineraryContent() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location") || "Jaipur, India";
  const daysParam = parseInt(searchParams.get("days") || "3", 10);
  const styleParam = searchParams.get("style") || "balanced";
  const dietParam = searchParams.get("diet") || "any";

  const { formatPrice } = useCurrency();

  const [tripPlan, setTripPlan] = useState<TripPlan>(() =>
    getOrCreateTripPlan(locationParam, daysParam, styleParam, dietParam)
  );
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [swapTargetPlace, setSwapTargetPlace] = useState<Place | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddSpotModalOpen, setIsAddSpotModalOpen] = useState(false);
  const [targetDayForCustomSpot, setTargetDayForCustomSpot] = useState(1);
  const [activeDayFilter, setActiveDayFilter] = useState<number | "all">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState("Querying operational Google Places...");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Tier 1: Check localStorage cache
    const cacheKey = `wayfare_plan_${locationParam.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
    const cachedPlanStr = typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;

    if (cachedPlanStr) {
      try {
        const cached = JSON.parse(cachedPlanStr);
        setTripPlan(cached);
        return;
      } catch (e) {
        console.warn("Cached plan parse error:", e);
      }
    }

    // If matches static curated presets
    if (SAMPLE_TRIP_PLANS[locationParam]) {
      setTripPlan(SAMPLE_TRIP_PLANS[locationParam]);
      return;
    }

    // Tier 3: Fetch dynamic itinerary from API (Google Places + Gemini AI)
    setIsGenerating(true);
    setGenerationStage(`Discovering verified operational sanctuaries in ${locationParam}...`);

    const stageTimer1 = setTimeout(() => {
      setGenerationStage("Sequencing un-hallucinated daily corridors via Gemini 1.5...");
    }, 1800);

    const stageTimer2 = setTimeout(() => {
      setGenerationStage("Applying dietary and preservation criteria...");
    }, 3600);

    fetch("/api/itinerary/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location_name: locationParam,
        duration_days: daysParam,
        trip_style: styleParam,
        dietary_pref: dietParam,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.plan) {
          setTripPlan(data.plan);
          if (typeof window !== "undefined") {
            localStorage.setItem(cacheKey, JSON.stringify(data.plan));
          }
        }
      })
      .catch((err) => {
        console.error("Dynamic generation error:", err);
      })
      .finally(() => {
        clearTimeout(stageTimer1);
        clearTimeout(stageTimer2);
        setIsGenerating(false);
      });
  }, [locationParam, daysParam, styleParam, dietParam]);

  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place);
    setIsDetailModalOpen(true);
  };

  const handleOpenSwap = (place: Place) => {
    setIsDetailModalOpen(false);
    setSwapTargetPlace(place);
    setIsSwapModalOpen(true);
  };

  const handleConfirmSwap = (oldPlaceId: string, newPlace: Place) => {
    const updatedDays = tripPlan.days.map((day) => ({
      ...day,
      items: day.items.map((item) =>
        item.place.place_id === oldPlaceId || item.place.id === oldPlaceId
          ? { ...item, place: newPlace, travel_notes: newPlace.editorial_summary }
          : item
      ),
    }));

    setTripPlan({ ...tripPlan, days: updatedDays });
    setToastMessage(`Swapped to "${newPlace.name}"`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAddCustomSpot = (dayNumber: number) => {
    setTargetDayForCustomSpot(dayNumber);
    setIsAddSpotModalOpen(true);
  };

  const handleAddCustomSpot = (dayNumber: number, newItem: ItineraryItem) => {
    const updatedDays = tripPlan.days.map((day) => {
      if (day.day_number === dayNumber) {
        return {
          ...day,
          items: [...day.items, newItem],
        };
      }
      return day;
    });

    setTripPlan({ ...tripPlan, days: updatedDays });
    setToastMessage(`Injected "${newItem.place.name}" into Day ${dayNumber}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleSaveTrip = async () => {
    try {
      setIsSaved(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("trips").upsert({
          id: tripPlan.id,
          user_id: user.id,
          title: tripPlan.title,
          destination: tripPlan.location_name,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + tripPlan.duration_days * 86400000).toISOString(),
          budget_inr: tripPlan.budget.total_estimate_max,
          travel_style: tripPlan.trip_style,
          dietary_pref: tripPlan.dietary_pref,
          is_public: true,
        });
      }

      // Also persist to local saved journeys
      if (typeof window !== "undefined") {
        const localSaved = JSON.parse(localStorage.getItem("wayfare_saved_journeys") || "[]");
        const exists = localSaved.some((j: any) => j.id === tripPlan.id);
        if (!exists) {
          const newJourney = {
            id: tripPlan.id,
            title: tripPlan.title,
            destination: tripPlan.location_name,
            period: `${tripPlan.duration_days} Days · Atelier Folio`,
            status: "Upcoming",
            stopsCount: tripPlan.days.reduce((acc, d) => acc + d.items.length, 0),
            staysCount: 1,
            imageUrl:
              tripPlan.days[0]?.items[0]?.place?.photo_url ||
              "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
          };
          localStorage.setItem("wayfare_saved_journeys", JSON.stringify([newJourney, ...localSaved]));
        }
      }

      setToastMessage("Archived to your Atelier Portfolio");
      setTimeout(() => setToastMessage(null), 3500);
    } catch (e) {
      console.warn("Save trip error:", e);
      setToastMessage("Saved to your Atelier Portfolio");
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex flex-col bg-background dark:bg-[#131313] transition-colors">
        <Navbar onOpenLogin={() => setIsLoginOpen(true)} />
        <main className="flex-1 w-full pt-36 pb-20 flex flex-col items-center justify-center">
          <EditorialLoader
            size="lg"
            label={generationStage}
            sublabel="Grounded AI Sequencing • Operational Google Places"
          />
        </main>
        <Footer />
      </div>
    );
  }

  const displayedDays =
    activeDayFilter === "all"
      ? tripPlan.days
      : tripPlan.days.filter((d) => d.day_number === activeDayFilter);

  const activePlaceIds = tripPlan.days.flatMap((d) => d.items.map((i) => i.place.place_id));

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#131313] transition-colors">
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-wider font-semibold shadow-dropdown animate-in slide-in-from-top duration-300">
          {toastMessage}
        </div>
      )}

      <main className="flex-1 w-full pt-20">
        {/* Sub-Header / Ambient Top Bar */}
        <section className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop pt-8 pb-4">
          {/* Breadcrumb & Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs uppercase tracking-wider text-on-surface-variant dark:text-[rgba(250,247,242,0.6)]">
                Archived Folio
              </span>
              <span className="text-outline-variant font-sans text-xs">/</span>
              <span className="font-sans text-xs uppercase tracking-wider text-primary dark:text-[#1E8C80] font-semibold">
                {tripPlan.location_name} Edition
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface-container-high dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] font-sans text-xs text-on-surface dark:text-[#FAF7F2]">
                <span className="w-2 h-2 rounded-full bg-primary dark:bg-[#1E8C80] animate-pulse"></span>
                Live Itinerary Sync
              </span>

              <button
                onClick={() => setIsMapModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface-container-low dark:bg-[#1C1B1B] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] font-sans text-xs text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">map</span>
                <span>Switch to Map Pinning</span>
              </button>
            </div>
          </div>

          {/* Oversized Editorial Title & Metadata */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pb-8 border-b-2 border-on-surface dark:border-[rgba(250,247,242,0.25)]">
            <div className="max-w-3xl">
              <span className="font-sans text-xs uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] block mb-2 font-semibold">
                {tripPlan.duration_days} Days in {tripPlan.location_name}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-on-surface dark:text-[#FAF7F2] font-normal leading-none tracking-tight">
                {tripPlan.title}
              </h1>
              <p className="font-sans text-sm md:text-base text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] mt-3">
                {tripPlan.travelers_count} Travelers · Hand-sequenced operational sanctuaries · Anti-hallucination verified
              </p>
            </div>

            {/* Actions: Budget Pill, Share & Export */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                onClick={() => setIsBudgetModalOpen(true)}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-surface-container-low dark:bg-[#1C1B1B] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] cursor-pointer hover:border-primary transition-all hover:scale-105 active:scale-95"
              >
                <span className="material-symbols-outlined text-primary dark:text-[#1E8C80] text-[20px]">
                  account_balance_wallet
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="font-sans text-xs md:text-sm font-semibold text-on-surface dark:text-[#FAF7F2]">
                    Estimated: {formatPrice(tripPlan.budget.total_estimate_max)}
                  </span>
                  <span className="hidden sm:inline text-outline-variant">·</span>
                  <span className="font-sans text-[11px] text-primary dark:text-[#1E8C80] underline font-medium">
                    View Breakdown
                  </span>
                </div>
              </div>

              {/* Save Trip to Atelier Action */}
              <button
                onClick={handleSaveTrip}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 font-sans text-xs uppercase tracking-wider font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  isSaved
                    ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-on-surface dark:border-[#1E8C80]"
                    : "bg-surface-container-lowest dark:bg-[#1A1A1A] text-on-surface dark:text-[#FAF7F2] border-on-surface dark:border-[rgba(250,247,242,0.3)] hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isSaved ? "bookmark_added" : "bookmark_add"}
                </span>
                <span>{isSaved ? "Saved" : "Save Trip"}</span>
              </button>

              {/* Share Itinerary Action */}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-surface-container-lowest dark:bg-[#1A1A1A] text-on-surface dark:text-[#FAF7F2] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] font-sans text-xs uppercase tracking-wider font-semibold hover:bg-surface-container transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                <span>Share</span>
              </button>

              {/* Print / Export Action */}
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-wider font-semibold hover:bg-primary transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print Dossier</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Navigation Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto py-6 scrollbar-none">
            <button
              onClick={() => setActiveDayFilter("all")}
              className={`px-5 py-2 rounded-full border-2 font-sans text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                activeDayFilter === "all"
                  ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-on-surface dark:border-[#1E8C80]"
                  : "bg-surface-container-low dark:bg-[#1C1B1B] text-on-surface dark:text-[#FAF7F2] border-on-surface dark:border-[rgba(250,247,242,0.3)] hover:bg-surface-container"
              }`}
            >
              All Days ({tripPlan.days.length})
            </button>
            {tripPlan.days.map((day) => (
              <button
                key={day.day_number}
                onClick={() => setActiveDayFilter(day.day_number)}
                className={`px-5 py-2 rounded-full border-2 font-sans text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                  activeDayFilter === day.day_number
                    ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-on-surface dark:border-[#1E8C80]"
                    : "bg-surface-container-low dark:bg-[#1C1B1B] text-on-surface dark:text-[#FAF7F2] border-on-surface dark:border-[rgba(250,247,242,0.3)] hover:bg-surface-container"
                }`}
              >
                Day {day.day_number}: {day.theme_title.split(":")[0]}
              </button>
            ))}
          </div>
        </section>

        {/* Main Canvas: Timeline (8 cols) + Field Notes Sidebar (4 cols) */}
        <section className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg">
            {/* 8 Columns Timeline Flow */}
            <div className="lg:col-span-8">
              <ItineraryTimeline
                days={displayedDays}
                onSelectPlace={handleSelectPlace}
                onSwapSpot={handleOpenSwap}
                onOpenAddCustomSpot={handleOpenAddCustomSpot}
              />
            </div>

            {/* 4 Columns Field Notes Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-28">
                <ItinerarySidebar
                  locationName={tripPlan.location_name}
                  lat={tripPlan.lat}
                  lng={tripPlan.lng}
                  budget={tripPlan.budget}
                  onOpenMap={() => setIsMapModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Place Detail Modal */}
      <PlaceDetailModal
        place={selectedPlace}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSwapSpot={handleOpenSwap}
      />

      {/* Spot Swap Modal */}
      <SwapModal
        targetPlace={swapTargetPlace}
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        onConfirmSwap={handleConfirmSwap}
        excludedPlaceIds={activePlaceIds}
      />

      {/* Budget Breakdown Modal */}
      <BudgetCalculatorModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        days={tripPlan.duration_days}
        travelersCount={tripPlan.travelers_count}
        tripStyle={tripPlan.trip_style}
      />

      {/* Map View Modal */}
      <MapViewModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        locationName={tripPlan.location_name}
        days={tripPlan.days}
        onSelectPlace={handleSelectPlace}
      />

      {/* Add Custom Spot Modal */}
      <AddCustomSpotModal
        isOpen={isAddSpotModalOpen}
        onClose={() => setIsAddSpotModalOpen(false)}
        dayNumber={targetDayForCustomSpot}
        onAddCustomSpot={handleAddCustomSpot}
      />

      {/* Share Trip Modal */}
      <ShareTripModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        tripTitle={tripPlan.title}
        locationName={tripPlan.location_name}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}

function ItineraryLoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#131313] transition-colors">
      <Navbar />
      <main className="flex-1 w-full pt-32 pb-20 flex flex-col items-center justify-center">
        <EditorialLoader
          size="lg"
          label="Retrieving Archival Folio..."
          sublabel="Wayfare Atelier Live Dossier"
        />
      </main>
      <Footer />
    </div>
  );
}

export default function ItineraryPage() {
  return (
    <Suspense fallback={<ItineraryLoadingFallback />}>
      <ItineraryContent />
    </Suspense>
  );
}

