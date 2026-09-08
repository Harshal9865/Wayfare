import { NextRequest, NextResponse } from "next/server";
import { Place } from "@/lib/types";

// Alternative spots pool for quick swapping
const ALTERNATIVE_SPOTS: Record<string, Place[]> = {
  default: [
    {
      id: "alt-1",
      place_id: "ChIJ_alt_temple_01",
      name: "Otagi Nenbutsu-ji Temple",
      category: "attraction",
      sub_category: "Hillside Temple & Moss Sculptures",
      business_status: "OPERATIONAL",
      rating: 4.8,
      user_ratings_total: 1950,
      photo_url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800",
      editorial_summary: "Secluded hillside temple famous for 1,200 whimsical stone statues carved by devotees, surrounded by quiet cedar woods.",
      lat: 35.0312,
      lng: 135.6582,
    },
    {
      id: "alt-2",
      place_id: "ChIJ_alt_tea_02",
      name: "Gio-ji Quiet Moss Hermitage",
      category: "attraction",
      sub_category: "Historic Bamboo Garden",
      business_status: "OPERATIONAL",
      rating: 4.7,
      user_ratings_total: 2800,
      photo_url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
      editorial_summary: "A tranquil thatched-roof hermitage nestled in a verdant sea of moss and tall maple trees.",
      lat: 35.0215,
      lng: 135.6698,
    },
    {
      id: "alt-3",
      place_id: "ChIJ_alt_cafe_03",
      name: "Saganoyu Heritage Bathhouse Cafe",
      category: "food",
      sub_category: "Artisanal Matcha Cafe",
      business_status: "OPERATIONAL",
      rating: 4.6,
      user_ratings_total: 1100,
      veg_status: "pure_veg",
      photo_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800",
      editorial_summary: "Converted historic public sento bathhouse serving freshly steamed tofu pasta and roasted green tea.",
      lat: 35.0162,
      lng: 135.6811,
    },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { place_id, category = "attraction", excluded_place_ids = [] } = body;

    const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY;

    // If Google Places API is available, fetch live nearby operational spots
    if (googlePlacesApiKey) {
      // In production: call Places Nearby Search with location radius excluding existing IDs
    }

    // Filter alternatives from pool excluding already used IDs
    const candidates = (ALTERNATIVE_SPOTS.default || []).filter(
      (p) => p.place_id !== place_id && !excluded_place_ids.includes(p.place_id)
    );

    return NextResponse.json({
      success: true,
      alternatives: candidates.length > 0 ? candidates : ALTERNATIVE_SPOTS.default.slice(0, 2),
    });
  } catch (err) {
    console.error("Spot swap error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to find swap alternatives" },
      { status: 500 }
    );
  }
}
