"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setErrorMsg("");
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok || data.success) {
        setStatus("success");
      } else if (res.status === 409) {
        setStatus("success"); // already subscribed — treat as success
      } else {
        throw new Error(data.error || "Subscription failed");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  };

  return (
    <section className="w-full bg-surface-container-low dark:bg-[#1C1B1B] border-y-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] py-16 transition-colors">
      <div className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#1A1A1A]">
            <span className="w-2 h-2 rounded-full bg-primary dark:bg-[#1E8C80] animate-pulse" />
            <span className="font-sans text-xs uppercase tracking-widest text-on-surface dark:text-[#FAF7F2] font-medium">
              Weekly Dispatches
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-on-surface dark:text-[#FAF7F2] font-normal leading-tight">
            Get weekly destination dispatches.
          </h2>
          <p className="font-sans text-sm text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] leading-relaxed max-w-md">
            Curated itineraries, hidden gems, and off-season travel tips — straight to your inbox. No spam, ever.
          </p>

          {status === "success" ? (
            <div className="flex items-center gap-3 px-6 py-4 bg-primary/10 dark:bg-[#1E8C80]/15 border-2 border-primary/30 dark:border-[#1E8C80]/40 rounded-[20px] text-primary dark:text-[#1E8C80]">
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
              <span className="font-sans text-sm font-medium">
                You're on the list! First dispatch arrives soon. ✈️
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-md" noValidate>
              <div className="flex items-center gap-2 bg-surface-container-lowest dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-full p-1.5 pr-2 focus-within:border-primary dark:focus-within:border-[#1E8C80] transition-colors">
                <span className="material-symbols-outlined text-[20px] text-outline dark:text-[rgba(250,247,242,0.5)] ml-4">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent font-sans text-sm text-on-surface dark:text-[#FAF7F2] placeholder:text-outline dark:placeholder:text-[rgba(250,247,242,0.4)] focus:outline-none px-2"
                  aria-label="Email address for newsletter"
                  required
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center gap-1.5 bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] px-5 py-2.5 rounded-full border-2 border-on-surface dark:border-[#1E8C80] font-sans text-xs font-semibold uppercase tracking-wider hover:bg-primary dark:hover:bg-[#1A7A70] transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-wait cursor-pointer"
                >
                  {status === "loading" ? (
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <span className="material-symbols-outlined text-[16px]">send</span>
                    </>
                  )}
                </button>
              </div>

              {errorMsg && (
                <p className="font-sans text-xs text-rose-500 dark:text-rose-400 mt-2 text-center">
                  {errorMsg}
                </p>
              )}

              <p className="font-sans text-[10px] text-outline dark:text-[rgba(250,247,242,0.4)] mt-3 text-center">
                By subscribing you agree to our{" "}
                <Link href="/privacy" className="text-primary dark:text-[#1E8C80] underline underline-offset-2">
                  Privacy Policy
                </Link>
                . Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
