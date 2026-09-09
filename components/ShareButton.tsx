"use client";

import { useState, useEffect } from "react";
import { trackShareClicked } from "@/lib/analytics";

interface ShareButtonProps {
  destination: string;
  url?: string;
  title?: string;
  compact?: boolean;
}

export default function ShareButton({
  destination,
  url,
  title = "My WAYFARE Itinerary",
  compact = false,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(url || "");
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (!url) setShareUrl(window.location.href);
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, [url]);

  const shareText = `Check out my ${destination} itinerary on WAYFARE! ✈️`;

  const handleWhatsApp = () => {
    trackShareClicked("whatsapp", destination);
    const text = encodeURIComponent(`${shareText}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      trackShareClicked("copy", destination);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitter = () => {
    trackShareClicked("twitter", destination);
    const text = encodeURIComponent(shareText);
    const link = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${link}`,
      "_blank"
    );
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, text: shareText, url: shareUrl });
      trackShareClicked("native", destination);
    } catch {
      // user cancelled — no-op
    }
  };

  const btnBase =
    "inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider rounded-full border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer";

  const padClass = compact ? "px-2.5 py-1.5" : "px-4 py-2";

  return (
    <div className="flex flex-col gap-3">
      {!compact && (
        <span className="font-sans text-[10px] uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.5)] font-semibold">
          Share this trip
        </span>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {/* WhatsApp — priority for India */}
        <button
          onClick={handleWhatsApp}
          aria-label="Share on WhatsApp"
          className={`${btnBase} ${padClass} bg-green-600 dark:bg-green-700 text-white border-green-700 dark:border-green-600 hover:bg-green-700`}
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {!compact && <span>WhatsApp</span>}
        </button>

        {/* Copy link */}
        <button
          onClick={handleCopy}
          aria-label="Copy trip link to clipboard"
          className={`${btnBase} ${padClass} ${
            copied
              ? "bg-primary dark:bg-[#1E8C80] text-white dark:text-[#131313] border-primary dark:border-[#1E8C80]"
              : "bg-surface-container-low dark:bg-[#1C1B1B] text-on-surface dark:text-[#FAF7F2] border-on-surface dark:border-[rgba(250,247,242,0.3)] hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {copied ? "check_circle" : "link"}
          </span>
          {!compact && <span>{copied ? "Copied!" : "Copy Link"}</span>}
        </button>

        {/* Twitter/X */}
        <button
          onClick={handleTwitter}
          aria-label="Share on Twitter / X"
          className={`${btnBase} ${padClass} bg-[#000] dark:bg-[#111] text-white border-[#000] dark:border-[#333] hover:bg-[#111]`}
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          {!compact && <span>X / Twitter</span>}
        </button>

        {/* Native share — mobile only */}
        {canShare && (
          <button
            onClick={handleNativeShare}
            aria-label="Share using device share sheet"
            className={`${btnBase} ${padClass} bg-surface-container-low dark:bg-[#1C1B1B] text-on-surface dark:text-[#FAF7F2] border-on-surface dark:border-[rgba(250,247,242,0.3)] hover:bg-surface-container lg:hidden`}
          >
            <span className="material-symbols-outlined text-[14px]">ios_share</span>
            {!compact && <span>More</span>}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Floating share button for mobile itinerary view ──────────────── */
export function FloatingShareButton({ destination }: { destination: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sheet */}
      <div
        className={`fixed bottom-20 left-4 right-4 z-[80] lg:hidden bg-surface dark:bg-[#1C1B1B] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[28px] p-6 transition-all duration-300 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <span className="font-serif text-lg text-on-surface dark:text-[#FAF7F2]">
            Share this itinerary
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close share panel"
            className="w-8 h-8 rounded-full border-2 border-on-surface/20 dark:border-[rgba(250,247,242,0.2)] flex items-center justify-center hover:bg-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface dark:text-[#FAF7F2]">close</span>
          </button>
        </div>
        <ShareButton destination={destination} />
      </div>

      {/* FAB trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Share this trip"
        className="fixed bottom-24 right-4 z-[60] lg:hidden w-12 h-12 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-on-surface dark:border-[#1E8C80] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
      >
        <span className="material-symbols-outlined text-[22px]">share</span>
      </button>
    </>
  );
}
