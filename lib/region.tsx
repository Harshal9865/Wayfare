"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useCurrency, CurrencyCode } from "@/lib/currency";

export type RegionMode = "india" | "abroad";

export interface RegionConfig {
  mode: RegionMode;
  label: string;
  flag: string;
  defaultCurrency: CurrencyCode;
  popularDestinations: { title: string; subtitle: string; imageUrl: string; tag: string }[];
  searchHints: { label: string; query: string }[];
}

export const REGIONS: Record<RegionMode, RegionConfig> = {
  india: {
    mode: "india",
    label: "India Voyage",
    flag: "🇮🇳",
    defaultCurrency: "INR",
    popularDestinations: [
      {
        title: "Varanasi Ghats & Dev Deepawali",
        subtitle: "Sacred Ganga Aarti & Bajra Boat Charters",
        imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
        tag: "SACRED HERITAGE",
      },
      {
        title: "Rishikesh & Garhwal Valleys",
        subtitle: "Yoga Ashrams & Dawn Ganga Chanting",
        imageUrl: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=800&auto=format&fit=crop&q=80",
        tag: "YOGA SANCTUARY",
      },
      {
        title: "Leh Ladakh High Passes",
        subtitle: "Thiksey Monastery & Nubra Star Trails",
        imageUrl: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&auto=format&fit=crop&q=80",
        tag: "HIGH CORRIDOR",
      },
      {
        title: "Udaipur & Lake Pichola",
        subtitle: "Royal Haveli Courtyards & Terracotta Craft",
        imageUrl: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop&q=80",
        tag: "PALACE RETREAT",
      },
    ],
    searchHints: [
      { label: "Varanasi Ghats & Aarti", query: "Varanasi, India" },
      { label: "Rishikesh Yoga Ashrams", query: "Rishikesh, India" },
      { label: "Leh Ladakh Monasteries", query: "Leh Ladakh, India" },
      { label: "Udaipur Lake Haveli", query: "Udaipur, Rajasthan" },
      { label: "Munnar Tea Estates", query: "Munnar, Kerala" },
      { label: "Jaipur City Palace", query: "Jaipur, Rajasthan" },
    ],
  },
  abroad: {
    mode: "abroad",
    label: "Abroad & Global",
    flag: "🌐",
    defaultCurrency: "USD",
    popularDestinations: [
      {
        title: "Kyoto & Autumn Valleys",
        subtitle: "Preservation Ryokans & Hinoki Baths",
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
        tag: "ZEN SANCTUARY",
      },
      {
        title: "Marrakech Medina & Orangerie",
        subtitle: "Restored 19th Century Design Riads",
        imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80",
        tag: "MEDINA CRAFT",
      },
      {
        title: "Lisbon & Silver Coast",
        subtitle: "Historic Azulejos & Tram Corridors",
        imageUrl: "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800&auto=format&fit=crop&q=80",
        tag: "ATLANTIC SEABOARD",
      },
      {
        title: "Amorgos Cycladic Lodges",
        subtitle: "Aegean Sea Panorama & Donkey Trails",
        imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80",
        tag: "ISLAND MONASTERY",
      },
    ],
    searchHints: [
      { label: "Kyoto Tea Pavilions", query: "Kyoto, Japan" },
      { label: "Lisbon Cobblestone Streets", query: "Lisbon, Portugal" },
      { label: "Amorgos Monasteries", query: "Amorgos, Greece" },
      { label: "Oaxaca Ceramicists", query: "Oaxaca, Mexico" },
      { label: "Marrakech Medina Riads", query: "Marrakech, Morocco" },
      { label: "Amalfi Coast Cliffside", query: "Amalfi, Italy" },
    ],
  },
};

interface RegionContextType {
  region: RegionMode;
  setRegion: (mode: RegionMode) => void;
  config: RegionConfig;
}

const RegionContext = createContext<RegionContextType>({
  region: "india",
  setRegion: () => {},
  config: REGIONS.india,
});

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<RegionMode>("india");
  const { setCurrency } = useCurrency();

  useEffect(() => {
    const saved = localStorage.getItem("wayfare_region") as RegionMode;
    if (saved && REGIONS[saved]) {
      setRegionState(saved);
    }
  }, []);

  const setRegion = (mode: RegionMode) => {
    setRegionState(mode);
    localStorage.setItem("wayfare_region", mode);
    // Automatically adjust currency default if needed
    setCurrency(REGIONS[mode].defaultCurrency);
  };

  const config = REGIONS[region];

  return (
    <RegionContext.Provider value={{ region, setRegion, config }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  return useContext(RegionContext);
}
