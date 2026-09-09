"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { pageview } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "";

export default function Analytics() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track page views on route change (only if consent granted)
  useEffect(() => {
    if (!mounted || !GA_ID) return;
    try {
      const consent = localStorage.getItem("wayfare_cookie_consent");
      if (consent === "accepted") {
        pageview(pathname);
      }
    } catch {
      // Safe local storage fallback
    }
  }, [pathname, mounted]);

  // Don't render anything during SSR or if IDs are not present
  if (!mounted || (!GA_ID && !CLARITY_ID)) return null;

  return (
    <>
      {/* Google Analytics 4 */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="lazyOnload"
            onError={(e) => {
              console.warn("Analytics script blocked by client or policy:", e);
            }}
          />
          <Script
            id="ga4-init"
            strategy="lazyOnload"
            onError={(e) => {
              console.warn("Analytics init warning:", e);
            }}
          >
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
                anonymize_ip: true,
              });
            `}
          </Script>
        </>
      )}

      {/* Microsoft Clarity — privacy-friendly heatmaps */}
      {CLARITY_ID && (
        <Script
          id="clarity-init"
          strategy="lazyOnload"
          onError={(e) => {
            console.warn("Clarity script blocked by client or policy:", e);
          }}
        >
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}
        </Script>
      )}
    </>
  );
}
