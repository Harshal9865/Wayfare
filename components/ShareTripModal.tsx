"use client";

import React, { useState } from "react";

interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  locationName: string;
}

export default function ShareTripModal({
  isOpen,
  onClose,
  tripTitle,
  locationName,
}: ShareTripModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "https://wayfare.atelier";

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Explore my curated journey: "${tripTitle}" in ${locationName} on WAYFARE Atelier: ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[36px] p-6 md:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-surface-container dark:border-[#2A2A2A]">
          <div className="text-left">
            <span className="font-sans text-[10px] uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-1">
              Voyage Distribution
            </span>
            <h3 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal">
              Share Itinerary Folio
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

        {/* QR Code Graphic Placeholder */}
        <div className="w-40 h-40 mx-auto my-4 p-3 bg-white rounded-[24px] border-2 border-on-surface flex items-center justify-center shadow-subtle">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}`}
            alt="Trip QR Code"
            className="w-full h-full object-contain"
          />
        </div>

        <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] mb-4">
          Scan to open this grounded itinerary instantly on your mobile device.
        </p>

        {/* Copy Link Input Bar */}
        <div className="flex items-center gap-2 p-1.5 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#201F1F] mb-4">
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="w-full bg-transparent px-3 text-xs font-sans text-on-surface dark:text-[#FAF7F2] focus:outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Direct Sharing Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 py-2.5 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] bg-surface-container-low dark:bg-[#201F1F] text-on-surface dark:text-[#FAF7F2] font-sans text-xs font-semibold hover:bg-surface-container transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-600">send</span>
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: tripTitle, url: currentUrl });
              } else {
                handleCopy();
              }
            }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] bg-surface-container-low dark:bg-[#201F1F] text-on-surface dark:text-[#FAF7F2] font-sans text-xs font-semibold hover:bg-surface-container transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">share</span>
            <span>System Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
