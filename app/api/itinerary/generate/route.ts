import { NextRequest, NextResponse } from "next/server";
import { getOrCreateTripPlan } from "@/lib/mock-itinerary";
import { TripPlan, TripStyle, VegDietaryStatus, Place } from "@/lib/types";
import { resolveLocationCoords, isIndianDestination } from "@/lib/geo-resolver";
import { getSmartContextualPhoto } from "@/lib/image-resolver";

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

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY;

    const cleanLocation = (location_name || "").trim();
    const geo = resolveLocationCoords(cleanLocation);
    let isIndia = geo.isIndia;
    let centerLat = geo.lat;
    let centerLng = geo.lng;
    let stateCountry = geo.stateCountry;

    let operationalSpots: Place[] = [];

    // Step 1: Query Google Places via Text Search (works for any city, landmark, or corridor)
    if (googlePlacesApiKey) {
      try {
        const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          cleanLocation + " top attractions sights landmarks places to visit"
        )}&key=${googlePlacesApiKey}`;
        const searchRes = await fetch(textSearchUrl);
        const searchData = await searchRes.json();

        if (searchData.results && searchData.results.length > 0) {
          const rawResults = searchData.results.filter(
            (p: any) => p.business_status === "OPERATIONAL" || !p.business_status
          );

          if (rawResults.length > 0) {
            centerLat = rawResults[0].geometry?.location?.lat || centerLat;
            centerLng = rawResults[0].geometry?.location?.lng || centerLng;
            stateCountry = rawResults[0].formatted_address || stateCountry;

            // Check if formatted address confirms India
            if (
              stateCountry.toLowerCase().includes("india") ||
              stateCountry.toLowerCase().endsWith(", in")
            ) {
              isIndia = true;
            }

            operationalSpots = rawResults.slice(0, 15).map((p: any, idx: number): Place => {
              const photoRef = p.photos?.[0]?.photo_reference;
              const subCategory = p.types?.[0]?.replace(/_/g, " ") || "Historic Landmark";

              // Tier 1: Real Google photo if reference exists
              let directPhotoUrl = photoRef
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${googlePlacesApiKey}`
                : "";

              let photosList = (p.photos || []).slice(0, 4).map(
                (ph: any) =>
                  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ph.photo_reference}&key=${googlePlacesApiKey}`
              );

              // Tier 2: If no Google photo, use Knowledge Engine
              if (!directPhotoUrl) {
                const smart = getSmartContextualPhoto(p.name, subCategory, cleanLocation);
                directPhotoUrl = smart.main;
                photosList = smart.angles;
              }

              return {
                id: `spot-${p.place_id || idx}`,
                place_id: p.place_id || `place_${idx}`,
                name: p.name,
                category: "attraction",
                sub_category: subCategory,
                business_status: "OPERATIONAL",
                rating: p.rating || 4.8,
                user_ratings_total: p.user_ratings_total || 1500,
                photo_url: directPhotoUrl,
                photos: photosList.length > 0 ? photosList : [directPhotoUrl],
                lat: p.geometry?.location?.lat || centerLat,
                lng: p.geometry?.location?.lng || centerLng,
                editorial_summary:
                  p.formatted_address || `Verified operational cultural landmark in ${cleanLocation}.`,
              };
            });
          }
        }
      } catch (e) {
        console.warn("Google Places text search warning:", e);
      }
    }

    // Secondary fallback geocoding if Google Places was not available
    if (operationalSpots.length === 0 && (!centerLat || centerLat === 25.3176)) {
      try {
        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            cleanLocation
          )}&format=json&addressdetails=1&limit=1`,
          { headers: { "User-Agent": "WayfareTravelApp/1.0" } }
        );
        const nomData = await nomRes.json();
        if (nomData && nomData[0]) {
          centerLat = parseFloat(nomData[0].lat);
          centerLng = parseFloat(nomData[0].lon);
          if (nomData[0].address?.country === "India" || nomData[0].address?.country_code === "in") {
            isIndia = true;
          }
          stateCountry = nomData[0].display_name;
        }
      } catch (nomErr) {
        // Silently continue with resolved coords
      }
    }

    const smartStay = getSmartContextualPhoto(`${cleanLocation} Heritage Resort`, "stay", cleanLocation);
    const planStays: Place[] = [
      {
        id: `stay-${cleanLocation}`,
        place_id: `stay_${cleanLocation}`,
        name: `${cleanLocation} Heritage Boutique Retreat`,
        category: "stay",
        business_status: "OPERATIONAL",
        rating: 4.9,
        photo_url: smartStay.main,
        photos: smartStay.angles,
        lat: centerLat,
        lng: centerLng,
      },
    ];

    // Step 2: Sequence spots using Gemini AI if available and spots were discovered
    if (geminiApiKey && operationalSpots.length > 0) {
      try {
        const spotSummaries = operationalSpots.map((s) => ({
          name: s.name,
          rating: s.rating,
          sub_category: s.sub_category,
        }));

        const promptText = `You are the lead travel curator for WAYFARE. Sequence these REAL, verified operational places into a ${duration_days}-day itinerary for ${cleanLocation}.
Trip style: ${trip_style}. Dietary: ${dietary_pref}.
Strict rule: Do not hallucinate or invent new place names. Use ONLY the names from this list:
${JSON.stringify(spotSummaries, null, 2)}

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
  "budget_estimate_max_inr": 16000
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

          // Map each item back to the full Place object
          const mappedDays = (parsed.days || []).map((day: any, dIdx: number) => ({
            day_number: day.day_number || dIdx + 1,
            theme_title: day.theme_title || `Day ${dIdx + 1} in ${cleanLocation}`,
            description: day.description || "",
            items: (day.items || []).map((item: any, iIdx: number) => {
              const matched =
                operationalSpots.find(
                  (s) => s.name.toLowerCase() === (item.place_name || "").toLowerCase()
                ) || operationalSpots[iIdx % operationalSpots.length];

              const defaultSlot = iIdx === 0 ? "morning" : iIdx === 1 ? "afternoon" : "evening";

              return {
                id: `item-${dIdx + 1}-${iIdx + 1}`,
                day_number: dIdx + 1,
                time_slot: item.time_slot || defaultSlot,
                order_index: iIdx + 1,
                suggested_duration_mins: item.suggested_duration_mins || 90,
                travel_notes: item.travel_notes || matched.editorial_summary,
                place: matched,
              };
            }),
          }));

          return NextResponse.json({
            success: true,
            plan: {
              id: `generated-${Date.now()}`,
              title: parsed.title || `Curated Heritage in ${cleanLocation}`,
              location_name: cleanLocation,
              state_country: stateCountry,
              lat: operationalSpots[0]?.lat || centerLat,
              lng: operationalSpots[0]?.lng || centerLng,
              duration_days,
              trip_style: trip_style as TripStyle,
              dietary_pref: dietary_pref as VegDietaryStatus,
              travelers_count,
              days: mappedDays,
              stays: planStays,
              budget: {
                total_estimate_min: parsed.budget_estimate_min_inr || (isIndia ? 8500 : 450),
                total_estimate_max: parsed.budget_estimate_max_inr || (isIndia ? 16500 : 900),
                currency: isIndia ? "INR" : "USD",
                is_estimate: true,
              },
            },
          });
        }
      } catch (err) {
        console.warn("Gemini AI sequencing fallback:", err);
      }
    }

    // Step 2B: If we have real Google Places spots but Gemini was skipped or errored, sequence directly
    if (operationalSpots.length > 0) {
      const spotsPerDay = Math.max(2, Math.floor(operationalSpots.length / duration_days));
      const directDays = Array.from({ length: duration_days }, (_, dIdx) => {
        const daySpots = operationalSpots.slice(dIdx * spotsPerDay, (dIdx + 1) * spotsPerDay);
        const items = (daySpots.length > 0 ? daySpots : [operationalSpots[dIdx % operationalSpots.length]]).map(
          (spot, sIdx) => ({
            id: `direct-${dIdx + 1}-${sIdx + 1}`,
            day_number: dIdx + 1,
            time_slot: (sIdx === 0 ? "morning" : sIdx === 1 ? "afternoon" : "evening") as
              | "morning"
              | "afternoon"
              | "evening",
            order_index: sIdx + 1,
            suggested_duration_mins: 90,
            travel_notes: spot.editorial_summary || `Explore ${spot.name} in ${cleanLocation}.`,
            place: spot,
          })
        );

        return {
          day_number: dIdx + 1,
          theme_title: dIdx === 0 ? "Historic Sights & Morning Promenade" : `Cultural Exploration & Waypoints`,
          description: `Hand-sequenced discovery of verified operational landmarks across ${cleanLocation}.`,
          items,
        };
      });

      return NextResponse.json({
        success: true,
        plan: {
          id: `places-direct-${Date.now()}`,
          title: `Curated Heritage in ${cleanLocation}`,
          location_name: cleanLocation,
          state_country: stateCountry,
          lat: operationalSpots[0]?.lat || centerLat,
          lng: operationalSpots[0]?.lng || centerLng,
          duration_days,
          trip_style: trip_style as TripStyle,
          dietary_pref: dietary_pref as VegDietaryStatus,
          travelers_count,
          days: directDays,
          stays: planStays,
          budget: {
            total_estimate_min: isIndia ? 8000 : 450,
            total_estimate_max: isIndia ? 16000 : 900,
            currency: isIndia ? "INR" : "USD",
            is_estimate: true,
          },
        },
      });
    }

    // Step 3: Destination-specific fallback generator (works for any Indian and global destination)
    const matchedPlan: TripPlan = getOrCreateTripPlan(
      cleanLocation,
      duration_days,
      trip_style as TripStyle,
      dietary_pref as VegDietaryStatus
    );

    return NextResponse.json({ success: true, plan: matchedPlan });
  } catch (error) {
    console.error("Itinerary generation error:", error);
    const fallback = getOrCreateTripPlan("Ganga, India", 3, "pilgrimage", "satvik");
    return NextResponse.json({ success: true, plan: fallback });
  }
}
