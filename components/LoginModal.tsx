import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { setStoredUser } from "@/lib/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (email: string) => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      
      // If Supabase URL is placeholder, perform instant local demo session
      if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess("voyager@wayfare.atelier");
          onClose();
        }, 600);
        return;
      }

      const redirectUrl = typeof window !== "undefined" ? window.location.origin : undefined;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          skipBrowserRedirect: true,
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      if (data?.url) {
        try {
          const probe = await fetch(data.url, { method: "HEAD" });
          if (probe.status === 400) {
            setErrorMessage(
              "Google Sign-In is not enabled yet in your Supabase project (vajjeedldbzcwxwqsmhs). Please enable Google in your Supabase Dashboard, or click 'One-Click Voyager Access' above to log in instantly!"
            );
            setIsSubmitting(false);
            return;
          }
        } catch {
          // Probe redirected or CORS blocked on Google domain — provider is working
        }
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.warn("Google Auth fallback to demo session:", err);
      setErrorMessage("Google authentication failed. Use 'One-Click Voyager Access' to continue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setAuthStatus(`Magic access token dispatched to ${email}. Logged in successfully!`);
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(email);
          onClose();
        }, 800);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) throw error;
      setAuthStatus(`Magic access token dispatched to ${email}. Check your inbox!`);
      if (onLoginSuccess) onLoginSuccess(email);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to dispatch access token");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstantVoyagerLogin = () => {
    setIsSubmitting(true);
    setAuthStatus("Welcome, Voyager. Atelier credentials activated!");
    const voyagerUser = {
      id: "voyager-atelier",
      email: "voyager@wayfare.atelier",
      name: "Voyager Atelier",
      avatar: "",
      provider: "atelier",
    };
    setStoredUser(voyagerUser);
    setTimeout(() => {
      if (onLoginSuccess) onLoginSuccess("voyager@wayfare.atelier");
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-surface dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.35)] rounded-[36px] p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 w-9 h-9 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-lowest dark:bg-[#201F1F] flex items-center justify-center text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Brand Icon */}
        <div className="w-12 h-12 rounded-full border-2 border-on-surface dark:border-[#FAF7F2] bg-surface-container-low dark:bg-[#201F1F] flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[24px] text-primary dark:text-[#1E8C80]">explore</span>
        </div>

        {/* Title */}
        <h2 className="font-serif text-3xl text-on-surface dark:text-[#FAF7F2] font-normal mb-1">
          Wayfare Atelier
        </h2>
        <p className="font-serif italic text-sm text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] mb-6">
          Enter your quiet sanctuary for thoughtful exploration.
        </p>

        {authStatus && (
          <div className="mb-4 p-3.5 rounded-[20px] bg-primary/10 border-2 border-primary text-primary dark:text-[#1E8C80] font-sans text-xs font-medium">
            {authStatus}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-[20px] bg-rose-500/10 border-2 border-rose-500 text-rose-600 dark:text-rose-400 font-sans text-xs">
            {errorMessage}
          </div>
        )}

        {/* One-Click Instant Access */}
        <button
          type="button"
          onClick={handleInstantVoyagerLogin}
          className="w-full mb-4 flex items-center justify-center gap-2 bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] hover:bg-primary py-3.5 rounded-full border-2 border-on-surface dark:border-[#1E8C80] font-sans text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>One-Click Voyager Access</span>
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-on-surface/15 dark:bg-white/15" />
          <span className="text-[11px] font-sans uppercase tracking-widest text-outline dark:text-white/50">or with credentials</span>
          <div className="flex-1 h-px bg-on-surface/15 dark:bg-white/15" />
        </div>

        {/* Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div className="text-left">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="w-full bg-surface-container-lowest dark:bg-[#201F1F] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-full px-5 py-3 text-sm text-on-surface dark:text-[#FAF7F2] placeholder:text-outline focus:outline-none"
            />
          </div>

          {/* Continue with Email */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-surface-container-lowest dark:bg-[#201F1F] text-on-surface dark:text-[#FAF7F2] hover:bg-surface-variant py-3 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] font-sans text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            <span>{isSubmitting ? "Dispatching..." : "Send Magic Link"}</span>
          </button>

          {/* Google Sign-in Option */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-transparent text-on-surface-variant dark:text-white/70 hover:text-on-surface py-2.5 rounded-full border border-on-surface/25 dark:border-white/20 font-sans text-xs font-medium transition-colors cursor-pointer"
            title="Requires Google Provider enabled in Supabase Dashboard"
          >
            <span>Continue with Google</span>
          </button>
        </form>

        {/* Guest access */}
        <div className="mt-5 pt-3 border-t border-on-surface/10 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] hover:text-on-surface underline tracking-wider cursor-pointer"
          >
            Continue as guest →
          </button>
        </div>
      </div>
    </div>
  );
}
