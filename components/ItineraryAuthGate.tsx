"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface ItineraryAuthGateProps {
  isOpen: boolean;
  onClose: () => void;
  /** The destination the user wanted to plan — shown in the modal for context */
  destination: string;
  /** Query string to navigate to after login succeeds */
  redirectUrl: string;
}

export default function ItineraryAuthGate({
  isOpen,
  onClose,
  destination,
  redirectUrl,
}: ItineraryAuthGateProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [providerNotice, setProviderNotice] = useState<string | null>(null);

  // Listen for auth changes — if user logs in while modal is open, auto-navigate
  useEffect(() => {
    if (!isOpen) return;
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        onClose();
        router.push(redirectUrl);
      }
    });
    return () => listener?.subscription.unsubscribe();
  }, [isOpen, redirectUrl, onClose, router]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setProviderNotice(null);
      setError("");

      const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || "");
      const targetRedirect = `${origin}${redirectUrl.startsWith("/") ? redirectUrl : `/${redirectUrl}`}`;

      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          skipBrowserRedirect: true,
          redirectTo: targetRedirect,
        },
      });

      if (oauthError) throw oauthError;

      if (data?.url) {
        // Probe whether provider is enabled in Supabase without navigating away
        try {
          const probe = await fetch(data.url, { method: "HEAD" });
          if (probe.status === 400) {
            setProviderNotice(
              "Google Sign-In is not enabled yet in your Supabase project (vajjeedldbzcwxwqsmhs). Please enable Google in your Supabase Dashboard, or click below to proceed right away!"
            );
            setGoogleLoading(false);
            return;
          }
        } catch {
          // If probe fails due to CORS on redirect, it means Supabase redirected to Google OAuth successfully
        }
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.warn("Google login fallback:", err);
      setProviderNotice(
        "Google sign-in is currently pending setup in Supabase. Click below to continue directly."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSending(true);
    setError("");
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error: magicError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${siteUrl}${redirectUrl}` },
      });
      if (magicError) throw magicError;
      setMagicSent(true);
    } catch {
      setError("Couldn't send the link. Try Google sign-in instead.");
    } finally {
      setIsSending(false);
    }
  };

  const handleContinueAsGuest = () => {
    onClose();
    router.push(redirectUrl);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-t-[36px] sm:rounded-[44px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient gradient top band */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1E8C80] via-[#48B5A9] to-[#1E8C80]" />

        <div className="p-7 sm:p-10">
          {/* Drag pill (mobile) */}
          <div className="w-10 h-1 bg-on-surface/20 dark:bg-[rgba(250,247,242,0.2)] rounded-full mx-auto mb-6 sm:hidden" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 w-9 h-9 rounded-full border-2 border-on-surface/20 dark:border-[rgba(250,247,242,0.2)] bg-surface-container-low dark:bg-[#201F1F] flex items-center justify-center text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>

          {/* Destination context pill */}
          {destination && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-primary/30 dark:border-[#1E8C80]/40 bg-primary/5 dark:bg-[#1E8C80]/10 mb-5">
              <span className="material-symbols-outlined text-primary dark:text-[#1E8C80] text-[15px]">location_on</span>
              <span className="font-sans text-xs font-semibold text-primary dark:text-[#1E8C80] uppercase tracking-wider truncate max-w-[200px]">
                {destination}
              </span>
            </div>
          )}

          {!magicSent ? (
            <>
              {/* Headline */}
              <h2 className="font-serif text-3xl sm:text-4xl text-on-surface dark:text-[#FAF7F2] font-normal leading-tight mb-2">
                Unlock Your Itinerary
              </h2>
              <p className="font-sans text-sm text-on-surface-variant dark:text-[rgba(250,247,242,0.65)] leading-relaxed mb-7">
                Sign in to generate a personalized AI itinerary, save your trips, and access curated travel plans — all for free.
              </p>

              {/* Benefits strip */}
              <div className="grid grid-cols-3 gap-3 mb-7">
                {[
                  { icon: "auto_awesome", label: "AI-Generated Itinerary" },
                  { icon: "bookmark", label: "Save Trips Forever" },
                  { icon: "group", label: "Share with Friends" },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 p-3 bg-surface-container-low dark:bg-[#201F1F] border-2 border-on-surface/15 dark:border-[rgba(250,247,242,0.12)] rounded-[18px] text-center"
                  >
                    <span className="material-symbols-outlined text-primary dark:text-[#1E8C80] text-[22px]">{icon}</span>
                    <span className="font-sans text-[10px] uppercase tracking-wide text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              {/* Instant Access Button */}
              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] font-sans text-sm font-semibold border-2 border-on-surface dark:border-[#1E8C80] hover:bg-primary transition-all hover:scale-[1.02] active:scale-95 cursor-pointer mb-3 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Continue Instantly (No Sign-in Needed)</span>
              </button>

              {/* Provider Notice Callout if Google is disabled in Supabase */}
              {providerNotice && (
                <div className="mb-4 p-3.5 rounded-[20px] bg-amber-500/10 border-2 border-amber-500/40 text-left animate-in fade-in">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg flex-shrink-0 mt-0.5">
                      info
                    </span>
                    <div className="flex-1">
                      <p className="font-sans text-xs text-amber-800 dark:text-amber-300 font-semibold mb-1">
                        Google Auth Setup Notice
                      </p>
                      <p className="font-sans text-[11px] text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] leading-relaxed mb-2.5">
                        {providerNotice}
                      </p>
                      <button
                        type="button"
                        onClick={handleContinueAsGuest}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] font-sans text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                      >
                        <span>Continue to Itinerary Now</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-full bg-surface-container-lowest dark:bg-[#131313] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] text-on-surface dark:text-[#FAF7F2] font-sans text-xs font-semibold hover:bg-surface-container dark:hover:bg-[#1C1B1B] transition-all cursor-pointer mb-3 disabled:opacity-75"
              >
                {googleLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-primary dark:border-[#1E8C80] border-t-transparent animate-spin" />
                    <span>Verifying Google Auth...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-on-surface/15 dark:bg-[rgba(250,247,242,0.12)]" />
                <span className="font-sans text-[11px] text-outline dark:text-[rgba(250,247,242,0.4)] uppercase tracking-wider">or with email</span>
                <div className="flex-1 h-px bg-on-surface/15 dark:bg-[rgba(250,247,242,0.12)]" />
              </div>

              {/* Magic Link Form */}
              <form onSubmit={handleMagicLink} className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-surface-container dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] rounded-full px-5 py-3 font-sans text-sm text-on-surface dark:text-[#FAF7F2] placeholder:text-outline dark:placeholder:text-[rgba(250,247,242,0.4)] focus:outline-none focus:border-primary dark:focus:border-[#1E8C80]"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-shrink-0 px-6 py-3 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] font-sans text-sm font-semibold border-2 border-on-surface dark:border-[#1E8C80] hover:bg-primary dark:hover:bg-[#1A7A70] transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSending ? "Sending…" : "Send Link"}
                </button>
              </form>
              {error && (
                <p className="font-sans text-xs text-rose-500 dark:text-rose-400 text-center mb-2">{error}</p>
              )}

              {/* Guest continue */}
              <div className="text-center mt-5">
                <button
                  onClick={handleContinueAsGuest}
                  className="font-sans text-xs text-outline dark:text-[rgba(250,247,242,0.45)] underline underline-offset-2 hover:text-on-surface-variant dark:hover:text-[rgba(250,247,242,0.65)] transition-colors cursor-pointer"
                >
                  Continue as guest — limited features
                </button>
              </div>
            </>
          ) : (
            /* Magic link sent state */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-[#1E8C80]/15 border-2 border-primary/30 dark:border-[#1E8C80]/30 flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-primary dark:text-[#1E8C80] text-[32px]">mark_email_read</span>
              </div>
              <h3 className="font-serif text-2xl text-on-surface dark:text-[#FAF7F2] font-normal mb-2">Check your inbox</h3>
              <p className="font-sans text-sm text-on-surface-variant dark:text-[rgba(250,247,242,0.65)] leading-relaxed mb-6">
                We sent a magic link to <strong className="text-on-surface dark:text-[#FAF7F2]">{email}</strong>. Click it to sign in and your itinerary will open automatically.
              </p>
              <button
                onClick={handleContinueAsGuest}
                className="font-sans text-xs text-outline dark:text-[rgba(250,247,242,0.45)] underline underline-offset-2 hover:text-on-surface-variant cursor-pointer"
              >
                Continue as guest in the meantime
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
