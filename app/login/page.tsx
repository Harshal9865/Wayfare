"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || "Google authentication failed");
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      setErrorMsg(null);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to dispatch login link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#131313] transition-colors">
      <Navbar />

      <main className="flex-1 w-full pt-28 pb-16 flex items-center justify-center px-margin-mobile">
        <div className="w-full max-w-md bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[36px] p-8 md:p-10 text-center">
          {/* Brand Icon */}
          <div className="w-14 h-14 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] bg-surface-container-low dark:bg-[#201F1F] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[28px] text-on-surface dark:text-[#FAF7F2]">explore</span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-on-surface dark:text-[#FAF7F2] font-normal mb-2">
            Wayfare
          </h1>
          <p className="font-serif italic text-sm text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] mb-8">
            Enter your quiet sanctuary for thoughtful exploration.
          </p>

          {submitted ? (
            <div className="p-6 bg-surface-container-low dark:bg-[#201F1F] rounded-[24px] border-2 border-on-surface dark:border-[rgba(250,247,242,0.25)]">
              <span className="material-symbols-outlined text-3xl text-primary dark:text-[#1E8C80] mb-2 block">
                mark_email_read
              </span>
              <h3 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-normal mb-1">
                Access Token Dispatched
              </h3>
              <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.7)]">
                Check your inbox to authenticate your Wayfare session.
              </p>
              <Link
                href="/"
                className="mt-4 inline-block font-sans text-xs uppercase tracking-wider text-primary dark:text-[#1E8C80] font-semibold underline"
              >
                Return to Explore →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4 text-left">
              {errorMsg && (
                <div className="p-3 rounded-[18px] bg-rose-500/10 border-2 border-rose-500 text-rose-600 dark:text-rose-400 font-sans text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="font-sans text-[11px] uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-semibold block mb-1.5 pl-1">
                  Member Credentials
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-full px-5 py-3 text-sm text-on-surface dark:text-[#FAF7F2] placeholder:text-outline focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] hover:bg-primary py-3.5 rounded-full border-2 border-on-surface dark:border-[#1E8C80] font-sans text-sm font-medium transition-colors cursor-pointer disabled:opacity-80"
              >
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>Continue with Google</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-surface-container-lowest dark:bg-[#201F1F] text-on-surface dark:text-[#FAF7F2] hover:bg-surface-variant py-3 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] font-sans text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer disabled:opacity-80"
              >
                {loading ? "Dispatching Access Link..." : "Continue with Email"}
              </button>
            </form>
          )}

          <div className="mt-8 pt-4 border-t-2 border-surface-container dark:border-[#2A2A2A]">
            <Link
              href="/"
              className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] hover:text-on-surface underline tracking-wider"
            >
              Continue as guest →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
