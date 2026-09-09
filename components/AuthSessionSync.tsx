"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

/**
 * AuthSessionSync runs globally on client mount.
 * When a user completes Google OAuth, Supabase redirects with a `?code=` parameter.
 * This component exchanges the code for a full session in localStorage,
 * cleans the URL query string, and triggers Supabase onAuthStateChange.
 */
export default function AuthSessionSync() {
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
          } else if (data?.session) {
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

  return null;
}
