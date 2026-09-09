"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/**
 * AuthSessionSync runs globally on client mount.
 * When a user completes Google OAuth, Supabase redirects with a `?code=` parameter.
 * This component exchanges the code for a full session in localStorage,
 * cleans the URL query string, triggers Supabase onAuthStateChange,
 * and displays an immediate confirmation toast so the user knows they are authenticated.
 */
export default function AuthSessionSync() {
  const [welcomeToast, setWelcomeToast] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const hasOAuthParams = url.searchParams.has("code") || window.location.hash.includes("access_token");

    const cleanUrlParams = () => {
      try {
        const clean = new URL(window.location.href);
        clean.searchParams.delete("code");
        clean.searchParams.delete("state");
        clean.searchParams.delete("error");
        clean.searchParams.delete("error_description");
        const cleanHash = window.location.hash.includes("access_token") ? "" : clean.hash;
        const cleanUrl = clean.pathname + (clean.search ? clean.search : "") + cleanHash;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (_) {}
    };

    // 1. Listen for Supabase auth state change events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        const user = session.user;
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Voyager";

        if (hasOAuthParams) {
          setWelcomeToast({ name, email: user.email || "" });
          cleanUrlParams();
          setTimeout(() => setWelcomeToast(null), 5000);
        }
      }
    });

    // 2. Also check if a session is already present
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && hasOAuthParams) {
        cleanUrlParams();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!welcomeToast) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-300 pointer-events-auto max-w-sm w-[90%] sm:w-auto">
      <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-surface dark:bg-[#1C1B1B] border-2 border-primary dark:border-[#1E8C80] shadow-2xl">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
        <div className="text-left min-w-0">
          <p className="font-sans text-xs font-bold text-on-surface dark:text-[#FAF7F2] truncate">
            Welcome, {welcomeToast.name}!
          </p>
          <p className="font-sans text-[10px] text-primary dark:text-[#1E8C80] font-semibold">
            Google Account Connected • Full Access Active
          </p>
        </div>
        <button
          onClick={() => setWelcomeToast(null)}
          className="ml-2 text-on-surface-variant hover:text-on-surface text-xs font-bold p-1 cursor-pointer"
          aria-label="Dismiss notice"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
