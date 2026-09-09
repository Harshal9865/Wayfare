"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { setStoredUser, toWayfareUser } from "@/lib/auth";

/**
 * AuthSessionSync runs globally on client mount.
 * When a user completes Google OAuth, Supabase redirects with `#access_token=` (implicit)
 * or `?code=` (PKCE). This component establishes the session, syncs it to local storage
 * and the global auth event bus, cleans URL params, and displays an immediate confirmation toast.
 */
export default function AuthSessionSync() {
  const [welcomeToast, setWelcomeToast] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const hash = window.location.hash;
    const hasHashTokens = hash.includes("access_token");
    const hasCode = url.searchParams.has("code");

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

    const handleUserFound = (user: any) => {
      const wUser = toWayfareUser(user);
      setStoredUser(wUser);
      setWelcomeToast({ name: wUser.name || "Voyager", email: wUser.email });
      cleanUrlParams();
      setTimeout(() => setWelcomeToast(null), 5000);

      // Check if user was trying to access a specific itinerary before login
      try {
        const pendingRedirect = sessionStorage.getItem("wayfare_redirect_after_auth");
        if (pendingRedirect) {
          sessionStorage.removeItem("wayfare_redirect_after_auth");
          window.location.assign(pendingRedirect);
        }
      } catch (_) {}
    };

    // A. Handle Hash Tokens (Implicit flow: #access_token=...&refresh_token=...)
    if (hasHashTokens) {
      const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
      const access_token = hashParams.get("access_token");
      const refresh_token = hashParams.get("refresh_token") || "";

      if (access_token) {
        supabase.auth
          .setSession({ access_token, refresh_token })
          .then(({ data, error }) => {
            if (data?.session?.user && !error) {
              handleUserFound(data.session.user);
            }
          })
          .catch((err) => {
            console.warn("Error setting implicit session:", err);
          });
      }
    }

    // B. Handle Code Query Param (PKCE flow: ?code=...)
    if (hasCode) {
      const code = url.searchParams.get("code")!;
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ data, error }) => {
          if (data?.session?.user && !error) {
            handleUserFound(data.session.user);
          }
        })
        .catch((err) => {
          console.warn("Error exchanging code for session:", err);
        });
    }

    // C. Listen for Supabase auth state change events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        handleUserFound(session.user);
      }
    });

    // D. Check existing session in Supabase storage
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUserFound(session.user);
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
