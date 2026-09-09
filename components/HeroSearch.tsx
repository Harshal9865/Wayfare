"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PlaceSearchSuggestion } from "@/lib/types";
import { useRegion } from "@/lib/region";
import { supabase } from "@/lib/supabase";
import { trackSearch } from "@/lib/analytics";

interface HeroSearchProps {
  onSearch?: (location: string, days: number, style: string, diet: string) => void;
  /** Called instead of navigating when user is not authenticated */
  onRequireLogin?: (destination: string, redirectUrl: string) => void;
}

const GLOBAL_PROMPTS = [
  "Search destinations, hidden corners, or coastal stays...",
  "Try 'Autumn tea ceremony & moss garden in Kyoto'...",
  "Try 'Sun-bleached limestone alleys in Lisbon'...",
  "Try 'Smoky mezcal & heirloom weaving in Oaxaca'...",
  "Try 'Cliffside monastery overlooking the Aegean in Amorgos'...",
  "Try 'Glacier train & alpine chalets in Zermatt'...",
];

const INDIA_PROMPTS = [
  "Search sacred rivers, royal palaces, or mountain passes...",
  "Try 'Dawn wooden boat on the Ganga in Varanasi'...",
  "Try 'Yoga ashram and evening Ganga aarti in Rishikesh'...",
  "Try 'Monastery chant & high mountain pass in Leh Ladakh'...",
  "Try 'Houseboat stay & spice farm in Kerala Backwaters'...",
  "Try 'Haveli courtyard & amber fort in Jaipur'...",
];

export default function HeroSearch({ onSearch, onRequireLogin }: HeroSearchProps) {
  const router = useRouter();
  const { region } = useRegion();

  const activePrompts = region === "india" ? INDIA_PROMPTS : GLOBAL_PROMPTS;

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSearchSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [days, setDays] = useState(3);
  const [tripStyle, setTripStyle] = useState("balanced");
  const [dietaryPref, setDietaryPref] = useState(region === "india" ? "satvik" : "any");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Typewriter placeholder state
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(activePrompts[0]);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchCacheRef = useRef<Map<string, PlaceSearchSuggestion[]>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync dietary default when region changes if set to default
  useEffect(() => {
    if (region === "india" && dietaryPref === "any") {
      setDietaryPref("satvik");
    }
  }, [region]);

  // Keyboard shortcut: Ctrl+K / Cmd+K to focus search, Esc to blur
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Escape") {
        setShowDropdown(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Cycle placeholder smoothly every 4 seconds when input is empty
  useEffect(() => {
    if (query.length > 0) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % activePrompts.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [query, activePrompts.length]);

  useEffect(() => {
    setCurrentPlaceholder(activePrompts[placeholderIndex % activePrompts.length]);
  }, [placeholderIndex, activePrompts]);

  // Fast, cached, and abortable live autocomplete
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Instant memory cache lookup
    if (searchCacheRef.current.has(trimmed)) {
      setSuggestions(searchCacheRef.current.get(trimmed)!);
      setShowDropdown(true);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(() => {
      fetch(`/api/places/search?input=${encodeURIComponent(trimmed)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.suggestions && data.suggestions.length > 0) {
            searchCacheRef.current.set(trimmed, data.suggestions);
            setSuggestions(data.suggestions);
            setShowDropdown(true);
          } else {
            setSuggestions([]);
            setShowDropdown(false);
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Autocomplete search error:", err);
          }
        });
    }, 180);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close dropdown and preferences on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const searchHints =
    region === "india"
      ? [
          { label: "Varanasi Ghats & Aarti", query: "Varanasi, India" },
          { label: "Rishikesh Yoga Ashrams", query: "Rishikesh, India" },
          { label: "Leh Ladakh Passes", query: "Leh Ladakh, India" },
          { label: "Kerala Backwaters", query: "Alleppey, India" },
          { label: "Jaipur Pink City", query: "Jaipur, India" },
          { label: "Hampi Stone Chariot", query: "Hampi, India" },
        ]
      : [
          { label: "Kyoto Tea Pavilions", query: "Kyoto, Japan" },
          { label: "Lisbon Cobblestones", query: "Lisbon, Portugal" },
          { label: "Amorgos Monasteries", query: "Amorgos, Greece" },
          { label: "Oaxaca Artisans", query: "Oaxaca, Mexico" },
          { label: "Amalfi Cliffside", query: "Amalfi, Italy" },
          { label: "Swiss Alps Chalet", query: "Zermatt, Switzerland" },
        ];

  const triggerSearch = async (destination: string) => {
    setShowDropdown(false);
    trackSearch(destination);

    const redirectUrl = `/itinerary?location=${encodeURIComponent(destination)}&days=${days}&style=${tripStyle}&diet=${dietaryPref}`;

    // Check auth state — gate itinerary behind login if handler is provided
    if (onRequireLogin) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        onRequireLogin(destination, redirectUrl);
        return;
      }
    }

    setIsSubmitting(true);
    if (onSearch) {
      onSearch(destination, days, tripStyle, dietaryPref);
    } else {
      router.push(redirectUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const destination = query.trim() || (region === "india" ? "Varanasi, India" : "Kyoto, Japan");
    triggerSearch(destination);
  };

  const handleSelectSuggestion = (suggestion: PlaceSearchSuggestion) => {
    setQuery(suggestion.description);
    triggerSearch(suggestion.description);
  };

  return (
    <section className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop pt-16 md:pt-24 pb-16 flex flex-col items-center text-center">
      {/* Meta Editorial Stamp with subtle pulse */}
      <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#1C1B1B] transition-transform hover:scale-105">
        <span className="w-2 h-2 rounded-full bg-secondary dark:bg-[#1E8C80] animate-pulse"></span>
        <span className="font-sans text-xs uppercase tracking-widest text-on-surface dark:text-[#FAF7F2] font-medium">
          {region === "india" ? "India Sacred & Royal Compendium" : "Autumn & Winter Compendium • Vol. XIV"}
        </span>
      </div>

      {/* Oversized Regular Serif Headline */}
      <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-on-surface dark:text-[#FAF7F2] max-w-4xl tracking-tight mb-8 font-normal leading-[1.05]">
        Where would you wander?
      </h1>

      {/* Spacious Editorial Search Shell with Breathing Multi-Color Ambient Glow */}
      <div ref={dropdownRef} className="w-full max-w-3xl relative mt-2 group">
        {/* Breathing Glow Behind Input */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#ffdbcc] via-[#afeeed] to-[#b5edec] dark:from-[#3aa093] dark:via-[#1E8C80] dark:to-[#489e94] rounded-[68px] opacity-70 blur-xl transition-all duration-700 group-hover:opacity-100 group-focus-within:opacity-100 group-focus-within:scale-[1.02]"></div>

        {/* Crisp Search Bar Form */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center w-full bg-surface-container-lowest dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[60px] p-2 md:p-3 transition-all duration-300 group-focus-within:border-primary dark:group-focus-within:border-[#1E8C80]"
        >
          <div className="pl-3 md:pl-6 pr-1 sm:pr-2 text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] flex items-center">
            <span className="material-symbols-outlined text-[22px] sm:text-[26px]">travel_explore</span>
          </div>

          <input
            ref={inputRef}
            type="text"
            id="destinationSearch"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={currentPlaceholder}
            className="w-full bg-transparent font-sans text-sm sm:text-base md:text-lg text-on-surface dark:text-[#FAF7F2] placeholder:text-outline dark:placeholder:text-[rgba(250,247,242,0.4)] focus:outline-none px-2 tracking-normal transition-all"
            autoComplete="off"
          />

          {/* Clear button when text exists */}
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1.5 mr-1 sm:mr-2 rounded-full text-on-surface-variant hover:text-on-surface dark:text-[rgba(250,247,242,0.6)] hover:bg-surface-container dark:hover:bg-[#2A2A2A] transition-colors cursor-pointer"
              aria-label="Clear search input"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}

          {/* Keyboard shortcut hint (Ctrl+K) */}
          <div className="hidden lg:flex items-center gap-1 mr-2 px-2.5 py-1 rounded-md border border-on-surface/20 dark:border-[rgba(250,247,242,0.2)] bg-surface-container-low/70 dark:bg-[#201F1F] text-[10px] font-sans text-outline dark:text-[rgba(250,247,242,0.5)] select-none">
            <kbd className="font-sans font-semibold">⌘K</kbd>
          </div>

          {/* Filter Trigger Button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 py-2 px-3 sm:px-4 mr-1 sm:mr-2 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] transition-all text-on-surface dark:text-[#FAF7F2] cursor-pointer hover:scale-105 active:scale-95 ${
              showFilters
                ? "bg-surface-container-highest dark:bg-[#353534]"
                : "bg-surface-container dark:bg-[#2A2A2A] hover:bg-surface-variant"
            }`}
            title="Adjust trip preferences"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span className="font-sans text-xs uppercase tracking-wider font-medium hidden sm:inline">
              {showFilters ? "Close" : "Preferences"}
            </span>
          </button>

          {/* Deep Teal Search CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 bg-primary-container dark:bg-[#1E8C80] text-surface-container-lowest dark:text-[#131313] hover:bg-primary dark:hover:bg-[#1A7A70] transition-all px-6 md:px-8 py-3.5 md:py-4 rounded-full border-2 border-on-surface dark:border-[#1E8C80] flex-shrink-0 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-80"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white dark:border-[#131313] border-t-transparent animate-spin" />
                <span className="font-sans text-sm tracking-wide hidden sm:inline font-medium">
                  Curating...
                </span>
              </>
            ) : (
              <>
                <span className="font-sans text-sm tracking-wide hidden sm:inline font-medium">
                  Search
                </span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Live Autocomplete Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-surface-container-lowest dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[28px] p-2 z-50 text-left shadow-dropdown animate-in fade-in-50 duration-200">
            {suggestions.map((item) => (
              <div
                key={item.place_id}
                onClick={() => handleSelectSuggestion(item)}
                className="px-5 py-3 hover:bg-surface-container-low dark:hover:bg-[#222222] rounded-[20px] flex items-center justify-between cursor-pointer transition-all hover:translate-x-1"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-on-surface/20 dark:border-[#FAF7F2]/20 flex items-center justify-center bg-surface-container dark:bg-[#201F1F]">
                    <span className="material-symbols-outlined text-primary dark:text-[#1E8C80] text-[18px]">
                      location_on
                    </span>
                  </div>
                  <div>
                    <span className="font-serif text-base text-on-surface dark:text-[#FAF7F2] block font-normal">
                      {item.main_text}
                    </span>
                    {item.secondary_text && (
                      <span className="font-sans text-xs text-outline dark:text-[rgba(250,247,242,0.5)]">
                        {item.secondary_text}
                      </span>
                    )}
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-outline">
                  north_east
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Expandable Preferences Drawer */}
        {showFilters && (
          <div className="mt-4 p-6 bg-surface-container-lowest dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[32px] text-left grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in-50 slide-in-from-top-2 duration-300">
            {/* Duration */}
            <div>
              <label className="font-sans text-xs uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold block mb-2">
                Trip Duration ({days} {days === 1 ? "Day" : "Days"})
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 5, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDays(num)}
                    className={`px-3.5 py-1.5 rounded-full border-2 text-xs font-medium cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                      days === num
                        ? "bg-primary-container text-white border-on-surface dark:bg-[#1E8C80] dark:text-[#131313] dark:border-[#1E8C80]"
                        : "border-on-surface dark:border-[rgba(250,247,242,0.2)] bg-surface-container dark:bg-[#201F1F] text-on-surface dark:text-[#FAF7F2]"
                    }`}
                  >
                    {num}d
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="font-sans text-xs uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold block mb-2">
                Travel Character
              </label>
              <select
                value={tripStyle}
                onChange={(e) => setTripStyle(e.target.value)}
                className="w-full bg-surface-container dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-full px-4 py-2 text-xs text-on-surface dark:text-[#FAF7F2] focus:outline-none cursor-pointer"
              >
                <option value="balanced">Balanced Exploration</option>
                <option value="backpacker">Backpacker &amp; Budget</option>
                <option value="pilgrimage">Sacred &amp; Pilgrimage</option>
                <option value="family">Family &amp; Leisure</option>
              </select>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="font-sans text-xs uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold block mb-2">
                Dietary Preference
              </label>
              <select
                value={dietaryPref}
                onChange={(e) => setDietaryPref(e.target.value)}
                className="w-full bg-surface-container dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-full px-4 py-2 text-xs text-on-surface dark:text-[#FAF7F2] focus:outline-none cursor-pointer"
              >
                <option value="any">Any / Local Specialties</option>
                <option value="pure_veg">100% Pure Vegetarian</option>
                <option value="jain_friendly">Jain Friendly (No Onion/Garlic)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Curated Search Hints with Spring Scale on Hover */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8 max-w-4xl">
        <span className="font-sans text-xs uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.5)] mr-1">
          Curated Portfolios:
        </span>
        {searchHints.map((hint) => (
          <button
            key={hint.label}
            type="button"
            onClick={() => {
              setQuery(hint.query);
              triggerSearch(hint.query);
            }}
            className="font-sans text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#1C1B1B] hover:bg-surface-container dark:hover:bg-[#2A2A2A] text-on-surface dark:text-[#FAF7F2] transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-subtle"
          >
            {hint.label}
          </button>
        ))}
      </div>
    </section>
  );
}
