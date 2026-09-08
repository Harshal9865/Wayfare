import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low dark:bg-[#1C1B1B] border-t-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] mt-24 py-12 transition-colors">
      <div className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] flex items-center justify-center p-0.5">
            <span className="material-symbols-outlined text-[14px]">explore</span>
          </div>
          <span className="font-serif text-xl tracking-widest text-on-surface dark:text-[#FAF7F2] uppercase">
            WAYFARE
          </span>
        </div>

        {/* Copyright */}
        <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] text-center tracking-wide">
          © {new Date().getFullYear()} WAYFARE Atelier Travel. All journal rights reserved. Powered by Grounded AI.
        </p>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            href="#"
            className="font-sans text-xs uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] hover:text-on-surface dark:hover:text-[#FAF7F2] transition-colors"
          >
            Archive
          </Link>
          <Link
            href="#"
            className="font-sans text-xs uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] hover:text-on-surface dark:hover:text-[#FAF7F2] transition-colors"
          >
            Colophon
          </Link>
          <Link
            href="#"
            className="font-sans text-xs uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] hover:text-on-surface dark:hover:text-[#FAF7F2] transition-colors"
          >
            Dispatch
          </Link>
        </div>
      </div>
    </footer>
  );
}
