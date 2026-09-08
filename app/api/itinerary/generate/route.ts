import { NextRequest, NextResponse } from "next/server";
import { getOrCreateTripPlan } from "@/lib/mock-itinerary";
import { TripPlan } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      location_name = "Jaipur, India",
      duration_days = 3,
      trip_style = "balanced",
      dietary_pref = "any",
      travelers_count = 2,
    } = body;

    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY;

    let operationalSpots: any[] = [];
    let stateCountry = location_name;

    // Step 1: Query Google Places if key is available
    if (googlePlacesApiKey) {
      try {
        const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          location_name
        )}&key=${googlePlacesApiKey}`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (geoData.results && geoData.results.length > 0) {
          const { lat, lng } = geoData.results[0].geometry.location;
          stateCountry = geoData.results[0].formatted_address;

          const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=15000&type=tourist_attraction&key=${googlePlacesApiKey}`;
          const attrRes = await fetch(nearbyUrl);
          const attrData = await attrRes.json();

          operationalSpots = (attrData.results || [])
            .filter((p: any) => p.business_status === "OPERATIONAL" || !p.business_status)
            .slice(0, 12)
            .map((p: any) => ({
              place_id: p.place_id,
              name: p.name,
              rating: p.rating,
              lat: p.geometry?.location?.lat,
              lng: p.geometry?.location?.lng,
              address: p.vicinity,
            }));
        }
      } catch (e) {
        console.warn("Places fetch warning:", e);
      }
    }

    // Step 2A: If Gemini API Key is provided (Google AI Studio Free Tier)
    if (geminiApiKey && operationalSpots.length > 0) {
      try {
        const promptText = `You are the lead travel curator for WAYFARE Atelier. Sequence these REAL, verified operational places into a ${duration_days}-day itinerary for ${location_name}.
Trip style: ${trip_style}. Dietary: ${dietary_pref}.
Strict rule: Do not hallucinate or invent new place names. Use ONLY the provided list:
${JSON.stringify(operationalSpots, null, 2)}

Return strictly valid JSON matching:
{
  "title": "Editorial trip title",
  "days": [
    {
      "day_number": 1,
      "theme_title": "Day Theme",
      "description": "Short poetic description",
      "items": [
        {
          "time_slot": "morning|afternoon|evening",
          "place_name": "exact name from list",
          "suggested_duration_mins": 90,
          "travel_notes": "Curator notes on atmosphere and timing"
        }
      ]
    }
  ],
  "budget_estimate_min_inr": 8000,
  "budget_estimate_max_inr": 15000
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: { responseMimeType: "application/json" },
            }),
          }
        );

        const geminiData = await geminiRes.json();
        const rawJson = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          return NextResponse.json({
            success: true,
            plan: {
              id: `generated-${Date.now()}`,
              title: parsed.title || `Contemplative Journey in ${location_name}`,
              location_name,
              state_country: stateCountry,
              lat: operationalSpots[0]?.lat || 26.9124,
              lng: operationalSpots[0]?.lng || 75.7873,
              duration_days,
              trip_style,
              dietary_pref,
              travelers_count,
              days: parsed.days,
              budget: {
                total_estimate_min: parsed.budget_estimate_min_inr || 8000,
                total_estimate_max: parsed.budget_estimate_max_inr || 16000,
                currency: "INR",
                is_estimate: true,
              },
            },
          });
        }
      } catch (err) {
        console.warn("Gemini AI sequencing fallback:", err);
      }
    }

    // Step 3: Destination-specific fallback generator (NEVER returns Kyoto for Jaipur)
    const matchedPlan: TripPlan = getOrCreateTripPlan(
      location_name,
      duration_days,
      trip_style,
      dietary_pref
    );

    return NextResponse.json({ success: true, plan: matchedPlan });
  } catch (error) {
    console.error("Itinerary generation error:", error);
    const fallback = getOrCreateTripPlan("Jaipur, India", 3, "balanced", "satvik");
    return NextResponse.json({ success: true, plan: fallback });
  }
}
