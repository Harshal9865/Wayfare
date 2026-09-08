"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import GroupExpenseSplitterModal from "@/components/GroupExpenseSplitterModal";
import { supabase } from "@/lib/supabase";

interface JourneyCard {
  id: string;
  title: string;
  destination: string;
  period: string;
  status: "Drafting" | "Upcoming" | "Archived";
  stopsCount: number;
  staysCount: number;
  imageUrl: string;
  isCloudSynced?: boolean;
}

const INITIAL_JOURNEYS: JourneyCard[] = [
  {
    id: "kyoto-trip",
    title: "Kyoto & The Autumn Valleys",
    destination: "Kansai Region, Japan",
    period: "Departing in 12 Days · Oct 14 - 21",
    status: "Upcoming",
    stopsCount: 6,
    staysCount: 2,
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "varanasi-trip",
    title: "Sacred Dawn on the Ganga",
    destination: "Varanasi, India",
    period: "Target: Dev Deepawali Nov 2024",
    status: "Upcoming",
    stopsCount: 5,
    staysCount: 1,
    imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "lisbon-trip",
    title: "Lisbon & The Silver Coast",
    destination: "Atlantic Seaboard, Portugal",
    period: "Archived • May 2024",
    status: "Archived",
    stopsCount: 14,
    staysCount: 3,
    imageUrl: "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "oaxaca-trip",
    title: "Oaxaca & Sierra Sur",
    destination: "Central Valleys & Highlands",
    period: "Drafting Itinerary • Target: Feb 2025",
    status: "Drafting",
    stopsCount: 4,
    staysCount: 2,
    imageUrl: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&auto=format&fit=crop&q=80",
  },
];

export default function MyTripsView() {
  const [journeys, setJourneys] = useState<JourneyCard[]>(INITIAL_JOURNEYS);
  const [activeTab, setActiveTab] = useState("All Journeys");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSplitterTrip, setActiveSplitterTrip] = useState<JourneyCard | null>(null);

  useEffect(() => {
    async function loadUserTrips() {
      try {
        // 1. Load from localStorage
        let localJourneys: JourneyCard[] = [];
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("wayfare_saved_journeys");
          if (stored) {
            try {
              localJourneys = JSON.parse(stored);
            } catch (_) {}
          }
        }

        // 2. Load from Supabase if logged in
        let dbJourneys: JourneyCard[] = [];
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("trips")
            .select("*")
            .order("created_at", { ascending: false });

          if (!error && data && data.length > 0) {
            dbJourneys = data.map((t: any) => ({
              id: t.id,
              title: t.title || "Custom Voyage",
              destination: t.destination || "Curated Sanctuary",
              period: t.start_date
                ? `${new Date(t.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(t.end_date || t.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                : "Upcoming Journey",
              status: (t.status || "Upcoming") as "Drafting" | "Upcoming" | "Archived",
              stopsCount: 6,
              staysCount: 1,
              imageUrl:
                "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
              isCloudSynced: true,
            }));
          }
        }

        // Merge keeping precedence: DB -> localStorage -> Initial
        const map = new Map<string, JourneyCard>();
        INITIAL_JOURNEYS.forEach((j) => map.set(j.id, j));
        localJourneys.forEach((j) => map.set(j.id, { ...j, isCloudSynced: false }));
        dbJourneys.forEach((j) => map.set(j.id, j));

        setJourneys(Array.from(map.values()));
      } catch (err) {
        console.warn("Could not load custom journeys:", err);
      }
    }

    loadUserTrips();
  }, []);

  const tabs = ["All Journeys", "Upcoming", "Drafting", "Archived"];

  const filteredJourneys = useMemo(() => {
    return journeys.filter((journey) => {
      const matchesTab =
        activeTab === "All Journeys" ||
        (activeTab === "Upcoming" && journey.status === "Upcoming") ||
        (activeTab === "Drafting" && journey.status === "Drafting") ||
        (activeTab === "Archived" && journey.status === "Archived");

      const matchesSearch =
        journey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        journey.destination.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [journeys, activeTab, searchQuery]);

  const handleDeleteJourney = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to archive and remove this voyage folio?")) {
      setJourneys((prev) => prev.filter((j) => j.id !== id));
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("wayfare_saved_journeys");
        if (stored) {
          try {
            const parsed = JSON.parse(stored).filter((j: any) => j.id !== id);
            localStorage.setItem("wayfare_saved_journeys", JSON.stringify(parsed));
          } catch (_) {}
        }
      }
      try {
        await supabase.from("trips").delete().eq("id", id);
      } catch (_) {}
    }
  };

  const handleCloneJourney = (journey: JourneyCard, e: React.MouseEvent) => {
    e.stopPropagation();
    const cloned: JourneyCard = {
      ...journey,
      id: `clone-${Date.now()}`,
      title: `${journey.title} (Clone)`,
      status: "Drafting",
      period: "Drafting Itinerary • Cloned Template",
    };
    const updated = [cloned, ...journeys];
    setJourneys(updated);
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("wayfare_saved_journeys") || "[]");
        localStorage.setItem("wayfare_saved_journeys", JSON.stringify([cloned, ...stored]));
      } catch (_) {}
    }
  };

  return (
    <>
      <section className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] gap-4">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold">
              Atelier Portfolio • Voyager Dashboard
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-on-surface dark:text-[#FAF7F2] font-normal tracking-tight mt-1">
              My Journeys
            </h1>
            <p className="font-sans text-sm text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] mt-2">
              {journeys.length} custom folios recorded in your private atelier.
            </p>
          </div>

          {/* Search inside Journeys */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dossiers &amp; stays..."
                className="bg-surface-container-low dark:bg-[#1C1B1B] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-full px-4 py-2 pl-9 text-xs text-on-surface dark:text-[#FAF7F2] focus:outline-none w-64 shadow-subtle"
              />
              <span className="material-symbols-outlined text-[16px] text-outline absolute left-3 top-2.5">
                search
              </span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full border-2 font-sans text-xs uppercase tracking-wider transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                activeTab === tab
                  ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-on-surface dark:border-[#1E8C80] font-semibold"
                  : "bg-surface-container-low dark:bg-[#1C1B1B] text-on-surface dark:text-[#FAF7F2] border-on-surface dark:border-[rgba(250,247,242,0.3)] hover:bg-surface-container"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Journeys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Begin a New Journey Composer */}
          <div className="bg-surface-container-low dark:bg-[#1C1B1B] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[32px] p-8 flex flex-col justify-between group transition-all hover:border-primary">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] bg-surface-container-lowest dark:bg-[#201F1F] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px] text-primary dark:text-[#1E8C80]">add</span>
                </div>
                <span className="font-sans text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#201F1F] text-on-surface dark:text-[#FAF7F2]">
                  Custom Itinerary
                </span>
              </div>

              <span className="font-sans text-[10px] uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-1">
                White Glove Drafting
              </span>
              <h3 className="font-serif text-3xl text-on-surface dark:text-[#FAF7F2] font-normal mb-3">
                Begin a New Journey
              </h3>
              <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] leading-relaxed">
                Start fresh with dates, destinations, or quiet notes. Compose daily rituals, boutique stays, and transit logistics into a bespoke gazetteer.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t-2 border-on-surface/10 dark:border-[#2A2A2A] flex items-center justify-between">
              <span className="font-sans text-xs text-outline dark:text-[rgba(250,247,242,0.5)]">
                Instant AI Grounding
              </span>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-wider font-semibold hover:bg-primary transition-all hover:scale-105 active:scale-95"
              >
                <span>Compose Trip</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Saved Journey Cards with Expense Splitter & Clone Actions */}
          {filteredJourneys.map((journey) => (
            <article
              key={journey.id}
              className="bg-surface-container-lowest dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[32px] overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              {/* Image Banner */}
              <div className="relative h-56 w-full overflow-hidden bg-surface-container dark:bg-[#201F1F]">
                <img
                  src={journey.imageUrl}
                  alt={journey.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] bg-surface-container-lowest/90 dark:bg-[#131313]/90 font-sans text-[10px] uppercase tracking-wider font-semibold text-on-surface dark:text-[#FAF7F2]">
                    {journey.period}
                  </span>
                  {journey.isCloudSynced && (
                    <span className="px-2.5 py-1 rounded-full border border-primary/40 bg-surface-container-lowest/90 dark:bg-[#131313]/90 text-primary dark:text-[#1E8C80] font-sans text-[10px] uppercase tracking-wider font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">cloud_done</span>
                      <span>Cloud Synced</span>
                    </span>
                  )}
                </div>

                {/* Card Action Controls (Delete / Clone) */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleCloneJourney(journey, e)}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                    title="Clone trip template"
                  >
                    <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  </button>
                  <button
                    onClick={(e) => handleDeleteJourney(journey.id, e)}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                    title="Delete journey"
                  >
                    <span className="material-symbols-outlined text-[15px]">delete</span>
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <span className="font-sans text-xs uppercase tracking-wider text-outline dark:text-[rgba(250,247,242,0.5)] block mb-1">
                    {journey.destination}
                  </span>
                  <h3 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal mb-2 group-hover:text-primary dark:group-hover:text-[#1E8C80] transition-colors">
                    {journey.title}
                  </h3>
                </div>

                <div className="pt-4 mt-4 border-t-2 border-surface-container dark:border-[#2A2A2A] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="font-sans text-on-surface-variant dark:text-[rgba(250,247,242,0.7)]">
                    {journey.stopsCount} places · {journey.staysCount} stays
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Expense Splitter Trigger */}
                    <button
                      type="button"
                      onClick={() => setActiveSplitterTrip(journey)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-on-surface/20 hover:border-primary text-primary dark:text-[#1E8C80] font-sans font-medium text-[11px] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">payments</span>
                      <span>Splitter</span>
                    </button>

                    <Link
                      href={`/itinerary?location=${encodeURIComponent(journey.title.split(" &")[0])}`}
                      className="inline-flex items-center gap-1 font-sans text-primary dark:text-[#1E8C80] font-semibold hover:underline"
                    >
                      <span>View Itinerary</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Gazette Excerpts */}
        <div className="pt-8 border-t-2 border-on-surface dark:border-[rgba(250,247,242,0.25)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="font-sans text-xs uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block">
                Gazette Excerpts
              </span>
              <h4 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal">
                Field Notes &amp; Preparation Guides
              </h4>
            </div>
            <Link
              href="#"
              className="font-sans text-xs uppercase tracking-wider text-primary dark:text-[#1E8C80] font-semibold hover:underline"
            >
              Browse Library Archive →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Rhythm of the Ryokan: Etiquette of Thermal Bathing",
                desc: "A quiet inquiry into the restorative mechanics of hot spring water and seasonal kaiseki.",
                readTime: "6 min read",
              },
              {
                title: "Glazed Terracotta: Preserving Portuguese Azulejos",
                desc: "Documenting historic artisanal workshops in the Mouraria district revitalizing hand-painted ceramic craft.",
                readTime: "4 min read",
              },
              {
                title: "The Unburdened Luggage: Capsule Wardrobes for Rail",
                desc: "Selecting unadorned raw woods, Japanese poplin shirts, and minimal camera equipment for multi-leg journeys.",
                readTime: "8 min read",
              },
            ].map((guide, idx) => (
              <div
                key={idx}
                className="p-6 rounded-[24px] bg-surface-container-low dark:bg-[#1C1B1B] border-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] flex flex-col justify-between hover:border-primary transition-colors cursor-pointer group"
              >
                <div>
                  <h5 className="font-serif text-lg text-on-surface dark:text-[#FAF7F2] font-normal mb-2 group-hover:text-primary dark:group-hover:text-[#1E8C80] transition-colors">
                    {guide.title}
                  </h5>
                  <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] leading-relaxed">
                    {guide.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t-2 border-surface-container dark:border-[#2A2A2A] flex items-center justify-between text-[11px] text-outline dark:text-[rgba(250,247,242,0.5)]">
                  <span>{guide.readTime}</span>
                  <span className="font-medium text-on-surface dark:text-[#FAF7F2] group-hover:translate-x-1 transition-transform">
                    Read Guide →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Group Expense Splitter Modal */}
      {activeSplitterTrip && (
        <GroupExpenseSplitterModal
          isOpen={true}
          onClose={() => setActiveSplitterTrip(null)}
          tripTitle={activeSplitterTrip.title}
        />
      )}
    </>
  );
}
