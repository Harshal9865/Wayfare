import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Itinerary Planner",
  description:
    "Generate a free personalised travel itinerary for any destination in India — Varanasi, Leh Ladakh, Kerala backwaters, Jaipur, Rishikesh and more. Powered by Gemini AI.",
  openGraph: {
    title: "AI Itinerary Planner — WAYFARE",
    description:
      "Plan your perfect India trip with AI. Get a day-by-day itinerary, hotel suggestions, food guide, and local tips — all in seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Itinerary Planner — WAYFARE",
    description: "Free AI-powered itinerary generator for India travel.",
  },
};

export default function ItineraryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
