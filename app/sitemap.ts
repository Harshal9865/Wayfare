import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wayfaredun.netlify.app";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/itinerary`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/stays`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/my-trips`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Popular Indian destinations — generate itinerary landing pages
  const indianDestinations = [
    "Varanasi, India",
    "Rishikesh, India",
    "Leh Ladakh, India",
    "Alleppey, India",
    "Jaipur, India",
    "Hampi, India",
    "Udaipur, India",
    "Manali, India",
    "Coorg, India",
    "Darjeeling, India",
  ];

  const destinationPages: MetadataRoute.Sitemap = indianDestinations.map((dest) => ({
    url: `${siteUrl}/itinerary?location=${encodeURIComponent(dest)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...staticPages, ...destinationPages];
}
