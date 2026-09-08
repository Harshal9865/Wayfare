"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface PersonalizedPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PersonalizedPlanModal({
  isOpen,
  onClose,
}: PersonalizedPlanModalProps) {
  const router = useRouter();
  const [destination, setDestination] = useState("Varanasi, India");
  const [duration, setDuration] = useState(3);
  const [budgetBand, setBudgetBand] = useState("moderate");
  const [travelPace, setTravelPace] = useState("unhurried");
  const [dietary, setDietary] = useState("pure_veg");
  const [isGenerating, setIsGenerating] = useState(false);
  const [interests, setInterests] = useState<string[]>([
    "Spiritual & Ghats",
    "Local Street Food",
  ]);

  if (!isOpen) return null;

  const availableInterests = [
    "Spiritual & Ghats",
    "Ancient Temples",
    "Local Street Food",
    "Artisanal Weaving & Silk",
    "Sunrise Boating",
    "Classical Music & Yoga",
    "Heritage Architecture",
    "Quiet Reading Cafes",
  ];

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      onClose();
      router.push(
        `/itinerary?location=${encodeURIComponent(destination)}&days=${duration}&style=${budgetBand}&diet=${dietary}`
      );
    }, 150);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[36px] p-6 md:p-8 scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-surface-container dark:border-[#2A2A2A]">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-1">
              Bespoke Curation Protocol
            </span>
            <h3 className="font-serif text-3xl text-on-surface dark:text-[#FAF7F2] font-normal">
              Personalized Journey Brief
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

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Destination & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="font-sans text-xs uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold block mb-2">
                Target Geographic Region
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="w-full bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-full px-5 py-3 text-sm text-on-surface dark:text-[#FAF7F2] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-sans text-xs uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold block mb-2">
                Duration (Days)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-full px-4 py-3 text-sm text-on-surface dark:text-[#FAF7F2] focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 7, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Day" : "Days"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget & Pacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-xs uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold block mb-2">
                Budget Tier
              </label>
              <select
                value={budgetBand}
                onChange={(e) => setBudgetBand(e.target.value)}
                className="w-full bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-full px-4 py-3 text-sm text-on-surface dark:text-[#FAF7F2] focus:outline-none"
              >
                <option value="backpacker">Backpacker &amp; Hostel (₹1,500/day)</option>
                <option value="moderate">Moderate Comfort (₹4,500/day)</option>
                <option value="heritage">Heritage &amp; Luxury (₹15,000+/day)</option>
              </select>
            </div>

            <div>
              <label className="font-sans text-xs uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold block mb-2">
                Expedition Pace
              </label>
              <select
                value={travelPace}
                onChange={(e) => setTravelPace(e.target.value)}
                className="w-full bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-full px-4 py-3 text-sm text-on-surface dark:text-[#FAF7F2] focus:outline-none"
              >
                <option value="unhurried">Unhurried (2–3 stops/day, quiet focus)</option>
                <option value="balanced">Balanced (3–4 stops/day)</option>
                <option value="intensive">Intensive Explorer (5+ stops/day)</option>
              </select>
            </div>
          </div>

          {/* Dietary Requirements */}
          <div>
            <label className="font-sans text-xs uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold block mb-2">
              Dietary Requirement
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "pure_veg", label: "100% Pure Veg" },
                { id: "jain_friendly", label: "Jain Friendly" },
                { id: "any", label: "Any Local Food" },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDietary(d.id)}
                  className={`py-2 px-3 rounded-full border-2 font-sans text-xs font-semibold cursor-pointer transition-all ${
                    dietary === d.id
                      ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-on-surface dark:border-[#1E8C80]"
                      : "bg-surface-container-low dark:bg-[#201F1F] text-on-surface dark:text-[#FAF7F2] border-on-surface dark:border-[rgba(250,247,242,0.25)]"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interests & Thematic Focus */}
          <div>
            <label className="font-sans text-xs uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold block mb-2">
              Thematic Focus (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => {
                const isSelected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-1.5 rounded-full border-2 font-sans text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-on-surface dark:border-[#1E8C80] font-semibold"
                        : "bg-surface-container-low dark:bg-[#201F1F] text-on-surface dark:text-[#FAF7F2] border-on-surface dark:border-[rgba(250,247,242,0.25)]"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA Submit */}
          <div className="pt-4 border-t-2 border-surface-container dark:border-[#2A2A2A]">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-widest font-semibold hover:bg-primary transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-80"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white dark:border-[#131313] border-t-transparent animate-spin" />
                  <span>Synthesizing Dossier...</span>
                </>
              ) : (
                <>
                  <span>Synthesize Custom Dossier</span>
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
