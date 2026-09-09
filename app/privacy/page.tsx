import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — WAYFARE",
  description: "How WAYFARE collects, uses, and protects your personal information.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "September 2026";
const CONTACT_EMAIL = "hello@wayfaredun.netlify.app";
const SITE_NAME = "WAYFARE";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#131313] transition-colors">
      <Navbar />

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="mb-10">
          <span className="font-sans text-xs uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold block mb-3">
            Legal Document
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-on-surface dark:text-[#FAF7F2] font-normal leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="font-sans text-sm text-outline dark:text-[rgba(250,247,242,0.5)]">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <div className="space-y-8 font-sans text-sm text-on-surface-variant dark:text-[rgba(250,247,242,0.75)] leading-relaxed">

          <section>
            <h2 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-normal mb-3">1. Who We Are</h2>
            <p>
              {SITE_NAME} ("we", "us", "our") is an AI-powered travel planning platform that helps users discover destinations, generate personalised itineraries, and explore curated stays. Our website is accessible at wayfaredun.netlify.app.
            </p>
            <p className="mt-2">
              For privacy-related queries, contact us at: <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary dark:text-[#1E8C80] underline">{CONTACT_EMAIL}</a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-normal mb-3">2. What Data We Collect</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-on-surface dark:text-[#FAF7F2]">Account data:</strong> Email address and name when you sign in via Google or email magic link (powered by Supabase Auth).</li>
              <li><strong className="text-on-surface dark:text-[#FAF7F2]">Usage data:</strong> Pages visited, search queries, destinations searched, and trip plans generated — used to improve recommendations.</li>
              <li><strong className="text-on-surface dark:text-[#FAF7F2]">Preferences:</strong> Region (India/Abroad), currency, dietary preferences, and travel style — stored locally in your browser.</li>
              <li><strong className="text-on-surface dark:text-[#FAF7F2]">Device data:</strong> Browser type, operating system, and IP address — collected automatically by our hosting provider (Netlify).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-normal mb-3">3. How We Use Your Data</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>To generate personalised AI travel itineraries based on your location input.</li>
              <li>To save and retrieve your trips when you are signed in.</li>
              <li>To authenticate your account securely.</li>
              <li>To improve our recommendations and product features.</li>
              <li>To send transactional emails (trip saved confirmation, magic link sign-in) — we do not send marketing emails without your consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-normal mb-3">4. Third-Party Services</h2>
            <p>We integrate with the following third-party services, each with their own privacy policies:</p>
            <ul className="space-y-2 list-disc list-inside mt-2">
              <li><strong className="text-on-surface dark:text-[#FAF7F2]">Supabase</strong> — Database and authentication. <a href="https://supabase.com/privacy" className="text-primary dark:text-[#1E8C80] underline" target="_blank">Privacy policy</a>.</li>
              <li><strong className="text-on-surface dark:text-[#FAF7F2]">Google Places API</strong> — Location search and photos. <a href="https://policies.google.com/privacy" className="text-primary dark:text-[#1E8C80] underline" target="_blank">Privacy policy</a>.</li>
              <li><strong className="text-on-surface dark:text-[#FAF7F2]">Google Gemini AI</strong> — Itinerary generation. <a href="https://policies.google.com/privacy" className="text-primary dark:text-[#1E8C80] underline" target="_blank">Privacy policy</a>.</li>
              <li><strong className="text-on-surface dark:text-[#FAF7F2]">Pexels</strong> — Travel video content. <a href="https://www.pexels.com/privacy-policy/" className="text-primary dark:text-[#1E8C80] underline" target="_blank">Privacy policy</a>.</li>
              <li><strong className="text-on-surface dark:text-[#FAF7F2]">Netlify</strong> — Hosting and CDN. <a href="https://www.netlify.com/privacy/" className="text-primary dark:text-[#1E8C80] underline" target="_blank">Privacy policy</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-normal mb-3">5. Cookies</h2>
            <p>We use the following cookies and local storage items:</p>
            <ul className="space-y-2 list-disc list-inside mt-2">
              <li><strong className="text-on-surface dark:text-[#FAF7F2]">wayfare_cookie_consent</strong> — Records your cookie consent choice. Stored in localStorage.</li>
              <li><strong className="text-on-surface dark:text-[#FAF7F2]">Supabase auth tokens</strong> — Session cookies for maintaining your login state.</li>
              <li><strong className="text-on-surface dark:text-[#FAF7F2]">Netlify analytics</strong> — Aggregate, anonymised visitor data collected by Netlify.</li>
            </ul>
            <p className="mt-2">You can decline non-essential cookies via the cookie banner. Declining does not affect core site functionality.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-normal mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="space-y-2 list-disc list-inside mt-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Object to processing of your data for analytics purposes.</li>
              <li>Request a copy of your data in a portable format.</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, email <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary dark:text-[#1E8C80] underline">{CONTACT_EMAIL}</a>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-normal mb-3">7. Data Retention</h2>
            <p>We retain your account and trip data for as long as your account is active. If you delete your account, all associated data is removed within 30 days. Usage logs are anonymised after 90 days.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-normal mb-3">8. Children's Privacy</h2>
            <p>WAYFARE is not directed at children under 13 years of age. We do not knowingly collect personal information from children.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-normal mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Significant changes will be notified via email (for registered users) and by updating the "Last updated" date above.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-on-surface dark:text-[#FAF7F2] font-normal mb-3">10. Contact</h2>
            <p>For any privacy-related concerns: <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary dark:text-[#1E8C80] underline">{CONTACT_EMAIL}</a></p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
