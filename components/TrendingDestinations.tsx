"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRegion } from "@/lib/region";

interface DestinationCard {
  id: string;
  name: string;
  region: string;
  tag: string;
  stayDuration: string;
  estPrice: string;
  description: string;
  imageUrl: string;
  query: string;
  bestSeason: string;
  heritageScore: number;
}

const GLOBAL_DESTINATIONS: DestinationCard[] = [
  {
    id: "kyoto",
    name: "Kyoto, Japan",
    region: "Kansai Region",
    tag: "Autumn foliage",
    stayDuration: "Avg. Stay • 6 Nights",
    estPrice: "From $340 / d",
    description: "Quiet temple corridors, morning tea ceremonies in Uji, and golden cedar forests drenched in autumn rain.",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
    query: "Kyoto, Japan",
    bestSeason: "Oct – Dec",
    heritageScore: 98,
  },
  {
    id: "lisbon",
    name: "Lisbon, Portugal",
    region: "Estremadura Coast",
    tag: "Coastal heritage",
    stayDuration: "Avg. Stay • 4 Nights",
    estPrice: "From $260 / d",
    description: "Sun-bleached limestone alleys, fado echoing across Alfama, and vibrant natural wine taverns along the Tagus.",
    imageUrl: "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800&auto=format&fit=crop&q=80",
    query: "Lisbon, Portugal",
    bestSeason: "Apr – Oct",
    heritageScore: 94,
  },
  {
    id: "oaxaca",
    name: "Oaxaca, Mexico",
    region: "Central Valleys",
    tag: "Culinary & Clay",
    stayDuration: "Avg. Stay • 7 Nights",
    estPrice: "From $210 / d",
    description: "Artisan weaving hamlets, centuries-old mezcal palenques, and smoky street markets laden with heirloom herbs.",
    imageUrl: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&auto=format&fit=crop&q=80",
    query: "Oaxaca, Mexico",
    bestSeason: "Oct – Feb",
    heritageScore: 96,
  },
  {
    id: "tangier",
    name: "Tangier, Morocco",
    region: "Strait of Gibraltar",
    tag: "Bohemian Port",
    stayDuration: "Avg. Stay • 5 Nights",
    estPrice: "From $290 / d",
    description: "Literary cafes overlooking maritime straits, fragrant spice-merchant bazaars, and whitewashed kasbahs.",
    imageUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&auto=format&fit=crop&q=80",
    query: "Tangier, Morocco",
    bestSeason: "May – Oct",
    heritageScore: 92,
  },
  {
    id: "amorgos",
    name: "Amorgos, Greece",
    region: "Aegean Archipelago",
    tag: "Cycladic Isolation",
    stayDuration: "Avg. Stay • 6 Nights",
    estPrice: "From $245 / d",
    description: "Cliffside whitewashed monasteries clinging to sheer gorges, ancient goat paths, and cobalt crystalline bays.",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80",
    query: "Amorgos, Greece",
    bestSeason: "Jun – Sep",
    heritageScore: 95,
  },
  {
    id: "amalfi",
    name: "Amalfi Coast, Italy",
    region: "Tyrrhenian Coast",
    tag: "Cliffside Terraces",
    stayDuration: "Avg. Stay • 5 Nights",
    estPrice: "From $380 / d",
    description: "Lemon groves overhanging turquoise coves, pastel villas clinging to vertical cliffs, and coastal boat cruises.",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80",
    query: "Amalfi, Italy",
    bestSeason: "May – Oct",
    heritageScore: 97,
  },
];

const INDIAN_DESTINATIONS: DestinationCard[] = [
  {
    id: "varanasi",
    name: "Varanasi, India",
    region: "Ganga Valley",
    tag: "Sacred Aarti & Ghats",
    stayDuration: "Avg. Stay • 3 Nights",
    estPrice: "From ₹3,500 / d",
    description: "Dawn rowing past ancient ghats, resonant chants of evening Ganga Aarti, silk weavers, and labyrinthine alleys.",
    imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
    query: "Varanasi, India",
    bestSeason: "Nov – Mar",
    heritageScore: 99,
  },
  {
    id: "rishikesh",
    name: "Rishikesh, India",
    region: "Himalayan Foothills",
    tag: "Yoga & River Rafting",
    stayDuration: "Avg. Stay • 4 Nights",
    estPrice: "From ₹2,800 / d",
    description: "Serene ashrams along the emerald river Ganges, sunrise yoga over suspended bridges, and satvik organic cafes.",
    imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
    query: "Rishikesh, India",
    bestSeason: "Sep – Apr",
    heritageScore: 96,
  },
  {
    id: "ladakh",
    name: "Leh Ladakh, India",
    region: "Trans-Himalayas",
    tag: "High Mountain Passes",
    stayDuration: "Avg. Stay • 6 Nights",
    estPrice: "From ₹4,500 / d",
    description: "Stark mountain deserts, ancient Buddhist gompas, vibrant prayer flags fluttering over Pangong Tso lake.",
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
    query: "Leh Ladakh, India",
    bestSeason: "May – Sep",
    heritageScore: 97,
  },
  {
    id: "kerala",
    name: "Alleppey, Kerala",
    region: "Vembanad Backwaters",
    tag: "Houseboats & Spices",
    stayDuration: "Avg. Stay • 4 Nights",
    estPrice: "From ₹3,800 / d",
    description: "Gliding through palm-fringed backwater canals on traditional Kettuvallam houseboats with authentic Sadya feasts.",
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
    query: "Alleppey, India",
    bestSeason: "Oct – Mar",
    heritageScore: 95,
  },
  {
    id: "jaipur",
    name: "Jaipur, Rajasthan",
    region: "Royal Heritage",
    tag: "Forts & Palaces",
    stayDuration: "Avg. Stay • 4 Nights",
    estPrice: "From ₹4,200 / d",
    description: "Terracotta havelis, amber fort sunsets, block-print textile artisans, and regal Rajasthani cuisine.",
    imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80",
    query: "Jaipur, India",
    bestSeason: "Oct – Mar",
    heritageScore: 98,
  },
  {
    id: "hampi",
    name: "Hampi, Karnataka",
    region: "Vijayanagara Ruins",
    tag: "Boulder Landscapes",
    stayDuration: "Avg. Stay • 3 Nights",
    estPrice: "From ₹2,500 / d",
    description: "Surreal granite boulder fields, carved stone chariots, coracle boat rides on the Tungabhadra river.",
    imageUrl: "https://images.unsplash.com/photo-1600100397608-f010e423b971?w=800&auto=format&fit=crop&q=80",
    query: "Hampi, India",
    bestSeason: "Oct – Feb",
    heritageScore: 97,
  },
];

export default function TrendingDestinations() {
  const scrollRowRef = useRef<HTMLDivElement>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const { region } = useRegion();

  const destinations = region === "india" ? INDIAN_DESTINATIONS : GLOBAL_DESTINATIONS;

  const scroll = (direction: "left" | "right") => {
    if (scrollRowRef.current) {
      const offset = direction === "left" ? -390 : 390;
      scrollRowRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop pt-8 pb-20 content-visibility-auto">
      {/* Header with Narrative & Scroll Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] gap-4">
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold">
            Seasonal Dispatch
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-on-surface dark:text-[#FAF7F2] tracking-tight mt-1 font-normal">
            Trending Destinations
          </h2>
        </div>

        {/* Controls & Overview */}
        <div className="flex items-center gap-4">
          <span className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] hidden sm:inline">
            6 hand-curated geographic dossiers
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="w-11 h-11 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#1A1A1A] hover:bg-surface-container dark:hover:bg-[#2A2A2A] flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-on-surface dark:text-[#FAF7F2] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">west</span>
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="w-11 h-11 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#1A1A1A] hover:bg-surface-container dark:hover:bg-[#2A2A2A] flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-on-surface dark:text-[#FAF7F2] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">east</span>
            </button>
          </div>
        </div>
      </div>

      {/* Horizontally Scrolling Row of Destination Cards with Hover Physics */}
      <div
        ref={scrollRowRef}
        className="flex gap-6 overflow-x-auto pb-6 scroll-smooth pt-2 -mx-margin-mobile md:-mx-margin-tablet lg:-mx-margin-desktop px-margin-mobile md:px-margin-tablet lg:px-margin-desktop scrollbar-none snap-x snap-mandatory"
      >
        {destinations.map((dest) => {
          const isHovered = hoveredCardId === dest.id;
          return (
            <Link
              key={dest.id}
              href={`/itinerary?location=${encodeURIComponent(dest.query)}`}
              onMouseEnter={() => setHoveredCardId(dest.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              className="flex-none w-[320px] md:w-[350px] bg-surface-container-lowest dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[32px] overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-card group cursor-pointer snap-start"
            >
              {/* Photo with Perspective Zoom */}
              <div className="relative h-[340px] w-full overflow-hidden bg-surface-container dark:bg-[#201F1F]">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                
                {/* Category Pill Tag */}
                <div className="absolute top-4 left-4">
                  <span className="font-sans text-xs uppercase tracking-wider px-3 py-1 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] bg-surface-container-lowest/90 dark:bg-[#131313]/90 backdrop-blur-sm text-on-surface dark:text-[#FAF7F2]">
                    {dest.tag}
                  </span>
                </div>

                {/* Arrow Glyph rotating 45 deg on hover */}
                <div className="absolute bottom-4 right-4 bg-surface-container-lowest dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[#FAF7F2] w-9 h-9 rounded-full flex items-center justify-center text-on-surface dark:text-[#FAF7F2] transition-transform duration-500 group-hover:rotate-45 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-[#1E8C80] dark:group-hover:text-[#131313]">
                  <span className="material-symbols-outlined text-[18px]">north_east</span>
                </div>

                {/* Curator Hover Overlay Bar */}
                <div
                  className={`absolute left-3 right-3 bottom-3 p-2.5 rounded-[18px] bg-surface-container-lowest/95 dark:bg-[#131313]/95 backdrop-blur-md border-2 border-on-surface dark:border-[#FAF7F2] flex items-center justify-between text-[11px] font-sans transition-all duration-300 ${
                    isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  <span className="font-medium text-on-surface dark:text-[#FAF7F2]">
                    Optimal: {dest.bestSeason}
                  </span>
                  <span className="font-semibold text-primary dark:text-[#1E8C80]">
                    ★ {dest.heritageScore} Score
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between bg-surface-container-lowest dark:bg-[#1A1A1A]">
                <div>
                  <span className="font-sans text-xs uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.5)]">
                    {dest.region}
                  </span>
                  <h3 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] mt-1 font-normal group-hover:text-primary dark:group-hover:text-[#1E8C80] transition-colors">
                    {dest.name}
                  </h3>
                  <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.75)] mt-2 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t-2 border-surface-container dark:border-[#2A2A2A] flex items-center justify-between text-on-surface-variant dark:text-[rgba(250,247,242,0.7)]">
                  <span className="font-sans text-xs uppercase tracking-wider">
                    {dest.stayDuration}
                  </span>
                  <span className="font-sans text-xs font-semibold text-primary dark:text-[#1E8C80]">
                    {dest.estPrice}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
