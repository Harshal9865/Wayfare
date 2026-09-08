import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("input");

  if (!input) {
    return NextResponse.json({ suggestions: [] });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (apiKey) {
    try {
      const googleUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&types=(cities)&key=${apiKey}`;
      const res = await fetch(googleUrl);
      const data = await res.json();

      if (data.status === "OK") {
        const suggestions = data.predictions.map((p: any) => ({
          place_id: p.place_id,
          description: p.description,
          main_text: p.structured_formatting?.main_text || p.description,
          secondary_text: p.structured_formatting?.secondary_text || "",
        }));
        return NextResponse.json({ suggestions });
      }
    } catch (err) {
      console.error("Google Places Autocomplete Error:", err);
    }
  }

  // Graceful Fallback Suggestions
  const fallbackList = [
    { place_id: "kyoto", description: "Kyoto, Kansai, Japan", main_text: "Kyoto", secondary_text: "Japan" },
    { place_id: "varanasi", description: "Varanasi, Uttar Pradesh, India", main_text: "Varanasi", secondary_text: "Uttar Pradesh, India" },
    { place_id: "lisbon", description: "Lisbon, Portugal", main_text: "Lisbon", secondary_text: "Portugal" },
    { place_id: "oaxaca", description: "Oaxaca, Mexico", main_text: "Oaxaca", secondary_text: "Mexico" },
    { place_id: "amorgos", description: "Amorgos, Cyclades, Greece", main_text: "Amorgos", secondary_text: "Greece" },
    { place_id: "rishikesh", description: "Rishikesh, Uttarakhand, India", main_text: "Rishikesh", secondary_text: "Uttarakhand, India" },
    { place_id: "jaipur", description: "Jaipur, Rajasthan, India", main_text: "Jaipur", secondary_text: "Rajasthan, India" },
    { place_id: "goa", description: "Goa, India", main_text: "Goa", secondary_text: "India" },
  ];

  const matched = fallbackList.filter((item) =>
    item.description.toLowerCase().includes(input.toLowerCase())
  );

  return NextResponse.json({ suggestions: matched.length > 0 ? matched : fallbackList.slice(0, 4) });
}
