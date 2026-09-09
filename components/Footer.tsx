import React from "react";
import Link from "next/link";

const navLinks = [
  { label: "Explore", href: "/" },
  { label: "Itinerary", href: "/itinerary" },
  { label: "Stays", href: "/stays" },
  { label: "My Trips", href: "/my-trips" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const popularDestinations = [
  { label: "Varanasi", href: "/itinerary?location=Varanasi%2C%20India" },
  { label: "Leh Ladakh", href: "/itinerary?location=Leh%20Ladakh%2C%20India" },
  { label: "Kerala", href: "/itinerary?location=Alleppey%2C%20Kerala%2C%20India" },
  { label: "Jaipur", href: "/itinerary?location=Jaipur%2C%20India" },
  { label: "Rishikesh", href: "/itinerary?location=Rishikesh%2C%20India" },
  { label: "Hampi", href: "/itinerary?location=Hampi%2C%20India" },
];

const linkClass =
  "font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.55)] hover:text-on-surface dark:hover:text-[#FAF7F2] transition-colors";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low dark:bg-[#1C1B1B] border-t-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] mt-16 pt-12 pb-20 lg:pb-12 transition-colors">
      <div className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">

        {/* Top row */}
        <div className="flex flex-col md:flex-row gap-10 pb-10 border-b-2 border-surface-container dark:border-[#2A2A2A]">
          {/* Brand col */}
          <div className="md:w-1/3">
            <Link href="/" className="flex items-center gap-2.5 group mb-4 w-fit">
              <div className="w-7 h-7 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] flex items-center justify-center p-0.5 transition-transform duration-300 group-hover:rotate-45">
                <span className="material-symbols-outlined text-[14px] text-on-surface dark:text-[#FAF7F2]">explore</span>
              </div>
              <span className="font-serif text-lg tracking-widest text-on-surface dark:text-[#FAF7F2] uppercase">WAYFARE</span>
            </Link>
            <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.55)] leading-relaxed max-w-xs">
              AI-powered travel discovery & planning for India and beyond. Bespoke itineraries, curated stays, and quiet observation.
            </p>
            {/* Built with badge */}
            <div className="flex items-center gap-1.5 mt-4">
              <span className="font-sans text-[10px] text-outline dark:text-[rgba(250,247,242,0.35)] uppercase tracking-widest">Powered by</span>
              <span className="font-sans text-[10px] font-semibold text-primary dark:text-[#1E8C80]">Gemini AI · Google Places · Supabase</span>
            </div>
          </div>

          {/* Navigation col */}
          <div className="md:w-1/5">
            <h3 className="font-sans text-[10px] uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.4)] mb-4 font-semibold">Navigate</h3>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations col */}
          <div className="md:w-1/4">
            <h3 className="font-sans text-[10px] uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.4)] mb-4 font-semibold">Popular Destinations</h3>
            <ul className="space-y-3">
              {popularDestinations.map((d) => (
                <li key={d.href}>
                  <Link href={d.href} className={linkClass}>{d.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal col */}
          <div className="md:w-1/5">
            <h3 className="font-sans text-[10px] uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.4)] mb-4 font-semibold">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[11px] text-outline dark:text-[rgba(250,247,242,0.4)] text-center sm:text-left">
            © {new Date().getFullYear()} WAYFARE Atelier Travel. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="font-sans text-[11px] text-outline dark:text-[rgba(250,247,242,0.4)] hover:text-on-surface dark:hover:text-[#FAF7F2] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
