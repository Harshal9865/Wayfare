import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curated Stays",
  description:
    "Discover handpicked boutique hotels, heritage havelis, homestays, and eco-lodges across India. Verified, open, and curated by the WAYFARE team.",
  openGraph: {
    title: "Curated Stays — WAYFARE",
    description:
      "Heritage havelis, jungle lodges, backwater houseboats, and Himalayan camps. Find your perfect stay in India.",
    type: "website",
  },
};

export default function StaysLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
