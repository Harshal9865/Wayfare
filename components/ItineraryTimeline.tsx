"use client";

import React from "react";
import { ItineraryDay, Place } from "@/lib/types";

interface ItineraryTimelineProps {
  days: ItineraryDay[];
  onSelectPlace: (place: Place) => void;
  onSwapSpot?: (place: Place) => void;
  onOpenAddCustomSpot?: (dayNumber: number) => void;
}

export default function ItineraryTimeline({
  days,
  onSelectPlace,
  onSwapSpot,
  onOpenAddCustomSpot,
}: ItineraryTimelineProps) {
  return (
    <div className="flex flex-col space-y-20">
      {days.map((day) => (
        <article key={day.day_number} className="flex flex-col">
          {/* Day Header with Add Custom Waypoint Action */}
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 pb-6 border-b-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] mb-8">
            <div>
              <span className="font-sans text-xs uppercase tracking-widest text-primary dark:text-[#1E8C80] font-semibold block mb-1">
                Day {day.day_number} Portfolio
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-on-surface dark:text-[#FAF7F2] font-normal">
                {day.theme_title}
              </h2>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <span className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] px-4 py-1.5 bg-surface-container dark:bg-[#201F1F] rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.25)]">
                {day.items.length} Curated Stops
              </span>

              {onOpenAddCustomSpot && (
                <button
                  onClick={() => onOpenAddCustomSpot(day.day_number)}
                  className="inline-flex items-center gap-1 font-sans text-xs uppercase tracking-wider font-semibold px-4 py-1.5 rounded-full border-2 border-on-surface dark:border-[#1E8C80] bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Add custom waypoint or note"
                >
                  <span className="material-symbols-outlined text-[15px]">add</span>
                  <span>Add Stop</span>
                </button>
              )}
            </div>
          </div>

          {/* Place Cards Flow with Inter-Card Transit Connectors */}
          <div className="flex flex-col">
            {day.items.map((item, idx) => (
              <React.Fragment key={item.id}>
                {/* Place Card */}
                <div
                  onClick={() => onSelectPlace(item.place)}
                  className="group bg-surface-container-lowest dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[32px] overflow-hidden flex flex-col sm:flex-row transition-all duration-300 hover:bg-surface-container-low dark:hover:bg-[#222222] hover:-translate-y-1 hover:shadow-card cursor-pointer"
                >
                  {/* Photo with Open Status Badge */}
                  <div className="sm:w-64 h-56 sm:h-auto shrink-0 relative overflow-hidden bg-surface-container dark:bg-[#201F1F]">
                    <img
                      src={
                        item.place.photo_url ||
                        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800"
                      }
                      alt={item.place.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs font-semibold shadow-sm">
                      {item.place.business_status === "OPERATIONAL" ? "Open now" : "Verified Spot"}
                    </span>
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/30 text-white font-sans text-[10px] uppercase tracking-wider font-semibold shadow-md">
                      <span className="material-symbols-outlined text-[13px] text-amber-300">collections</span>
                      {item.place.photos?.length || 4} Angles
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 md:p-8 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      {/* Time slot & Step Number */}
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary dark:text-[#1E8C80] text-[18px]">
                            schedule
                          </span>
                          <span className="font-sans text-xs uppercase tracking-wider text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold">
                            {item.time_slot.toUpperCase()} · Step 0{idx + 1}
                          </span>
                        </div>
                        <span className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.5)]">
                          Stop #{idx + 1}
                        </span>
                      </div>

                      {/* Place Name */}
                      <h3 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] mb-2 truncate font-normal group-hover:text-primary dark:group-hover:text-[#1E8C80] transition-colors">
                        {item.place.name}
                      </h3>

                      {/* Travel Notes / Summary */}
                      <p className="font-sans text-xs md:text-sm text-on-surface-variant dark:text-[rgba(250,247,242,0.75)] line-clamp-2 leading-relaxed">
                        {item.travel_notes ||
                          item.place.editorial_summary ||
                          "A preserved cultural landmark offering peerless contemplative stillness and authentic architecture."}
                      </p>
                    </div>

                    {/* Footer stats: distance, timer, reservation */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-surface-container dark:border-[#2A2A2A] mt-4">
                      <div className="flex items-center gap-4 text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-sans text-xs">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">directions_walk</span>
                          Walkable route
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">timer</span>
                          {item.suggested_duration_mins}m recommended
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPlace(item.place);
                          }}
                          className="inline-flex items-center gap-1 font-sans text-xs text-primary dark:text-[#1E8C80] font-semibold hover:underline cursor-pointer group-hover:translate-x-1 transition-transform"
                        >
                          Inspect Dossier
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inter-Card Transit Connector between consecutive stops */}
                {idx < day.items.length - 1 && (
                  <div className="flex items-center gap-3 py-3 pl-8 md:pl-12 my-1">
                    <div className="flex flex-col items-center">
                      <span className="w-0.5 h-3 border-l-2 border-dashed border-on-surface/40 dark:border-[rgba(250,247,242,0.3)]"></span>
                      <span className="w-2 h-2 rounded-full bg-secondary dark:bg-[#1E8C80]"></span>
                      <span className="w-0.5 h-3 border-l-2 border-dashed border-on-surface/40 dark:border-[rgba(250,247,242,0.3)]"></span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-on-surface/20 dark:border-[rgba(250,247,242,0.2)] bg-surface-container-low dark:bg-[#1C1B1B] text-[11px] font-sans text-on-surface-variant dark:text-[rgba(250,247,242,0.7)]">
                      <span className="material-symbols-outlined text-[14px] text-primary dark:text-[#1E8C80]">
                        directions_walk
                      </span>
                      <span>
                        ~12 min walk (850m) along stone conservation district
                      </span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
