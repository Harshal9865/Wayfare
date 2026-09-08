"use client";

import React, { useState, useMemo } from "react";
import { buildBookingAffiliateUrl } from "@/lib/utils";
import StayComparisonDrawer, { StayComparisonItem } from "@/components/StayComparisonDrawer";
import { useCurrency } from "@/lib/currency";

interface ExtendedStayItem extends StayComparisonItem {
  reviewsCount: number;
  badge: string;
  priceNumeric: number;
  priceInINR: number;
  ratingNumeric: number;
}

const SAMPLE_STAYS: ExtendedStayItem[] = [
  {
    id: "sowaka",
    name: "Sowaka Ryokan & Tea Pavilion",
    location: "Gion, Kyoto",
    rating: "4.9",
    ratingNumeric: 4.9,
    reviewsCount: 120,
    category: "Ryokans",
    badge: "PRESERVATION GRADE",
    pricePerNight: "$390 / night",
    priceNumeric: 390,
    priceInINR: 32000,
    perks: "Breakfast Included · Hinoki Cedar Bath",
    silenceScore: 98,
    distanceToHeritage: "250m to Yasaka Pagoda",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "riad-secret",
    name: "Riad Jardin Secret & Orangerie",
    location: "Medina, Marrakech",
    rating: "4.95",
    ratingNumeric: 4.95,
    reviewsCount: 214,
    category: "Design Riads",
    badge: "RESTORED 19TH C.",
    pricePerNight: "$290 / night",
    priceNumeric: 290,
    priceInINR: 24000,
    perks: "Courtyard Pool & Traditional Hammam",
    silenceScore: 95,
    distanceToHeritage: "400m to Ben Youssef",
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "villa-alentejana",
    name: "Villa Alentejana & Wild Orchard",
    location: "Melides, Comporta",
    rating: "4.88",
    ratingNumeric: 4.88,
    reviewsCount: 96,
    category: "Historic Villas",
    badge: "PRIVATE DUNE ACCESS",
    pricePerNight: "$520 / night",
    priceNumeric: 520,
    priceInINR: 42000,
    perks: "Estate Breakfast & Vintage Bicycles",
    silenceScore: 99,
    distanceToHeritage: "Direct secluded coast",
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "brijrama-palace",
    name: "BrijRama Palace Heritage Haven",
    location: "Darbhanga Ghat, Varanasi",
    rating: "4.92",
    ratingNumeric: 4.92,
    reviewsCount: 380,
    category: "Historic Villas",
    badge: "HERITAGE PALACE",
    pricePerNight: "₹18,500 / night",
    priceNumeric: 220,
    priceInINR: 18500,
    perks: "Private Bajra Boat Transfer & Thali",
    silenceScore: 94,
    distanceToHeritage: "Direct Ganga waterfront",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "amorgos-stone-retreat",
    name: "Keros Horizon Stone Lodges",
    location: "Aegiali, Amorgos",
    rating: "4.91",
    ratingNumeric: 4.91,
    reviewsCount: 84,
    category: "Mountain Lodges",
    badge: "CYCLADIC SANCTUARY",
    pricePerNight: "$240 / night",
    priceNumeric: 240,
    priceInINR: 19500,
    perks: "Aegean Sea Panorama & Herb Garden",
    silenceScore: 97,
    distanceToHeritage: "Ancient donkey trail",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80",
  },
];

export default function StaysListing({ locationName }: { locationName?: string }) {
  const { formatPrice } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState("All Stays");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(600);
  const [comparedStays, setComparedStays] = useState<ExtendedStayItem[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const categories = ["All Stays", "Ryokans", "Historic Villas", "Mountain Lodges", "Design Riads"];

  const filteredStays = useMemo(() => {
    return SAMPLE_STAYS.filter((stay) => {
      const matchesCategory = selectedCategory === "All Stays" || stay.category === selectedCategory;
      const matchesRating = stay.ratingNumeric >= minRating;
      const matchesPrice = stay.priceNumeric <= maxPrice;
      return matchesCategory && matchesRating && matchesPrice;
    });
  }, [selectedCategory, minRating, maxPrice]);

  const toggleCompare = (stay: ExtendedStayItem) => {
    if (comparedStays.some((s) => s.id === stay.id)) {
      setComparedStays(comparedStays.filter((s) => s.id !== stay.id));
    } else {
      if (comparedStays.length >= 3) {
        alert("You can compare up to 3 shelters simultaneously.");
        return;
      }
      const updated = [
        ...comparedStays,
        { ...stay, pricePerNight: `${formatPrice(stay.priceInINR)} / night` },
      ];
      setComparedStays(updated);
      setIsComparisonOpen(true);
    }
  };

  return (
    <section className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] gap-4">
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold">
            Volume IV — Curated Shelter
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-on-surface dark:text-[#FAF7F2] font-normal tracking-tight mt-1">
            Sanctuaries of Stillness
          </h1>
          <p className="font-sans text-sm text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] mt-2">
            Where to Stay — Handpicked riads, ryokans, and coastal villas with quiet character.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {comparedStays.length > 0 && (
            <button
              onClick={() => setIsComparisonOpen(true)}
              className="px-4 py-2 rounded-full border-2 border-on-surface dark:border-[#1E8C80] bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-subtle hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
              <span>Compare ({comparedStays.length})</span>
            </button>
          )}

          <span className="px-3.5 py-1.5 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#1C1B1B] font-sans text-xs font-semibold text-on-surface dark:text-[#FAF7F2]">
            27 Verified Residencies
          </span>
        </div>
      </div>

      {/* Filter Tabs & Advanced Sliders */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 p-5 rounded-[28px] bg-surface-container-low dark:bg-[#1C1B1B] border-2 border-on-surface dark:border-[rgba(250,247,242,0.25)]">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedCategory(filter)}
              className={`px-4 py-1.5 rounded-full border-2 font-sans text-xs uppercase tracking-wider transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                selectedCategory === filter
                  ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-on-surface dark:border-[#1E8C80] font-semibold"
                  : "bg-surface-container-lowest dark:bg-[#201F1F] text-on-surface dark:text-[#FAF7F2] border-on-surface/20"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Rating & Max Price Controls */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-sans">
          {/* Minimum Rating */}
          <div className="flex items-center gap-2">
            <span className="text-outline dark:text-[rgba(250,247,242,0.6)] uppercase tracking-wider font-medium">
              Rating:
            </span>
            {[0, 4.8, 4.9].map((val) => (
              <button
                key={val}
                onClick={() => setMinRating(val)}
                className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-all cursor-pointer ${
                  minRating === val
                    ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-on-surface"
                    : "border-on-surface/20 bg-surface-container-lowest dark:bg-[#201F1F]"
                }`}
              >
                {val === 0 ? "All" : `${val}+ ★`}
              </button>
            ))}
          </div>

          {/* Price Cap */}
          <div className="flex items-center gap-2">
            <span className="text-outline dark:text-[rgba(250,247,242,0.6)] uppercase tracking-wider font-medium">
              Max Rate:
            </span>
            <span className="font-semibold text-primary dark:text-[#1E8C80]">${maxPrice}/n</span>
            <input
              type="range"
              min="200"
              max="600"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-primary w-24 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Stays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {filteredStays.map((stay) => {
          const isComparing = comparedStays.some((s) => s.id === stay.id);

          return (
            <article
              key={stay.id}
              className={`bg-surface-container-lowest dark:bg-[#1A1A1A] border-2 rounded-[32px] overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-2 hover:shadow-card ${
                isComparing
                  ? "border-primary dark:border-[#1E8C80]"
                  : "border-on-surface dark:border-[rgba(250,247,242,0.3)]"
              }`}
            >
              {/* Stay Image */}
              <div className="relative h-64 w-full overflow-hidden bg-surface-container dark:bg-[#201F1F]">
                <img
                  src={stay.imageUrl}
                  alt={stay.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Badge Tag */}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] bg-surface-container-lowest/90 dark:bg-[#131313]/90 font-sans text-[10px] uppercase tracking-wider font-semibold text-on-surface dark:text-[#FAF7F2]">
                  {stay.badge}
                </span>

                {/* Compare Checkbox Trigger */}
                <button
                  type="button"
                  onClick={() => toggleCompare(stay)}
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full border-2 text-[11px] font-sans font-semibold transition-all cursor-pointer ${
                    isComparing
                      ? "bg-primary text-white border-white dark:bg-[#1E8C80] dark:text-[#131313]"
                      : "bg-black/60 text-white border-white/40 hover:bg-black"
                  }`}
                >
                  {isComparing ? "✓ Compared" : "+ Compare"}
                </button>
              </div>

              {/* Stay Info */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-sans text-xs uppercase tracking-wider text-outline dark:text-[rgba(250,247,242,0.5)]">
                      {stay.location}
                    </span>
                    <span className="font-sans text-xs font-semibold flex items-center gap-1 text-on-surface dark:text-[#FAF7F2]">
                      <span className="material-symbols-outlined text-[14px] text-amber-500">star</span>
                      {stay.rating} ({stay.reviewsCount})
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal mb-2 group-hover:text-primary dark:group-hover:text-[#1E8C80] transition-colors">
                    {stay.name}
                  </h3>

                  <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.75)] mb-3">
                    {stay.perks}
                  </p>

                  {/* Tactile Highlights (Silence Score & Distance) */}
                  <div className="flex flex-wrap items-center gap-2 mb-2 font-sans text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-medium">
                      🛡️ {stay.silenceScore}/100 Silence
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full border border-on-surface/20 bg-surface-container-low dark:bg-[#201F1F] text-on-surface-variant dark:text-[rgba(250,247,242,0.6)]">
                      📍 {stay.distanceToHeritage}
                    </span>
                  </div>
                </div>

                {/* Price & Outbound Affiliate Booking */}
                <div className="pt-4 mt-4 border-t-2 border-surface-container dark:border-[#2A2A2A] flex items-center justify-between">
                  <div>
                    <span className="font-sans text-sm font-semibold text-on-surface dark:text-[#FAF7F2] block">
                      {formatPrice(stay.priceInINR)} / night
                    </span>
                  </div>

                  <a
                    href={buildBookingAffiliateUrl(locationName || stay.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-wider font-semibold hover:bg-primary transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-subtle"
                  >
                    <span>View &amp; Book</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* The Wayfare Guarantee & Remote Area Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-low dark:bg-[#1C1B1B] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[32px] p-8 flex flex-col justify-between">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-1">
              The Wayfare Guarantee
            </span>
            <h4 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal mb-2">
              Every room evaluated in person for tactile silence.
            </h4>
            <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] leading-relaxed">
              We deliberately avoid commercial hotel aggregators. Each property hosts under thirty guests, respects vernacular building traditions, and offers acoustic privacy.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t-2 border-on-surface/10 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary dark:text-[#1E8C80] text-[20px]">verified</span>
            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface dark:text-[#FAF7F2]">
              100% Inspected
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low dark:bg-[#1C1B1B] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[32px] p-8 flex flex-col justify-between">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-1">
              Remote &amp; Rural Wayfarer Notice
            </span>
            <h4 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal mb-2">
              Traveling offbeat in remote India or mountain passes?
            </h4>
            <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] leading-relaxed">
              In destinations where Booking.com has zero verified inventory, we never render broken listings. Instead, we connect you with local village panchayats and verified family homestays.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t-2 border-on-surface/10 flex items-center justify-between">
            <span className="font-sans text-xs text-outline font-medium">Honest Curation Policy</span>
            <span className="font-sans text-xs uppercase tracking-wider text-primary dark:text-[#1E8C80] font-semibold">
              Zero Phantoms
            </span>
          </div>
        </div>
      </div>

      {/* Comparison Drawer */}
      <StayComparisonDrawer
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        selectedStays={comparedStays}
        onRemoveStay={(id) => setComparedStays(comparedStays.filter((s) => s.id !== id))}
      />
    </section>
  );
}
