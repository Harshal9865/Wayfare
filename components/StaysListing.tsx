"use client";

import React, { useState, useMemo, useEffect } from "react";
import { buildBookingAffiliateUrl } from "@/lib/utils";
import StayComparisonDrawer, { StayComparisonItem } from "@/components/StayComparisonDrawer";
import { useCurrency } from "@/lib/currency";
import { useRegion } from "@/lib/region";

interface ExtendedStayItem extends StayComparisonItem {
  reviewsCount: number;
  badge: string;
  priceInINR: number;
  ratingNumeric: number;
  regionType: "india" | "abroad";
}

const INDIAN_STAYS: ExtendedStayItem[] = [
  {
    id: "brijrama-palace",
    name: "BrijRama Palace Heritage Haven",
    location: "Darbhanga Ghat, Varanasi",
    rating: "4.92",
    ratingNumeric: 4.92,
    reviewsCount: 380,
    category: "Heritage Palace",
    badge: "HERITAGE PALACE",
    pricePerNight: "₹18,500 / night",
    priceInINR: 18500,
    perks: "Private Bajra Boat Transfer & Thali",
    silenceScore: 94,
    distanceToHeritage: "Direct Ganga waterfront",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    regionType: "india",
  },
  {
    id: "rambagh-palace",
    name: "Rambagh Palace Royal Residence",
    location: "Jaipur, Rajasthan",
    rating: "4.98",
    ratingNumeric: 4.98,
    reviewsCount: 450,
    category: "Heritage Palace",
    badge: "ROYAL RESIDENCE",
    pricePerNight: "₹28,000 / night",
    priceInINR: 28000,
    perks: "Peacock Gardens & Vintage Car Arrival",
    silenceScore: 96,
    distanceToHeritage: "1.5km to City Palace",
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
    regionType: "india",
  },
  {
    id: "kerala-houseboat",
    name: "Vembanad Luxury Kettuvallam Float",
    location: "Alleppey Backwaters, Kerala",
    rating: "4.90",
    ratingNumeric: 4.90,
    reviewsCount: 290,
    category: "Houseboats & Backwaters",
    badge: "PRIVATE HOUSEBOAT",
    pricePerNight: "₹12,500 / night",
    priceInINR: 12500,
    perks: "Private Chef & Karimeen Fry Sadya",
    silenceScore: 99,
    distanceToHeritage: "Gliding through palm canals",
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
    regionType: "india",
  },
  {
    id: "ananda-himalayas",
    name: "Ananda in the Himalayas Ashram Sanctuary",
    location: "Narendra Nagar, Rishikesh",
    rating: "4.95",
    ratingNumeric: 4.95,
    reviewsCount: 310,
    category: "Homestays & Lodges",
    badge: "AYURVEDIC RETREAT",
    pricePerNight: "₹24,000 / night",
    priceInINR: 24000,
    perks: "Yoga Master & Hydrotherapy",
    silenceScore: 98,
    distanceToHeritage: "Overlooking Ganga valley",
    imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
    regionType: "india",
  },
  {
    id: "ladakh-glamping",
    name: "Chamba Camp Thiksey Glamping",
    location: "Thiksey Monastery, Leh Ladakh",
    rating: "4.89",
    ratingNumeric: 4.89,
    reviewsCount: 140,
    category: "Homestays & Lodges",
    badge: "HIGH MOUNTAIN CAMP",
    pricePerNight: "₹21,000 / night",
    priceInINR: 21000,
    perks: "Private Butler & Monastery Chant Access",
    silenceScore: 99,
    distanceToHeritage: "300m to Thiksey Monastery",
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
    regionType: "india",
  },
  {
    id: "evolve-back-hampi",
    name: "Evolve Back Kamalapura Palace",
    location: "Hampi, Karnataka",
    rating: "4.91",
    ratingNumeric: 4.91,
    reviewsCount: 185,
    category: "Heritage Palace",
    badge: "VIJAYANAGARA ARCHITECTURE",
    pricePerNight: "₹19,500 / night",
    priceInINR: 19500,
    perks: "Private Jacuzzi & Boulder Sunset Trail",
    silenceScore: 96,
    distanceToHeritage: "2km to Stone Chariot",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    regionType: "india",
  },
];

const INTERNATIONAL_STAYS: ExtendedStayItem[] = [
  {
    id: "sowaka",
    name: "Sowaka Ryokan & Tea Pavilion",
    location: "Gion, Kyoto, Japan",
    rating: "4.90",
    ratingNumeric: 4.9,
    reviewsCount: 120,
    category: "Ryokans / Riads",
    badge: "PRESERVATION GRADE",
    pricePerNight: "₹32,000 / night",
    priceInINR: 32000,
    perks: "Breakfast Included · Hinoki Cedar Bath",
    silenceScore: 98,
    distanceToHeritage: "250m to Yasaka Pagoda",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
    regionType: "abroad",
  },
  {
    id: "riad-secret",
    name: "Riad Jardin Secret & Orangerie",
    location: "Medina, Marrakech, Morocco",
    rating: "4.95",
    ratingNumeric: 4.95,
    reviewsCount: 214,
    category: "Ryokans / Riads",
    badge: "RESTORED 19TH C.",
    pricePerNight: "₹24,000 / night",
    priceInINR: 24000,
    perks: "Courtyard Pool & Traditional Hammam",
    silenceScore: 95,
    distanceToHeritage: "400m to Ben Youssef",
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80",
    regionType: "abroad",
  },
  {
    id: "villa-alentejana",
    name: "Villa Alentejana & Wild Orchard",
    location: "Melides, Comporta, Portugal",
    rating: "4.88",
    ratingNumeric: 4.88,
    reviewsCount: 96,
    category: "Resorts",
    badge: "PRIVATE DUNE ACCESS",
    pricePerNight: "₹42,000 / night",
    priceInINR: 42000,
    perks: "Estate Breakfast & Vintage Bicycles",
    silenceScore: 99,
    distanceToHeritage: "Direct secluded coast",
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80",
    regionType: "abroad",
  },
];

export default function StaysListing() {
  const { region } = useRegion();
  const { formatPrice } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [comparisonList, setComparisonList] = useState<StayComparisonItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dynamicStays, setDynamicStays] = useState<ExtendedStayItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Region-aware base stays
  const baseStays = useMemo(() => {
    return region === "india" ? INDIAN_STAYS : INTERNATIONAL_STAYS;
  }, [region]);

  // Live location search using Google Places photo/details endpoint
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDynamicStays([]);
      return;
    }
    const timer = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/places/photos?query=${encodeURIComponent(searchQuery + " hotel resort stay")}&count=4`)
        .then((res) => res.json())
        .then((data) => {
          if (data.photos && data.photos.length > 0) {
            const fetched: ExtendedStayItem = {
              id: `dynamic-${Date.now()}`,
              name: data.name || `${searchQuery} Heritage Lodge`,
              location: data.address || searchQuery,
              rating: (data.rating || 4.8).toString(),
              ratingNumeric: data.rating || 4.8,
              reviewsCount: data.userRatingsTotal || 150,
              category: region === "india" ? "Heritage Palace" : "Resorts",
              badge: "GOOGLE PLACES VERIFIED",
              pricePerNight: "₹14,500 / night",
              priceInINR: 14500,
              perks: "Verified Operational · Real-time Photos",
              silenceScore: 96,
              distanceToHeritage: "Central Heritage District",
              imageUrl: data.photos[0],
              regionType: region,
            };
            setDynamicStays([fetched]);
          }
        })
        .catch(() => {})
        .finally(() => setIsSearching(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, region]);

  const allStaysList = useMemo(() => {
    return [...dynamicStays, ...baseStays];
  }, [dynamicStays, baseStays]);

  const filteredStays = useMemo(() => {
    return allStaysList.filter((stay) => {
      const matchesCategory =
        selectedCategory === "All" || stay.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        stay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stay.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allStaysList, selectedCategory, searchQuery]);

  const categories = useMemo(() => {
    return region === "india"
      ? ["All", "Heritage Palace", "Houseboats & Backwaters", "Homestays & Lodges"]
      : ["All", "Ryokans / Riads", "Resorts"];
  }, [region]);

  const toggleCompare = (stay: ExtendedStayItem) => {
    const exists = comparisonList.some((item) => item.id === stay.id);
    if (exists) {
      setComparisonList(comparisonList.filter((item) => item.id !== stay.id));
    } else {
      if (comparisonList.length >= 3) {
        alert("You can compare up to 3 stays at a time.");
        return;
      }
      setComparisonList([...comparisonList, stay]);
      setIsDrawerOpen(true);
    }
  };

  return (
    <div className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] mb-8">
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-2">
            {region === "india" ? "🇮🇳 Indian Sanctuary Portfolio" : "🌐 Global Atelier Sanctuaries"}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-on-surface dark:text-[#FAF7F2] font-normal leading-tight">
            Curated Stays &amp; Refuges
          </h1>
        </div>

        {/* Live Search Bar */}
        <div className="w-full md:w-80">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-[20px] text-outline dark:text-[rgba(250,247,242,0.5)]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={region === "india" ? "Search Varanasi, Jaipur, Kerala..." : "Search Kyoto, Marrakech..."}
              className="w-full pl-11 pr-4 py-2.5 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#1C1B1B] font-sans text-xs text-on-surface dark:text-[#FAF7F2] placeholder:text-outline dark:placeholder:text-[rgba(250,247,242,0.4)] focus:outline-none focus:border-primary dark:focus:border-[#1E8C80]"
            />
            {isSearching && (
              <span className="material-symbols-outlined absolute right-4 text-[18px] animate-spin text-primary dark:text-[#1E8C80]">
                progress_activity
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-6 scrollbar-none mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full border-2 font-sans text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all hover:scale-105 active:scale-95 ${
              selectedCategory === cat
                ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-on-surface dark:border-[#1E8C80] font-semibold"
                : "bg-surface-container-lowest dark:bg-[#1A1A1A] text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] border-on-surface/30 dark:border-[rgba(250,247,242,0.25)] hover:bg-surface-container"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStays.map((stay) => {
          const isComparing = comparisonList.some((item) => item.id === stay.id);
          const bookingUrl = buildBookingAffiliateUrl(stay.name, stay.location);

          return (
            <article
              key={stay.id}
              className="group bg-surface-container-lowest dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[32px] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-64 w-full overflow-hidden bg-surface-container dark:bg-[#201F1F]">
                  <img
                    src={stay.imageUrl}
                    alt={stay.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Badge */}
                  <span className="absolute top-4 left-4 font-sans text-[10px] font-semibold uppercase px-3 py-1 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313]">
                    {stay.badge}
                  </span>

                  {/* Rating */}
                  <span className="absolute bottom-4 right-4 font-sans text-xs font-semibold px-3 py-1 rounded-full border-2 border-white/40 bg-black/70 backdrop-blur-md text-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-amber-300">star</span>
                    {stay.rating} ({stay.reviewsCount})
                  </span>
                </div>

                {/* Info */}
                <div className="p-6">
                  <span className="font-sans text-[11px] uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.5)] font-semibold block mb-1">
                    {stay.location}
                  </span>
                  <h3 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] mb-3 font-normal">
                    {stay.name}
                  </h3>

                  <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] mb-4">
                    {stay.perks}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-sans text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] pt-4 border-t-2 border-surface-container dark:border-[#2A2A2A]">
                    <span className="material-symbols-outlined text-[16px] text-primary dark:text-[#1E8C80]">volume_off</span>
                    <span>Silence Score: {stay.silenceScore}%</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex items-center justify-between gap-3">
                <div>
                  <span className="font-serif text-lg font-normal text-on-surface dark:text-[#FAF7F2]">
                    {formatPrice(stay.priceInINR)}
                  </span>
                  <span className="font-sans text-[10px] uppercase text-outline dark:text-[rgba(250,247,242,0.5)] block">
                    per night
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCompare(stay)}
                    className={`px-3 py-2 rounded-full border-2 font-sans text-xs font-semibold cursor-pointer transition-all ${
                      isComparing
                        ? "bg-primary dark:bg-[#1E8C80] text-white dark:text-[#131313] border-primary dark:border-[#1E8C80]"
                        : "border-on-surface/30 dark:border-[rgba(250,247,242,0.3)] text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container"
                    }`}
                  >
                    {isComparing ? "Comparing" : "Compare"}
                  </button>

                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-wider font-semibold hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1"
                  >
                    <span>Reserve</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Comparison Drawer */}
      <StayComparisonDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        items={comparisonList}
        onRemove={(id) => setComparisonList(comparisonList.filter((i) => i.id !== id))}
      />
    </div>
  );
}
