import type { Metadata } from "next";
import "./globals.css";
import { CurrencyProvider } from "@/lib/currency";
import { RegionProvider } from "@/lib/region";

export const metadata: Metadata = {
  title: "WAYFARE — Editorial AI Travel Discovery & Planning",
  description: "Bespoke itineraries, verified open places, curated stays, and quiet observation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Inter:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-screen bg-background text-on-surface antialiased transition-colors duration-200 pb-16 lg:pb-0">
        <CurrencyProvider>
          <RegionProvider>
            {children}
          </RegionProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
