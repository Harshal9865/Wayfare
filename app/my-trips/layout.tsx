import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Trips",
  description:
    "View, manage, and revisit your saved travel itineraries on WAYFARE. All your trip plans in one place.",
  robots: { index: false, follow: false }, // private page, don't index
  openGraph: {
    title: "My Trips — WAYFARE",
    description: "Your saved travel itineraries and trip plans.",
    type: "website",
  },
};

export default function MyTripsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
