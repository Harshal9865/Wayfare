"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import PersonalizedPlanModal from "@/components/PersonalizedPlanModal";
import HowItWorksModal from "@/components/HowItWorksModal";
import { useCurrency, CURRENCIES, CurrencyCode } from "@/lib/currency";
import { useRegion } from "@/lib/region";
import { supabase } from "@/lib/supabase";
import { getStoredUser, setStoredUser, onAuthChanged, toWayfareUser } from "@/lib/auth";

export default function Navbar({ onOpenLogin }: { onOpenLogin?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();
  const { region, setRegion } = useRegion();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
    // 1. Theme initialization with localStorage memory
    const savedTheme = typeof window !== "undefined" ? localStorage.getItem("wayfare_theme") : null;
    const isDark = savedTheme ? savedTheme === "dark" : document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // 2. Initial user from synchronous storage cache (instant UI update)
    const cachedUser = getStoredUser();
    if (cachedUser) {
      setUser(cachedUser);
    }

    // 3. Listen for immediate global auth events across the app
    const unsubAuth = onAuthChanged((updatedUser) => {
      setUser(updatedUser);
    });

    // 4. Verify live session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const wUser = toWayfareUser(session.user);
        setStoredUser(wUser);
        setUser(wUser);
      }
    });


    // 6. Listen for live Supabase Auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const wUser = toWayfareUser(session.user);
        setStoredUser(wUser);
        setUser(wUser);
      } else if (event === "SIGNED_OUT") {
        setStoredUser(null);
        setUser(null);
      }
    });

    // Passive scroll listener for 120fps dynamic height & glassmorphism
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      unsubAuth();
      authListener?.subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setStoredUser(null);
    setUser(null);
    setShowUserMenu(false);
  };

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      if (typeof window !== "undefined") {
        localStorage.setItem("wayfare_theme", "dark");
      }
    } else {
      document.documentElement.classList.remove("dark");
      if (typeof window !== "undefined") {
        localStorage.setItem("wayfare_theme", "light");
      }
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

  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : "");
  const userInitial = userName
    ? userName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

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
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] flex items-center justify-center p-1 bg-surface-container-low dark:bg-[#1C1B1B] transition-transform duration-300 group-hover:rotate-45">
                <span className="material-symbols-outlined text-[18px] text-on-surface dark:text-[#FAF7F2]">explore</span>
              </div>
              <span className="font-serif text-xl sm:text-2xl tracking-widest text-on-surface dark:text-[#FAF7F2] uppercase font-normal">
                WAYFARE
              </span>
            </Link>
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
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border-2 border-primary/50 dark:border-[#1E8C80] bg-surface-container-low dark:bg-[#1C1B1B] hover:bg-surface-container dark:hover:bg-[#252525] transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                  title={user.email}
                  aria-label="Open account menu"
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName || "Voyager"}
                      className="w-7 h-7 rounded-full object-cover border border-primary/40 dark:border-[#1E8C80]"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] font-serif text-xs font-semibold flex items-center justify-center">
                      {userInitial}
                    </div>
                  )}
                  <span className="font-sans text-xs font-semibold text-on-surface dark:text-[#FAF7F2] hidden sm:inline max-w-[120px] truncate">
                    {userName}
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
                </button>
              ) : (
                <button
                  onClick={() => (onOpenLogin ? onOpenLogin() : router.push("/login"))}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#201F1F] text-xs font-sans uppercase tracking-wider font-semibold text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  <span className="hidden sm:inline">Access</span>
                </button>
              )}

              {user && showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[24px] p-4 shadow-dropdown z-50 animate-in fade-in-50 duration-150 text-left">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-surface-container dark:border-[#2A2A2A] mb-3">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-primary dark:border-[#1E8C80]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] font-serif text-base font-semibold flex items-center justify-center">
                        {userInitial}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-sans text-xs font-bold text-on-surface dark:text-[#FAF7F2] truncate block">
                          {userName}
                        </span>
                        <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[14px]">verified</span>
                      </div>
                      <p className="font-sans text-[11px] text-outline dark:text-[rgba(250,247,242,0.5)] truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/my-trips"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-xs font-sans text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container dark:hover:bg-[#2A2A2A] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary dark:text-[#1E8C80]">folder_open</span>
                      <span className="font-medium">My Journeys</span>
                    </Link>
                    <Link
                      href="/itinerary"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-xs font-sans text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container dark:hover:bg-[#2A2A2A] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary dark:text-[#1E8C80]">map</span>
                      <span className="font-medium">Active Itinerary</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-xs font-sans text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left mt-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
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

              {/* Member Card / Sign In (Mobile) */}
              {user ? (
                <div className="p-4 rounded-2xl bg-surface-container-low dark:bg-[#201F1F] border-2 border-primary/40 dark:border-[#1E8C80]/50 mb-5 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="w-11 h-11 rounded-full object-cover border-2 border-primary dark:border-[#1E8C80]"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] font-serif text-lg font-semibold flex items-center justify-center">
                        {userInitial}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-sans text-sm font-bold text-on-surface dark:text-[#FAF7F2] truncate">
                          {userName}
                        </span>
                        <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[16px]">verified</span>
                      </div>
                      <p className="font-sans text-xs text-outline dark:text-[rgba(250,247,242,0.5)] truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/my-trips"
                      onClick={() => setIsMobileSheetOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] font-sans text-xs font-semibold"
                    >
                      <span className="material-symbols-outlined text-[16px]">folder_open</span>
                      <span>My Journeys</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileSheetOpen(false);
                      }}
                      className="px-3 py-2 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 font-sans text-xs font-semibold hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-5">
                  <button
                    onClick={() => {
                      setIsMobileSheetOpen(false);
                      if (onOpenLogin) onOpenLogin();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] font-sans text-sm font-semibold border-2 border-on-surface dark:border-[#1E8C80] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    <span>Sign In with Google</span>
                  </button>
                </div>
              )}

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
