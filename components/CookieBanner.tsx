"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("wayfare_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("wayfare_cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("wayfare_cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-0 left-0 right-0 z-[60] px-4 pb-4 lg:pb-6 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-surface dark:bg-[#1C1B1B] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[28px] px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
        {/* Icon */}
        <div className="w-9 h-9 flex-shrink-0 rounded-full bg-primary/10 dark:bg-[#1E8C80]/15 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary dark:text-[#1E8C80] text-[20px]">cookie</span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-sans text-xs text-on-surface dark:text-[#FAF7F2] leading-relaxed">
            We use cookies to improve your experience and analyse site usage.{" "}
            <Link
              href="/privacy"
              className="text-primary dark:text-[#1E8C80] underline underline-offset-2 hover:opacity-80"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={decline}
            className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] px-3 py-1.5 rounded-full border border-on-surface/20 dark:border-[rgba(250,247,242,0.2)] hover:bg-surface-container dark:hover:bg-[#2A2A2A] transition-colors cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="font-sans text-xs font-semibold text-white dark:text-[#131313] bg-primary-container dark:bg-[#1E8C80] px-4 py-1.5 rounded-full border-2 border-on-surface dark:border-[#1E8C80] hover:bg-primary dark:hover:bg-[#1A7A70] transition-colors cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
