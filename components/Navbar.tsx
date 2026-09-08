"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PersonalizedPlanModal from "@/components/PersonalizedPlanModal";
import HowItWorksModal from "@/components/HowItWorksModal";
import { useCurrency, CURRENCIES, CurrencyCode } from "@/lib/currency";
import { useRegion } from "@/lib/region";
import { supabase } from "@/lib/supabase";

export default function Navbar({ onOpenLogin }: { onOpenLogin?: () => void }) {
  const pathname = usePathname();
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currencyRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowCurrencyDropdown(false);
        setShowUserMenu(false);
        setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
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
              className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border-2 text-xs font-sans font-semibold transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                region === "india"
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-600/40"
                  : "bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 border-sky-600/40"
              }`}
              title={`Switch travel region (Current: ${region === "india" ? "India" : "Abroad"})`}
            >
              <span>{region === "india" ? "🇮🇳" : "🌐"}</span>
              <span className="hidden xs:inline uppercase">{region === "india" ? "India" : "Abroad"}</span>
            </button>

            {/* Beginner Guide (?) Button */}
            <button
              type="button"
              onClick={() => setIsHowItWorksOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border-2 border-on-surface/30 dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#1C1B1B] text-xs font-sans font-semibold text-primary dark:text-[#1E8C80] hover:bg-surface-container transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="How Wayfare works guide"
            >
              <span className="material-symbols-outlined text-[15px]">help_outline</span>
              <span className="hidden sm:inline">Guide</span>
            </button>

            {/* Currency Selector */}
            <div className="relative" ref={currencyRef}>
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

            {/* Day / Night Switcher */}
            <div className="hidden sm:flex items-center p-1 bg-surface-container-low dark:bg-[#1C1B1B] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-full">
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
                  onClick={onOpenLogin}
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

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden w-8 h-8 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#1C1B1B] flex items-center justify-center text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer with Click Outside */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden fixed top-16 sm:top-20 left-0 w-full bg-surface/95 dark:bg-[#131313]/95 backdrop-blur-md border-b-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] shadow-2xl z-40 p-5 space-y-3 animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-sans text-sm font-medium px-4 py-2.5 rounded-full border-2 transition-all ${
                    isActive
                      ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-on-surface dark:border-[#1E8C80]"
                      : "text-on-surface dark:text-[#FAF7F2] border-transparent hover:bg-surface-container-low dark:hover:bg-[#1C1B1B]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsHowItWorksOpen(true);
              }}
              className="w-full text-left font-sans text-xs uppercase tracking-wider px-4 py-3 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#201F1F] text-primary dark:text-[#1E8C80] font-semibold flex items-center justify-between cursor-pointer"
            >
              <span>How Wayfare Works (Guide)</span>
              <span className="material-symbols-outlined text-[16px]">help_outline</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsPersonalizeOpen(true);
              }}
              className="w-full text-left font-sans text-xs uppercase tracking-wider px-4 py-3 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#201F1F] text-primary dark:text-[#1E8C80] font-semibold flex items-center justify-between cursor-pointer"
            >
              <span>Personalize Itinerary</span>
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            </button>
          </div>
        </div>
      )}

      <PersonalizedPlanModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </>
  );
}
