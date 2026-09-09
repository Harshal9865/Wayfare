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

    const exchangeCode = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.warn("Supabase OAuth code exchange warning:", error.message);
          } else if (data?.session?.user) {
            const user = data.session.user;
            const name =
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email?.split("@")[0] ||
              "Voyager";
            setWelcomeToast({ name, email: user.email || "" });

            // Auto-hide toast after 5s
            setTimeout(() => setWelcomeToast(null), 5000);

            // Clean up the URL query params without reloading the page
            url.searchParams.delete("code");
            url.searchParams.delete("state");
            const cleanUrl = url.pathname + (url.search ? url.search : "") + url.hash;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        }
      } catch (err) {
        console.error("Unexpected error exchanging OAuth code:", err);
      }
    };

    exchangeCode();
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
