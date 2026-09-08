import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildBookingAffiliateUrl(location: string, checkIn?: string, checkOut?: string): string {
  const affiliateId = process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID || "travelguide_in";
  const baseUrl = "https://www.booking.com/searchresults.html";
  const params = new URLSearchParams({
    ss: location,
    aid: affiliateId,
    lang: "en-gb",
  });
  if (checkIn) params.append("checkin", checkIn);
  if (checkOut) params.append("checkout", checkOut);
  return `${baseUrl}?${params.toString()}`;
}

export function getVegStatusBadge(status?: string): { label: string; colorClass: string } {
  switch (status) {
    case "pure_veg":
      return { label: "100% Pure Veg", colorClass: "bg-emerald-50 text-emerald-800 border-emerald-300" };
    case "jain_friendly":
      return { label: "Jain Available", colorClass: "bg-amber-50 text-amber-800 border-amber-300" };
    case "veg_options":
      return { label: "Veg Options", colorClass: "bg-teal-50 text-teal-800 border-teal-300" };
    case "non_veg":
      return { label: "Non-Veg & Veg", colorClass: "bg-stone-100 text-stone-700 border-stone-300" };
    default:
      return { label: "Dietary Unverified", colorClass: "bg-gray-50 text-gray-500 border-gray-200" };
  }
}
