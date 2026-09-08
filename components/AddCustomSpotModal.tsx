"use client";

import React, { useState } from "react";
import { ItineraryItem, Place } from "@/lib/types";

interface AddCustomSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  onAddCustomSpot: (dayNumber: number, newItem: ItineraryItem) => void;
}

export default function AddCustomSpotModal({
  isOpen,
  onClose,
  dayNumber,
  onAddCustomSpot,
}: AddCustomSpotModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"attraction" | "food" | "stay">("attraction");
  const [timeSlot, setTimeSlot] = useState<"morning" | "afternoon" | "evening" | "night">("afternoon");
  const [durationMins, setDurationMins] = useState(60);
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const customPlace: Place = {
      id: `custom-${Date.now()}`,
      place_id: `custom-id-${Date.now()}`,
      name: name.trim(),
      category,
      business_status: "OPERATIONAL",
      photo_url:
        photoUrl.trim() ||
        (category === "food"
          ? "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800"
          : "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800"),
      lat: 0,
      lng: 0,
      editorial_summary: notes.trim() || "Traveler personalized waypoint.",
    };

    const newItem: ItineraryItem = {
      id: `item-${Date.now()}`,
      day_number: dayNumber,
      time_slot: timeSlot,
      order_index: 99,
      suggested_duration_mins: durationMins,
      travel_notes: notes.trim() || "Added by voyager.",
      place: customPlace,
    };

    onAddCustomSpot(dayNumber, newItem);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[36px] p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-surface-container dark:border-[#2A2A2A]">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-1">
              Custom Waypoint Injection
            </span>
            <h3 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal">
              Add Spot to Day {dayNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#201F1F] flex items-center justify-center text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          <div>
            <label className="uppercase tracking-wider text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold block mb-1.5 pl-1">
              Place or Activity Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hidden Rooftop Tea House, Evening Ghat Stroll"
              required
              className="w-full bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-full px-5 py-3 text-sm text-on-surface dark:text-[#FAF7F2] placeholder:text-outline focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="uppercase tracking-wider text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold block mb-1.5 pl-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-full px-4 py-2.5 text-xs text-on-surface dark:text-[#FAF7F2] focus:outline-none"
              >
                <option value="attraction">Attraction / Cultural</option>
                <option value="food">Dining / Tea House</option>
                <option value="stay">Rest / Accommodation</option>
              </select>
            </div>

            <div>
              <label className="uppercase tracking-wider text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold block mb-1.5 pl-1">
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value as any)}
                className="w-full bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-full px-4 py-2.5 text-xs text-on-surface dark:text-[#FAF7F2] focus:outline-none"
              >
                <option value="morning">Morning (06:00 – 11:30)</option>
                <option value="afternoon">Afternoon (11:30 – 16:30)</option>
                <option value="evening">Evening (16:30 – 20:00)</option>
                <option value="night">Night (20:00+)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="uppercase tracking-wider text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold block mb-1.5 pl-1">
              Personal Travel Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Reservation confirmed at 14:00; asks for terrace table..."
              className="w-full bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[20px] p-3.5 text-xs text-on-surface dark:text-[#FAF7F2] focus:outline-none h-20 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-widest font-semibold hover:bg-primary transition-all hover:scale-105 active:scale-95 cursor-pointer mt-2"
          >
            Inject Waypoint into Schedule
          </button>
        </form>
      </div>
    </div>
  );
}
