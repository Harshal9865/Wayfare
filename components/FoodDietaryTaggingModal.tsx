"use client";

import React, { useState } from "react";
import { Place } from "@/lib/types";

interface FoodDietaryTaggingModalProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  onTagSubmitted?: (tag: string) => void;
}

export default function FoodDietaryTaggingModal({
  place,
  isOpen,
  onClose,
  onTagSubmitted,
}: FoodDietaryTaggingModalProps) {
  const [selectedTag, setSelectedTag] = useState<string>("pure_veg");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !place) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // In production: writes to Supabase public.food_tags table
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      if (onTagSubmitted) onTagSubmitted(selectedTag);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[36px] p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-surface-container dark:border-[#2A2A2A]">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-1">
              Community Verification
            </span>
            <h3 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal">
              Tag Dietary Classification
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

        {success ? (
          <div className="py-8 text-center text-on-surface dark:text-[#FAF7F2]">
            <span className="material-symbols-outlined text-4xl text-primary dark:text-[#1E8C80] mb-2 block">
              verified
            </span>
            <h4 className="font-serif text-xl font-normal mb-1">
              Community Tag Recorded
            </h4>
            <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.7)]">
              Thank you for helping Indian travelers find trusted dietary options.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.7)]">
              Contribute your firsthand experience for <strong>{place.name}</strong>:
            </p>

            {/* Tag Selection */}
            <div className="space-y-2">
              {[
                { id: "pure_veg", label: "100% Pure Veg (No Meat/Egg on premises)" },
                { id: "jain_friendly", label: "Jain Available (No root vegetables/onion/garlic)" },
                { id: "veg_options", label: "Vegetarian Options Available" },
                { id: "non_veg", label: "Mixed Non-Veg & Veg Kitchen" },
              ].map((tag) => (
                <label
                  key={tag.id}
                  className={`flex items-center gap-3 p-3 rounded-[16px] border-2 cursor-pointer transition-all ${
                    selectedTag === tag.id
                      ? "border-primary dark:border-[#1E8C80] bg-surface-container-low dark:bg-[#201F1F]"
                      : "border-on-surface/20 dark:border-[rgba(250,247,242,0.15)] bg-surface-container-lowest dark:bg-[#131313]"
                  }`}
                >
                  <input
                    type="radio"
                    name="veg_status"
                    value={tag.id}
                    checked={selectedTag === tag.id}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="accent-primary"
                  />
                  <span className="font-sans text-xs text-on-surface dark:text-[#FAF7F2]">
                    {tag.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Note text */}
            <div>
              <label className="font-sans text-[11px] uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold block mb-1">
                Field Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Separate prep counter for Jain food; cooking done in pure desi ghee..."
                className="w-full bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[16px] p-3 text-xs text-on-surface dark:text-[#FAF7F2] focus:outline-none h-20 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs uppercase tracking-widest font-semibold hover:bg-primary transition-colors cursor-pointer"
            >
              {submitting ? "Submitting Tag..." : "Submit Community Tag"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
