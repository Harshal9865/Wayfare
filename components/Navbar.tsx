"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import PersonalizedPlanModal from "@/components/PersonalizedPlanModal";
import HowItWorksModal from "@/components/HowItWorksModal";
import { useCurrency, CURRENCIES, CurrencyCode } from "@/lib/currency";
import { useRegion } from "@/lib/region";
import { supabase } from "@/lib/supabase";

export default function Navbar({ onOpenLogin }: { onOpenLogin?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();
  const { region, setRegion } = useRegion();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const currencyRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Click outside listener: Automatically close dropdowns/menus when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (currencyRef.current && !currencyRef.current.contains(target)) {
        setShowCurrencyDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowCurrencyDropdown(false);
        setShowUserMenu(false);
        setIsMobileSheetOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close menus on page route changes
  useEffect(() => {
    setShowCurrencyDropdown(false);
    setShowUserMenu(false);
    setIsMobileSheetOpen(false);
  }, [pathname]);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    // Check initial Supabase user
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
    });

    // Listen for live Supabase Auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Passive scroll listener for 120fps dynamic height & glassmorphism
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Real-time IST clock ticker
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeStr);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);

    return () => {
      authListener?.subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowUserMenu(false);
  };

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navItems = [
    { label: "Explore", href: "/" },
    { label: "Itinerary", href: "/itinerary" },
    { label: "Stays", href: "/stays" },
    { label: "My Trips", href: "/my-trips" },
  ];

  // Bottom nav items (4 direct links + More button)
  const bottomNavItems = [
    { label: "Home", icon: "home", href: "/" },
    { label: "Itinerary", icon: "map", href: "/itinerary" },
    { label: "Stays", icon: "hotel", href: "/stays" },
    { label: "My Trips", icon: "folder_open", href: "/my-trips" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 border-b-2 transition-all duration-300 ${
          isScrolled
            ? "h-16 bg-surface/95 dark:bg-[#131313]/95 backdrop-blur-md border-on-surface dark:border-[rgba(250,247,242,0.3)] shadow-sm"
            : "h-20 bg-surface dark:bg-[#131313] border-on-surface dark:border-[rgba(250,247,242,0.25)]"
        }`}
      >
        <div className="h-full w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-2">
          {/* Left: Logo & Live Dispatch Ticker */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] flex items-center justify-center p-1 bg-surface-container-low dark:bg-[#1C1B1B] transition-transform duration-300 group-hover:rotate-45">
                <span className="material-symbols-outlined text-[18px] text-on-surface dark:text-[#FAF7F2]">explore</span>
              </div>
              <span className="font-serif text-xl sm:text-2xl tracking-widest text-on-surface dark:text-[#FAF7F2] uppercase font-normal">
                WAYFARE
              </span>
            </Link>

            {/* Live IST Dispatch Pill (Hidden on Mobile) */}
            {currentTime && (
              <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-on-surface/20 dark:border-[rgba(250,247,242,0.2)] bg-surface-container-low/60 dark:bg-[#1C1B1B]/60 text-[11px] font-sans text-on-surface-variant dark:text-[rgba(250,247,242,0.7)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Dispatch • {currentTime} IST</span>
              </div>
            )}
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`font-sans text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] rounded-full px-4 py-1.5 border-2 border-on-surface dark:border-[#1E8C80] font-semibold"
                      : "text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] hover:text-on-surface dark:hover:text-[#FAF7F2] px-3 py-1.5 hover:scale-105 active:scale-95"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Custom Curation Action */}
            <button
              onClick={() => setIsPersonalizeOpen(true)}
              className="font-sans text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#201F1F] text-primary dark:text-[#1E8C80] font-semibold hover:bg-surface-container dark:hover:bg-[#2A2A2A] flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              <span>Personalize</span>
            </button>
          </nav>

          {/* Right Action Controls: Region Switcher, Currency, Help & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Region Mode Toggle (India vs Abroad) */}
            <button
              type="button"
              onClick={() => setRegion(region === "india" ? "abroad" : "india")}
              aria-label={`Switch travel region. Current: ${region === "india" ? "India" : "Abroad"}`}
              className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border-2 text-xs font-sans font-semibold transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                region === "india"
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-600/40"
                  : "bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 border-sky-600/40"
              }`}
            >
              <span aria-hidden="true">{region === "india" ? "🇮🇳" : "🌐"}</span>
              <span className="hidden lg:inline uppercase">{region === "india" ? "India" : "Abroad"}</span>
            </button>

            {/* Beginner Guide (?) Button — desktop only */}
            <button
              type="button"
              onClick={() => setIsHowItWorksOpen(true)}
              aria-label="How Wayfare works — guide"
              className="hidden lg:inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border-2 border-on-surface/30 dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#1C1B1B] text-xs font-sans font-semibold text-primary dark:text-[#1E8C80] hover:bg-surface-container transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]" aria-hidden="true">help_outline</span>
              <span className="hidden sm:inline">Guide</span>
            </button>

            {/* Currency Selector — desktop only */}
            <div className="relative hidden lg:block" ref={currencyRef}>
              <button
                type="button"
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#1C1B1B] text-xs font-sans font-semibold text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Change display currency"
              >
                <span>{CURRENCIES[currency].symbol}</span>
                <span className="uppercase">{currency}</span>
                <span className="material-symbols-outlined text-[14px]">expand_more</span>
              </button>

              {showCurrencyDropdown && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-surface-container-lowest dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[20px] p-1.5 shadow-dropdown z-50 animate-in fade-in-50 duration-150">
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setShowCurrencyDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-[12px] text-xs font-sans font-medium flex items-center justify-between cursor-pointer transition-colors ${
                        currency === c
                          ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] font-semibold"
                          : "text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container dark:hover:bg-[#2A2A2A]"
                      }`}
                    >
                      <span>{CURRENCIES[c].label}</span>
                      {currency === c && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Day / Night Switcher — desktop only */}
            <div className="hidden lg:flex items-center p-1 bg-surface-container-low dark:bg-[#1C1B1B] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-full">
              <button
                onClick={() => {
                  if (isDarkMode) toggleTheme();
                }}
                aria-label="Light mode"
                className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 cursor-pointer ${
                  !isDarkMode
                    ? "bg-primary-container text-white border-2 border-on-surface rotate-0"
                    : "text-on-surface-variant hover:text-on-surface dark:text-[rgba(250,247,242,0.5)] -rotate-90"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">light_mode</span>
              </button>
              <button
                onClick={() => {
                  if (!isDarkMode) toggleTheme();
                }}
                aria-label="Dark mode"
                className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 cursor-pointer ${
                  isDarkMode
                    ? "bg-[#1E8C80] text-[#131313] border-2 border-[#1E8C80] rotate-0"
                    : "text-on-surface-variant hover:text-on-surface rotate-90"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">dark_mode</span>
              </button>
            </div>

            {/* Profile / Auth Menu */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-primary dark:border-[#1E8C80] bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] font-serif text-sm font-semibold flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  title={user.email}
                >
                  {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                </button>
              ) : (
                <button
                  onClick={() => (onOpenLogin ? onOpenLogin() : router.push("/login"))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#201F1F] text-xs font-sans uppercase tracking-wider font-semibold text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">person</span>
                  <span className="hidden sm:inline">Access</span>
                </button>
              )}

              {user && showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[24px] p-3 shadow-dropdown z-50 animate-in fade-in-50 duration-150 text-left">
                  <div className="px-3 py-2 border-b-2 border-surface-container dark:border-[#2A2A2A] mb-2">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block">
                      Atelier Member
                    </span>
                    <p className="font-sans text-xs text-on-surface dark:text-[#FAF7F2] truncate font-medium mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/my-trips"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-[14px] text-xs font-sans text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container dark:hover:bg-[#2A2A2A] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">folder_open</span>
                    <span>My Journeys</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-[14px] text-xs font-sans text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left mt-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* NOTE: Mobile hamburger button intentionally removed — navigation is now via bottom nav */}
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          STICKY BOTTOM NAV BAR — mobile only (< lg)
      ───────────────────────────────────────────────────────────── */}
      <nav
        aria-label="Mobile bottom navigation"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-surface/95 dark:bg-[#131313]/95 backdrop-blur-md border-t-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] h-16 flex items-center justify-around"
      >
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors ${
                isActive
                  ? "text-primary dark:text-[#1E8C80]"
                  : "text-on-surface-variant dark:text-[rgba(250,247,242,0.5)]"
              }`}
            >
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">{item.icon}</span>
              <span className="text-[9px] uppercase tracking-wide font-sans font-semibold">{item.label}</span>
            </Link>
          );
        })}

        {/* More button */}
        <button
          type="button"
          onClick={() => setIsMobileSheetOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-3 transition-colors text-on-surface-variant dark:text-[rgba(250,247,242,0.5)] cursor-pointer"
          aria-label="Open more options"
        >
          <span className="material-symbols-outlined text-[22px]">more_horiz</span>
          <span className="text-[9px] uppercase tracking-wide font-sans font-semibold">More</span>
        </button>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          MORE SHEET — slide up from bottom, mobile only
      ───────────────────────────────────────────────────────────── */}
      {isMobileSheetOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsMobileSheetOpen(false)}
            aria-hidden="true"
          />

          {/* Sheet panel */}
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden animate-in slide-in-from-bottom duration-300">
            <div className="bg-surface dark:bg-[#1A1A1A] rounded-t-[32px] border-t-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] p-6">
              {/* Drag handle pill */}
              <div className="flex justify-center mb-5">
                <div className="w-10 h-1 rounded-full bg-on-surface/20 dark:bg-[rgba(250,247,242,0.2)]" />
              </div>

              {/* Section 1: Theme */}
              <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.5)] font-semibold mb-2">
                Theme
              </p>
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => { if (isDarkMode) toggleTheme(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl border-2 font-sans text-sm font-semibold transition-all cursor-pointer ${
                    !isDarkMode
                      ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-on-surface dark:border-[#1E8C80]"
                      : "border-on-surface/20 dark:border-[rgba(250,247,242,0.2)] text-on-surface-variant dark:text-[rgba(250,247,242,0.5)]"
                  }`}
                >
                  <span>☀️</span>
                  <span>Light</span>
                </button>
                <button
                  onClick={() => { if (!isDarkMode) toggleTheme(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl border-2 font-sans text-sm font-semibold transition-all cursor-pointer ${
                    isDarkMode
                      ? "bg-[#1E8C80] text-[#131313] border-[#1E8C80]"
                      : "border-on-surface/20 dark:border-[rgba(250,247,242,0.2)] text-on-surface-variant dark:text-[rgba(250,247,242,0.5)]"
                  }`}
                >
                  <span>🌙</span>
                  <span>Dark</span>
                </button>
              </div>

              {/* Section 2: Currency */}
              <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.5)] font-semibold mb-2">
                Currency
              </p>
              <div className="flex gap-2 mb-5 flex-wrap">
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl border-2 font-sans text-sm font-semibold transition-all cursor-pointer ${
                      currency === c
                        ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-on-surface dark:border-[#1E8C80]"
                        : "border-on-surface/20 dark:border-[rgba(250,247,242,0.2)] text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container dark:hover:bg-[#2A2A2A]"
                    }`}
                  >
                    <span>{CURRENCIES[c].symbol}</span>
                    <span className="uppercase">{c}</span>
                  </button>
                ))}
              </div>

              {/* Section 3: Quick Actions */}
              <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.5)] font-semibold mb-2">
                Quick Actions
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsMobileSheetOpen(false);
                    setIsPersonalizeOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#201F1F] text-primary dark:text-[#1E8C80] font-sans text-sm font-semibold cursor-pointer hover:bg-surface-container dark:hover:bg-[#2A2A2A] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  <span>Personalize</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileSheetOpen(false);
                    setIsHowItWorksOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#201F1F] text-primary dark:text-[#1E8C80] font-sans text-sm font-semibold cursor-pointer hover:bg-surface-container dark:hover:bg-[#2A2A2A] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">help_outline</span>
                  <span>Guide</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <PersonalizedPlanModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      {/* Spacer: pushes page content above the fixed bottom nav on mobile */}
      <div className="h-16 lg:hidden" />
    </>
  );
}
