// Analytics helper — all calls are no-ops if GA is not loaded or consent not given

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    clarity: (...args: unknown[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("wayfare_cookie_consent") === "accepted";
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || !window.gtag || !GA_ID || !hasConsent()) return;
  window.gtag(...args);
}

export function pageview(url: string) {
  gtag("config", GA_ID, { page_path: url });
}

export function trackSearch(destination: string) {
  gtag("event", "search_submitted", {
    event_category: "engagement",
    event_label: destination,
    destination,
  });
}

export function trackItineraryGenerated(destination: string, days: number) {
  gtag("event", "itinerary_generated", {
    event_category: "conversion",
    event_label: destination,
    destination,
    days,
  });
}

export function trackPlaceViewed(placeName: string, location: string) {
  gtag("event", "place_viewed", {
    event_category: "engagement",
    event_label: placeName,
    place_name: placeName,
    location,
  });
}

export function trackShareClicked(
  type: "whatsapp" | "copy" | "twitter" | "native",
  destination: string
) {
  gtag("event", "share_clicked", {
    event_category: "engagement",
    method: type,
    destination,
  });
}

export function trackAuthRequired(destination: string) {
  gtag("event", "auth_gate_shown", {
    event_category: "auth",
    destination,
  });
}

export function trackSignIn(method: "google" | "magic_link" | "guest") {
  gtag("event", "sign_in", {
    event_category: "auth",
    method,
  });
}
