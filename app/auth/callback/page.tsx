"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/";

      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("Callback code exchange error:", error);
          }
        } catch (err) {
          console.error("Auth callback exception:", err);
        }
      }
      router.replace(next);
    };

    processCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#131313]">
      <div className="text-center p-8">
        <div className="w-9 h-9 border-2 border-primary dark:border-[#1E8C80] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal mb-1">
          Authenticating Voyager
        </h2>
        <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.6)]">
          Connecting your Google profile to Wayfare Atelier...
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background dark:bg-[#131313]" />}>
      <CallbackHandler />
    </Suspense>
  );
}
