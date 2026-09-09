import type { Metadata } from "next";
import "./globals.css";
import { CurrencyProvider } from "@/lib/currency";
import { RegionProvider } from "@/lib/region";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";
import AuthSessionSync from "@/components/AuthSessionSync";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wayfaredun.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "WAYFARE — AI Travel Planning for India & Beyond",
    template: "%s — WAYFARE",
  },
  description:
    "Plan your perfect trip with AI-powered itineraries. Discover sacred ghats, royal forts, Himalayan passes, backwaters, and more. Free personalised travel planning for India and the world.",
  keywords: [
    "travel planning India",
    "AI itinerary generator",
    "Varanasi trip plan",
    "Leh Ladakh travel guide",
    "Kerala backwaters itinerary",
    "Rajasthan tour planner",
    "free travel planner",
    "personalised itinerary",
    "best places to visit India",
  ],
  authors: [{ name: "WAYFARE Atelier" }],
  creator: "WAYFARE",
  publisher: "WAYFARE",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "WAYFARE",
    title: "WAYFARE — AI Travel Planning for India & Beyond",
    description:
      "Free AI-powered itineraries for India's sacred ghats, royal forts, Himalayan trails, and coastal backwaters. Plan your trip in seconds.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "WAYFARE — AI Travel Planning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WAYFARE — AI Travel Planning for India & Beyond",
    description:
      "Free AI-powered itineraries for India's sacred ghats, royal forts, Himalayan trails, and coastal backwaters.",
    images: [`${SITE_URL}/og-image.jpg`],
    creator: "@wayfaredun",
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    // Add your Google Search Console verification token here when you have it
    // google: "your-verification-token",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Inter:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-screen bg-background text-on-surface antialiased transition-colors duration-200 pb-16 lg:pb-0" suppressHydrationWarning>
        {/* Instant Dark Mode initialization to prevent theme loss on navigation or reload */}
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('wayfare_theme');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* JSON-LD structured data — TravelAgency schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              name: "WAYFARE",
              url: SITE_URL,
              description:
                "AI-powered travel planning platform for personalised itineraries across India and the world.",
              areaServed: ["India", "Worldwide"],
              serviceType: ["Travel Planning", "Itinerary Generation", "Destination Discovery"],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "AI Travel Itineraries",
                itemListElement: [
                  { "@type": "Offer", itemOffered: { "@type": "TouristTrip", name: "Varanasi Sacred Ghats Itinerary" } },
                  { "@type": "Offer", itemOffered: { "@type": "TouristTrip", name: "Leh Ladakh Mountain Itinerary" } },
                  { "@type": "Offer", itemOffered: { "@type": "TouristTrip", name: "Kerala Backwaters Itinerary" } },
                ],
              },
            }),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-full focus:font-sans focus:text-sm focus:font-semibold focus:no-underline"
        >
          Skip to main content
        </a>
        <Analytics />
        <AuthSessionSync />
        <CurrencyProvider>
          <RegionProvider>
            {children}
            <CookieBanner />
          </RegionProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
