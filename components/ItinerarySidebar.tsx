"use client";

import React, { useState, useEffect, useRef } from "react";
import { BudgetBreakdown } from "@/lib/types";
import FestivalsCalendarModal from "@/components/FestivalsCalendarModal";
import { fetchLiveWeather, RealTimeWeather } from "@/lib/weather";

interface ItinerarySidebarProps {
  locationName: string;
  lat?: number;
  lng?: number;
  budget?: BudgetBreakdown;
  onOpenMap?: () => void;
}

export default function ItinerarySidebar({
  locationName,
  lat,
  lng,
  budget,
  onOpenMap,
}: ItinerarySidebarProps) {
  const [isFestivalOpen, setIsFestivalOpen] = useState(false);
  const [showWeatherDrawer, setShowWeatherDrawer] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [checkedChecklist, setCheckedChecklist] = useState<string[]>(["Cash for heritage passes"]);
  const [liveWeather, setLiveWeather] = useState<RealTimeWeather | null>(null);

  const weatherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (weatherRef.current && !weatherRef.current.contains(event.target as Node)) {
        setShowWeatherDrawer(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const latitude = lat || 35.0116;
    const longitude = lng || 135.7681;
    fetchLiveWeather(latitude, longitude).then((data) => {
      if (data) setLiveWeather(data);
    });
  }, [lat, lng]);

  const toggleChecklist = (item: string) => {
    if (checkedChecklist.includes(item)) {
      setCheckedChecklist(checkedChecklist.filter((i) => i !== item));
    } else {
      setCheckedChecklist([...checkedChecklist, item]);
    }
  };

  return (
    <>
      <aside className="space-y-6">
        {/* Field Notes Card */}
        <div className="bg-surface-container-low dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[32px] p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-on-surface/10 dark:border-[#2A2A2A]">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.5)] block">
                Traveler Dossier
              </span>
              <h3 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal">
                Field Notes
              </h3>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] flex items-center justify-center bg-surface-container-lowest dark:bg-[#201F1F]">
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
            </div>
          </div>

          {/* Real-time Sunrise & Interactive Live Forecast with Click Outside */}
          <div ref={weatherRef} className="mb-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 bg-surface-container-lowest dark:bg-[#201F1F] rounded-[16px] border-2 border-on-surface dark:border-[rgba(250,247,242,0.2)] text-center">
                <span className="font-sans text-[10px] uppercase tracking-wider text-outline dark:text-[rgba(250,247,242,0.5)] block">
                  Sunrise (Live)
                </span>
                <span className="font-sans text-sm font-semibold text-on-surface dark:text-[#FAF7F2]">
                  {liveWeather ? liveWeather.sunriseTime : "06:04 AM"}
                </span>
              </div>

              <button
                onClick={() => setShowWeatherDrawer(!showWeatherDrawer)}
                className="p-3 bg-surface-container-lowest dark:bg-[#201F1F] rounded-[16px] border-2 border-on-surface dark:border-[rgba(250,247,242,0.2)] text-center cursor-pointer hover:border-primary transition-all group"
              >
                <span className="font-sans text-[10px] uppercase tracking-wider text-outline dark:text-[rgba(250,247,242,0.5)] block flex items-center justify-center gap-1">
                  <span>Forecast</span>
                  <span className="material-symbols-outlined text-[12px] group-hover:translate-y-0.5 transition-transform">
                    expand_more
                  </span>
                </span>
                <span className="font-sans text-xs sm:text-sm font-semibold text-on-surface dark:text-[#FAF7F2] truncate block">
                  {liveWeather ? liveWeather.currentCondition : "19°C Crisp"}
                </span>
              </button>
            </div>

            {/* 3-Day Live Forecast Expandable Drawer */}
            {showWeatherDrawer && (
              <div className="p-3 rounded-[16px] bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface/20 dark:border-[rgba(250,247,242,0.2)] text-xs font-sans space-y-2 animate-in fade-in-50 duration-200">
                {liveWeather && liveWeather.dailyForecast.length > 0 ? (
                  liveWeather.dailyForecast.map((day, idx) => (
                    <div
                      key={day.dayLabel}
                      className={`flex items-center justify-between ${
                        idx < liveWeather.dailyForecast.length - 1 ? "pb-1 border-b border-on-surface/10" : ""
                      }`}
                    >
                      <span className="font-semibold text-on-surface dark:text-[#FAF7F2]">
                        {day.dayLabel}
                      </span>
                      <span className="text-on-surface-variant dark:text-[rgba(250,247,242,0.8)]">
                        {day.conditionEmoji} {day.maxTemp}° / {day.minTemp}°C · {day.rainProb}% Rain
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-between pb-1 border-b border-on-surface/10">
                      <span className="font-semibold text-on-surface dark:text-[#FAF7F2]">Day 1 (Mon)</span>
                      <span>☀️ 21°C / 14°C · Zero Rain</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-on-surface/10">
                      <span className="font-semibold text-on-surface dark:text-[#FAF7F2]">Day 2 (Tue)</span>
                      <span>⛅ 19°C / 12°C · Mild Breeze</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-on-surface dark:text-[#FAF7F2]">Day 3 (Wed)</span>
                      <span>🌦️ 17°C / 11°C · 20% Light Mist</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Active Corridor Mini-Map */}
          <div className="mb-4">
            <span className="font-sans text-[10px] uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.5)] block mb-2">
              Active Corridor
            </span>
            <div
              onClick={onOpenMap}
              className="relative h-36 w-full rounded-[20px] overflow-hidden border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-[#E8E5DF] dark:bg-[#2A2A2A] cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80"
                alt="Map route overview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                <span className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest/90 dark:bg-[#131313]/90 border-2 border-on-surface dark:border-[#FAF7F2] font-sans text-xs font-semibold text-on-surface dark:text-[#FAF7F2] flex items-center gap-1.5 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[14px]">map</span>
                  Open Route Map
                </span>
              </div>
            </div>
          </div>

          {/* Festival & Calendar Action */}
          <button
            onClick={() => setIsFestivalOpen(true)}
            className="w-full mb-4 p-3 rounded-[16px] border-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] bg-surface-container-lowest dark:bg-[#201F1F] flex items-center justify-between hover:border-primary transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary dark:text-[#1E8C80] text-[20px]">
                event
              </span>
              <div className="text-left">
                <span className="font-sans text-xs font-semibold text-on-surface dark:text-[#FAF7F2] block">
                  Festival &amp; Cultural Overlay
                </span>
                <span className="font-sans text-[10px] text-on-surface-variant dark:text-[rgba(250,247,242,0.5)]">
                  Seasonal events in {locationName}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[16px] text-outline group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </button>

          {/* Interactive Audio Commentary Bar */}
          <div className="p-3 mb-4 rounded-[16px] bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.2)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary dark:text-[#1E8C80] text-[18px]">
                  headphones
                </span>
                <span className="font-sans text-xs font-semibold text-on-surface dark:text-[#FAF7F2]">
                  Audio Commentary
                </span>
              </div>
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-7 h-7 rounded-full bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isPlayingAudio ? "pause" : "play_arrow"}
                </span>
              </button>
            </div>
            {/* Audio Track Bar */}
            <div className="w-full bg-surface-container dark:bg-[#333] h-1.5 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full bg-primary dark:bg-[#1E8C80] transition-all duration-300 ${
                  isPlayingAudio ? "w-2/5 animate-pulse" : "w-1/12"
                }`}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-outline font-sans">
              <span>{isPlayingAudio ? "02:14" : "00:00"}</span>
              <span>08:45 · Sacred Corridors</span>
            </div>
          </div>

          {/* Preparation & Etiquette Checklist */}
          <div className="p-4 bg-surface-container-lowest dark:bg-[#201F1F] rounded-[20px] border-2 border-on-surface dark:border-[rgba(250,247,242,0.2)]">
            <span className="font-sans text-[10px] uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-2">
              Voyage Preparation Checklist
            </span>
            <div className="space-y-1.5 font-sans text-xs">
              {[
                "Cash for heritage passes",
                "Slip-on shoes for temples",
                "Dawn alarm set (05:15 AM)",
              ].map((item) => {
                const isChecked = checkedChecklist.includes(item);
                return (
                  <label
                    key={item}
                    onClick={() => toggleChecklist(item)}
                    className="flex items-center gap-2 cursor-pointer select-none text-on-surface dark:text-[#FAF7F2]"
                  >
                    <span
                      className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-primary border-primary dark:bg-[#1E8C80] dark:border-[#1E8C80] text-white dark:text-[#131313]"
                          : "border-on-surface/40 dark:border-white/40"
                      }`}
                    >
                      {isChecked && (
                        <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                      )}
                    </span>
                    <span className={isChecked ? "line-through text-outline" : ""}>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <FestivalsCalendarModal
        isOpen={isFestivalOpen}
        onClose={() => setIsFestivalOpen(false)}
        locationName={locationName}
      />
    </>
  );
}
