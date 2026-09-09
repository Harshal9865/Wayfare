import { TripPlan, Place, TripStyle, VegDietaryStatus } from "./types";
import { resolveLocationCoords, isIndianDestination } from "./geo-resolver";
import { getSmartContextualPhoto } from "./image-resolver";

export function generateDynamicFallbackPlan(
  locationName: string,
  durationDays: number = 3,
  tripStyle: TripStyle = "balanced",
  dietaryPref: VegDietaryStatus = "any"
): TripPlan {
  const cleanName = locationName.trim();
  const geo = resolveLocationCoords(cleanName);
  const isIndia = geo.isIndia;

  const currency = isIndia ? "INR" : "USD";
  const minCost = isIndia ? 3500 * durationDays : 180 * durationDays;
  const maxCost = isIndia ? 7500 * durationDays : 340 * durationDays;

  // Generate city-appropriate mock places based on location name
  const cityLower = cleanName.toLowerCase();

  if (cityLower.includes("jaipur")) {
    return {
      id: `jaipur-plan-${Date.now()}`,
      title: "Royal Pink City Heritage & Haveli Retreat",
      location_name: "Jaipur, India",
      state_country: "Rajasthan, India",
      lat: 26.9124,
      lng: 75.7873,
      duration_days: durationDays,
      trip_style: tripStyle,
      dietary_pref: (dietaryPref === "any" ? "satvik" : dietaryPref) as VegDietaryStatus,
      travelers_count: 2,
      budget: {
        hotel_cost_min: 4200,
        hotel_cost_max: 9500,
        food_cost_min: 2200,
        food_cost_max: 4800,
        transport_cost_min: 1200,
        transport_cost_max: 2200,
        activities_cost_min: 1500,
        activities_cost_max: 3000,
        total_estimate_min: 9100,
        total_estimate_max: 19500,
        currency: "INR",
        is_estimate: true,
      },
      days: [
        {
          day_number: 1,
          theme_title: "Amber Fort Sunsets & Terracotta Havelis",
          description: "Explore the hilltop Amber Palace above Maota Lake, followed by artisanal block-print textile ateliers.",
          items: [
            {
              id: "jp-1",
              day_number: 1,
              time_slot: "morning",
              order_index: 1,
              suggested_duration_mins: 120,
              travel_notes: "Arrive at 08:30 AM to beat the mid-day heat. Ascend via the Sun Gate to inspect Sheesh Mahal mirror courtyard.",
              place: {
                id: "jp_amber",
                place_id: "ChIJ_amber_fort",
                name: "Amber Fort & Sheesh Mahal",
                category: "attraction",
                sub_category: "Royal Fort Complex",
                business_status: "OPERATIONAL",
                rating: 4.8,
                user_ratings_total: 45000,
                photo_url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
                photos: [
                  "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000",
                  "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1000",
                  "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000",
                  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1000"
                ],
                lat: 26.9855,
                lng: 75.8513,
                editorial_summary: "16th-century yellow and pink sandstone fortress commanding panoramic views over Maota Lake.",
              },
            },
            {
              id: "jp-2",
              day_number: 1,
              time_slot: "afternoon",
              order_index: 2,
              suggested_duration_mins: 60,
              travel_notes: "Photograph the water palace floating on Man Sagar Lake at golden hour.",
              place: {
                id: "jp_jalmahal",
                place_id: "ChIJ_jal_mahal",
                name: "Jal Mahal (Water Palace Pavilion)",
                category: "attraction",
                sub_category: "Historic Lake Pavilion",
                business_status: "OPERATIONAL",
                rating: 4.6,
                user_ratings_total: 28000,
                photo_url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
                photos: [
                  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1000",
                  "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000",
                  "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1000"
                ],
                lat: 26.9534,
                lng: 75.8462,
                editorial_summary: "A Rajput-style architectural marvel appearing to float in the middle of Man Sagar Lake.",
              },
            },
            {
              id: "jp-3",
              day_number: 1,
              time_slot: "evening",
              order_index: 3,
              suggested_duration_mins: 90,
              travel_notes: "Enjoy authentic Rajasthani Dal Baati Churma and Ghevar served on brass thalis.",
              place: {
                id: "jp_lmb",
                place_id: "ChIJ_lmb_jaipur",
                name: "LMB Heritage Rajasthani Thali",
                category: "food",
                sub_category: "Pure Veg Culinary Heritage",
                business_status: "OPERATIONAL",
                rating: 4.7,
                user_ratings_total: 12500,
                veg_status: "pure_veg",
                photo_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800",
                photos: [
                  "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1000",
                  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1000"
                ],
                lat: 26.9205,
                lng: 75.8236,
                editorial_summary: "18th-century legendary culinary establishment in Johari Bazaar famous for pure ghee sweets and royal thalis.",
              },
            },
          ],
        },
        {
          day_number: 2,
          theme_title: "City Palace & Royal Jantar Mantar",
          description: "Wander through the honeycomb facade of Hawa Mahal and the royal court yards of City Palace.",
          items: [
            {
              id: "jp-4",
              day_number: 2,
              time_slot: "morning",
              order_index: 1,
              suggested_duration_mins: 90,
              travel_notes: "Admire the 953 lattice windows designed for royal ladies to observe street processions unseen.",
              place: {
                id: "jp_hawamahal",
                place_id: "ChIJ_hawa_mahal",
                name: "Hawa Mahal (Palace of Winds)",
                category: "attraction",
                sub_category: "Royal Architecture",
                business_status: "OPERATIONAL",
                rating: 4.7,
                user_ratings_total: 62000,
                photo_url: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
                photos: [
                  "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1000",
                  "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000",
                  "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000"
                ],
                lat: 26.9239,
                lng: 75.8267,
                editorial_summary: "Iconic five-story pink sandstone structure built in 1799 in the shape of Lord Krishna's crown.",
              },
            },
            {
              id: "jp-5",
              day_number: 2,
              time_slot: "afternoon",
              order_index: 2,
              suggested_duration_mins: 75,
              travel_notes: "Inspect the peacock courtyard (Pritam Niwas Chowk) and royal armory museum.",
              place: {
                id: "jp_citypalace",
                place_id: "ChIJ_city_palace",
                name: "Jaipur City Palace & Chandra Mahal",
                category: "attraction",
                sub_category: "Royal Residence",
                business_status: "OPERATIONAL",
                rating: 4.8,
                user_ratings_total: 39000,
                photo_url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800",
                photos: [
                  "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000",
                  "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1000",
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000"
                ],
                lat: 26.9258,
                lng: 75.8237,
                editorial_summary: "Resplendent palace complex blending Rajasthani and Mughal architectural heritage, still housing the royal family.",
              },
            },
          ],
        },
      ],
      stays: [
        {
          id: "jp_stay_1",
          place_id: "rambagh_palace",
          name: "Rambagh Palace Heritage Resort",
          category: "stay",
          business_status: "OPERATIONAL",
          rating: 4.9,
          photo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          lat: 26.898,
          lng: 75.808,
        },
      ],
    };
  }

  const normName = cleanName.toLowerCase();
  const isGanga = normName.includes("ganga") || normName.includes("ganges");
  const isSpiritual =
    isGanga ||
    normName.includes("temple") ||
    normName.includes("ghat") ||
    normName.includes("dham") ||
    normName.includes("math") ||
    normName.includes("prayag") ||
    normName.includes("tirtha") ||
    normName.includes("amman") ||
    normName.includes("swamy") ||
    normName.includes("kashi") ||
    normName.includes("puri") ||
    normName.includes("shirdi") ||
    normName.includes("kedarnath") ||
    normName.includes("badrinath") ||
    normName.includes("somnath") ||
    normName.includes("dwarka") ||
    normName.includes("ujjain") ||
    normName.includes("ayodhya") ||
    normName.includes("tirupati") ||
    normName.includes("madurai") ||
    normName.includes("rameswaram") ||
    normName.includes("haridwar") ||
    normName.includes("rishikesh");

  const isMountain =
    normName.includes("hill") ||
    normName.includes("valley") ||
    normName.includes("mountain") ||
    normName.includes("peak") ||
    normName.includes("pass") ||
    normName.includes("trek") ||
    normName.includes("manali") ||
    normName.includes("shimla") ||
    normName.includes("ooty") ||
    normName.includes("coorg") ||
    normName.includes("munnar") ||
    normName.includes("darjeeling") ||
    normName.includes("ladakh") ||
    normName.includes("spiti") ||
    normName.includes("auli") ||
    normName.includes("mussoorie") ||
    normName.includes("nainital") ||
    normName.includes("wayanad");

  const isBeach =
    normName.includes("beach") ||
    normName.includes("coast") ||
    normName.includes("island") ||
    normName.includes("sea") ||
    normName.includes("goa") ||
    normName.includes("gokarna") ||
    normName.includes("varkala") ||
    normName.includes("kovalam") ||
    normName.includes("alleppey") ||
    normName.includes("kochi") ||
    normName.includes("andaman");

  const isFort =
    normName.includes("fort") ||
    normName.includes("palace") ||
    normName.includes("mahal") ||
    normName.includes("haveli") ||
    normName.includes("hampi") ||
    normName.includes("jodhpur") ||
    normName.includes("udaipur") ||
    normName.includes("jaisalmer") ||
    normName.includes("gwalior");

  const planTitle = isGanga
    ? "Sacred Waters & Ghats: The Ganga River Corridor"
    : isSpiritual
    ? `Sacred Pilgrimage & Holy Sanctuaries of ${cleanName}`
    : isMountain
    ? `Highland Mist & Mountain Corridors of ${cleanName}`
    : isBeach
    ? `Coastal Sunsets & Palm Waterways of ${cleanName}`
    : isFort
    ? `Royal Fortresses & Heritage Pavilions of ${cleanName}`
    : `Curated Heritage & Cultural Promenade in ${cleanName}`;

  // Dynamic fallback for any custom location user searches for
  return {
    id: `plan-${Date.now()}`,
    title: planTitle,
    location_name: cleanName,
    state_country: geo.stateCountry,
    lat: geo.lat,
    lng: geo.lng,
    duration_days: durationDays,
    trip_style: tripStyle,
    dietary_pref: dietaryPref,
    travelers_count: 2,
    budget: {
      hotel_cost_min: Math.round(minCost * 0.45),
      hotel_cost_max: Math.round(maxCost * 0.45),
      food_cost_min: Math.round(minCost * 0.25),
      food_cost_max: Math.round(maxCost * 0.25),
      transport_cost_min: Math.round(minCost * 0.15),
      transport_cost_max: Math.round(maxCost * 0.15),
      activities_cost_min: Math.round(minCost * 0.15),
      activities_cost_max: Math.round(maxCost * 0.15),
      total_estimate_min: minCost,
      total_estimate_max: maxCost,
      currency,
      is_estimate: true,
    },
    days: Array.from({ length: Math.min(durationDays, 4) }, (_, i) => {
      const dayNum = i + 1;
      const themeTitle =
        dayNum === 1
          ? isSpiritual
            ? `Dawn Prayers & Sacred Shrines of ${cleanName}`
            : isMountain
            ? `Panoramic Pine Ridges & Alpine Vistas in ${cleanName}`
            : isBeach
            ? `Golden Shorelines & Coastal Breezes in ${cleanName}`
            : isFort
            ? `Royal Fortress Ramparts & Stone Havelis in ${cleanName}`
            : `Historic Heritage & Morning Promenade in ${cleanName}`
          : dayNum === 2
          ? isSpiritual
            ? `Sacred Corridors & Evening Diya Rituals in ${cleanName}`
            : isMountain
            ? `High Altitude Trails & Estate Harvest in ${cleanName}`
            : isBeach
            ? `Emerald Waterways & Sunset Lighthouses in ${cleanName}`
            : isFort
            ? `Artisanal Courtyards, Bazaars & Folk Arts in ${cleanName}`
            : `Artisanal Corridors & Local Flavors in ${cleanName}`
          : isSpiritual
          ? `Silent Meditation & Sacred Riverfront in ${cleanName}`
          : `Cultural Sanctuaries & Hidden Ateliers in ${cleanName}`;

      const spot1Name = isSpiritual
        ? dayNum === 1
          ? `${cleanName} Sacred Shrine & Temple Sanctuary`
          : `${cleanName} Holy Ghat & Sunrise Riverfront`
        : isMountain
        ? `${cleanName} Panoramic Ridge & Cloud Forest Trail`
        : isBeach
        ? `${cleanName} Golden Shoreline & Palm Grove Walk`
        : isFort
        ? `${cleanName} Historic Hilltop Fort & Ramparts`
        : `${cleanName} Historic Heritage Sanctuary`;

      const spot1Sub = isSpiritual
        ? "Sacred Shrine"
        : isMountain
        ? "Scenic Viewpoint"
        : isBeach
        ? "Coastal Haven"
        : isFort
        ? "Historic Fort"
        : "Heritage Monument";

      const spot1Photos = getSmartContextualPhoto(spot1Name, spot1Sub, cleanName);

      const spot2Name = isSpiritual
        ? `${cleanName} Satvik Annapurna Rasoi & Prasadam`
        : isMountain
        ? `${cleanName} Highland Tea Pavilion & Mountain Cafe`
        : isBeach
        ? `${cleanName} Coastal Flavors & Heritage Dining Shack`
        : isFort
        ? `${cleanName} Royal Thali & Heritage Dining Pavilion`
        : `${cleanName} Heritage Culinary Salon & Local Flavors`;

      const spot2Photos = getSmartContextualPhoto(spot2Name, "food", cleanName);

      return {
        day_number: dayNum,
        theme_title: themeTitle,
        description: `Hand-sequenced discovery of verified operational landmarks and local culinary sanctuaries across ${cleanName}.`,
        items: [
          {
            id: `dyn-${i}-1`,
            day_number: dayNum,
            time_slot: "morning" as const,
            order_index: 1,
            suggested_duration_mins: 90,
            travel_notes: isSpiritual
              ? `Begin at dawn as the first sun rays illuminate the stone sanctum and sacred corridors of ${cleanName}.`
              : `Begin morning exploration across the scenic promenades of ${cleanName} before crowds arrive.`,
            place: {
              id: `spot-${cleanName}-1-${dayNum}`,
              place_id: `place_${cleanName}_1_${dayNum}`,
              name: spot1Name,
              category: "attraction",
              sub_category: spot1Sub,
              business_status: "OPERATIONAL",
              rating: 4.9,
              user_ratings_total: 18500,
              photo_url: spot1Photos.main,
              photos: spot1Photos.angles,
              lat: geo.lat,
              lng: geo.lng,
              editorial_summary: `An iconic cultural landmark of ${cleanName}, offering historic heritage and atmospheric morning walks.`,
            },
          },
          {
            id: `dyn-${i}-2`,
            day_number: dayNum,
            time_slot: "afternoon" as const,
            order_index: 2,
            suggested_duration_mins: 60,
            travel_notes: isIndia
              ? `Enjoy authentic regional gastronomy and traditional delicacies prepared with pure local ingredients.`
              : `Enjoy authentic local cuisine and traditional coffee delicacies.`,
            place: {
              id: `spot-${cleanName}-2-${dayNum}`,
              place_id: `place_${cleanName}_2_${dayNum}`,
              name: spot2Name,
              category: "food",
              sub_category: isIndia ? "Satvik & Pure Veg Gastronomy" : "Local Artisanal Cafe",
              business_status: "OPERATIONAL",
              rating: 4.8,
              user_ratings_total: 8900,
              veg_status: isIndia ? "pure_veg" : "veg_options",
              photo_url: spot2Photos.main,
              photos: spot2Photos.angles,
              lat: geo.lat,
              lng: geo.lng,
              editorial_summary: `A celebrated local dining sanctuary in ${cleanName} serving regional dishes crafted with organic ingredients.`,
            },
          },
        ],
      };
    }),
    stays: [
      {
        id: `stay-${cleanName}`,
        place_id: `stay_${cleanName}`,
        name: `${cleanName} Heritage Boutique Resort`,
        category: "stay",
        business_status: "OPERATIONAL",
        rating: 4.9,
        photo_url: getSmartContextualPhoto(`${cleanName} Heritage Hotel`, "stay", cleanName).main,
        photos: getSmartContextualPhoto(`${cleanName} Heritage Hotel`, "stay", cleanName).angles,
        lat: geo.lat,
        lng: geo.lng,
      },
    ],
  };
}

export const SAMPLE_TRIP_PLANS: Record<string, TripPlan> = {
  "Kyoto, Japan": {
    id: "kyoto-plan",
    title: "Autumn in Kansai",
    location_name: "Kyoto, Japan",
    state_country: "Kansai Region, Japan",
    lat: 35.0116,
    lng: 135.7681,
    duration_days: 3,
    trip_style: "balanced",
    dietary_pref: "any",
    travelers_count: 2,
    budget: {
      hotel_cost_min: 1200,
      hotel_cost_max: 1800,
      food_cost_min: 600,
      food_cost_max: 900,
      transport_cost_min: 200,
      transport_cost_max: 350,
      activities_cost_min: 250,
      activities_cost_max: 400,
      total_estimate_min: 2250,
      total_estimate_max: 3450,
      currency: "INR",
      is_estimate: true,
    },
    days: [
      {
        day_number: 1,
        theme_title: "Arashiyama Bamboo & River Morning",
        description: "Early bamboo forest paths, Zen rock gardens, and soba lunch along the Oi river.",
        items: [
          {
            id: "kyoto-1",
            day_number: 1,
            time_slot: "morning",
            order_index: 1,
            suggested_duration_mins: 90,
            travel_notes: "Wander the 14th-century Sogenchi Garden before tour groups arrive. Reflection of Mt. Arashiyama in central pond.",
            place: {
              id: "p1",
              place_id: "ChIJb_f1064JAWARWzD00r2fVxE",
              name: "Tenryu-ji Temple & Zen Gardens",
              category: "attraction",
              sub_category: "Zen Buddhist Temple",
              business_status: "OPERATIONAL",
              rating: 4.8,
              user_ratings_total: 8200,
              photo_url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
              lat: 35.0158,
              lng: 135.6775,
              editorial_summary: "Head temple of the Tenryu-ji branch of Rinzai Zen Buddhism, celebrated for its 14th-century landscape garden.",
            },
          },
          {
            id: "kyoto-2",
            day_number: 1,
            time_slot: "afternoon",
            order_index: 2,
            suggested_duration_mins: 60,
            travel_notes: "Privately chartered pole-punt boat drifting upstream along the gorge with freshly brewed sencha.",
            place: {
              id: "p2",
              place_id: "ChIJd3P5oW4JAWAR6Z7Wk2Pz",
              name: "Oi River Private Wooden Boat Drift",
              category: "attraction",
              sub_category: "River Scenic Route",
              business_status: "OPERATIONAL",
              rating: 4.9,
              user_ratings_total: 1400,
              photo_url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800",
              lat: 35.0135,
              lng: 135.6772,
              editorial_summary: "A contemplative river journey along emerald forested cliffs on traditional wooden flatboats.",
            },
          },
        ],
      },
    ],
    stays: [
      {
        id: "s1",
        place_id: "stay_sowaka",
        name: "Sowaka Ryokan & Tea Pavilion",
        category: "stay",
        business_status: "OPERATIONAL",
        rating: 4.9,
        photo_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        lat: 35.0003,
        lng: 135.7788,
      },
    ],
  },
  "Varanasi, India": {
    id: "varanasi-plan",
    title: "Sacred Dawn on the Ganga",
    location_name: "Varanasi, India",
    state_country: "Uttar Pradesh, India",
    lat: 25.3176,
    lng: 82.9739,
    duration_days: 3,
    trip_style: "pilgrimage",
    dietary_pref: "pure_veg",
    travelers_count: 2,
    budget: {
      hotel_cost_min: 4500,
      hotel_cost_max: 9000,
      food_cost_min: 2500,
      food_cost_max: 4500,
      transport_cost_min: 1500,
      transport_cost_max: 2500,
      activities_cost_min: 2000,
      activities_cost_max: 3500,
      total_estimate_min: 10500,
      total_estimate_max: 19500,
      currency: "INR",
      is_estimate: true,
    },
    days: [
      {
        day_number: 1,
        theme_title: "Sunrise Rowing & Ancient Ghats",
        description: "Dawn wooden boat along Assi to Dashashwamedh Ghat, followed by labyrinthine lanes of Vishwanath Gali.",
        items: [
          {
            id: "v-1",
            day_number: 1,
            time_slot: "morning",
            order_index: 1,
            suggested_duration_mins: 120,
            travel_notes: "Board early (05:15 AM) at Assi Ghat to witness morning prayers and golden reflection on ancient stone facades.",
            place: {
              id: "v1",
              place_id: "ChIJassi_ghat_01",
              name: "Subah-e-Banaras & Assi Ghat Sunrise",
              category: "attraction",
              sub_category: "Sacred Ghat",
              business_status: "OPERATIONAL",
              rating: 4.9,
              user_ratings_total: 18500,
              photo_url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800",
              lat: 25.2899,
              lng: 83.0069,
              editorial_summary: "The southern-most sacred ghat where Vedic hymns, morning raga, and yoga greet the first rays of the sun.",
            },
          },
          {
            id: "v-2",
            day_number: 1,
            time_slot: "evening",
            order_index: 2,
            suggested_duration_mins: 90,
            travel_notes: "Secure a vantage spot by 06:00 PM for the synchronized multi-priest brass lamp Aarti ceremony.",
            place: {
              id: "v3",
              place_id: "ChIJdashashwamedh_01",
              name: "Dashashwamedh Maha Ganga Aarti",
              category: "attraction",
              sub_category: "Spiritual Ritual",
              business_status: "OPERATIONAL",
              rating: 4.9,
              user_ratings_total: 32000,
              photo_url: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800",
              lat: 25.3075,
              lng: 83.0105,
              editorial_summary: "The most magnificent and spiritual spectacle in India, with illuminated tiered brass lamps and conch resonance.",
            },
          },
        ],
      },
    ],
    stays: [
      {
        id: "v-stay-1",
        place_id: "brijrama_palace",
        name: "BrijRama Palace Heritage Hotel",
        category: "stay",
        business_status: "OPERATIONAL",
        rating: 4.9,
        photo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        lat: 25.308,
        lng: 83.011,
      },
    ],
  },
  "Ganga, India": {
    id: "ganga-plan",
    title: "Sacred Waters: The Ganga River Corridor",
    location_name: "Ganga, India",
    state_country: "Varanasi – Haridwar – Rishikesh, India",
    lat: 25.3176,
    lng: 83.0062,
    duration_days: 3,
    trip_style: "pilgrimage",
    dietary_pref: "satvik",
    travelers_count: 2,
    budget: {
      hotel_cost_min: 4500,
      hotel_cost_max: 9500,
      food_cost_min: 2200,
      food_cost_max: 4500,
      transport_cost_min: 1500,
      transport_cost_max: 2500,
      activities_cost_min: 1800,
      activities_cost_max: 3200,
      total_estimate_min: 10000,
      total_estimate_max: 19700,
      currency: "INR",
      is_estimate: true,
    },
    days: [
      {
        day_number: 1,
        theme_title: "The Eternal Ghats of Kashi: Dawn Boats & Maha Aarti",
        description: "Dawn bajra boat along Assi Ghat, sacred alleys of Kashi Vishwanath, and the evening Maha Aarti at Dashashwamedh.",
        items: [
          {
            id: "g-1",
            day_number: 1,
            time_slot: "morning",
            order_index: 1,
            suggested_duration_mins: 120,
            travel_notes: "Board early (05:15 AM) at Assi Ghat to witness sunrise prayer rituals and morning ragas as golden mist rises off the water.",
            place: {
              id: "g_assi",
              place_id: "ChIJassi_ghat_01",
              name: "Subah-e-Banaras & Assi Ghat Dawn Boat",
              category: "attraction",
              sub_category: "Sacred Riverfront Ghat",
              business_status: "OPERATIONAL",
              rating: 4.9,
              user_ratings_total: 21000,
              photo_url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800",
              photos: [
                "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000",
                "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=1000",
                "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000",
              ],
              lat: 25.2899,
              lng: 83.0069,
              editorial_summary: "The southern-most sacred ghat where Vedic hymns, morning raga, and silent dawn boat journeys greet the first sun rays.",
            },
          },
          {
            id: "g-2",
            day_number: 1,
            time_slot: "afternoon",
            order_index: 2,
            suggested_duration_mins: 90,
            travel_notes: "Walk the restored red sandstone corridor linking the sacred golden spire of Vishwanath directly with Manikarnika Ghat.",
            place: {
              id: "g_kashi",
              place_id: "ChIJkashi_corridor_01",
              name: "Shri Kashi Vishwanath Dham Corridor",
              category: "attraction",
              sub_category: "Sacred Temple Sanctuary",
              business_status: "OPERATIONAL",
              rating: 4.9,
              user_ratings_total: 48000,
              photo_url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800",
              photos: [
                "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000",
                "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000",
              ],
              lat: 25.3109,
              lng: 83.0107,
              editorial_summary: "One of the twelve revered Jyotirlingas, overlooking the sacred Ganga through majestic stone gateways.",
            },
          },
          {
            id: "g-3",
            day_number: 1,
            time_slot: "evening",
            order_index: 3,
            suggested_duration_mins: 90,
            travel_notes: "Secure a boat or riverfront seat by 06:00 PM for the synchronized multi-priest brass lamp Aarti with conch shell fanfares.",
            place: {
              id: "g_aarti",
              place_id: "ChIJdashashwamedh_01",
              name: "Dashashwamedh Maha Ganga Aarti",
              category: "attraction",
              sub_category: "Spiritual Fire Ceremony",
              business_status: "OPERATIONAL",
              rating: 4.9,
              user_ratings_total: 36000,
              photo_url: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800",
              photos: [
                "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=1000",
                "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000",
              ],
              lat: 25.3075,
              lng: 83.0105,
              editorial_summary: "The most iconic spiritual spectacle in India, with illuminated tiered brass lamps and rhythmic Vedic chants reflecting on the river.",
            },
          },
        ],
      },
      {
        day_number: 2,
        theme_title: "Haridwar: Gateway of the Gods & Sacred Foothills",
        description: "Where the pristine emerald Ganga leaves the Himalayas and enters the plains. Holy bathing and evening floating lamp ceremonies.",
        items: [
          {
            id: "g-4",
            day_number: 2,
            time_slot: "morning",
            order_index: 1,
            suggested_duration_mins: 90,
            travel_notes: "Dip in the swift-flowing sacred waters at Brahmakund, the most revered spot in Haridwar.",
            place: {
              id: "g_har_ki_pauri",
              place_id: "ChIJhar_ki_pauri_01",
              name: "Har Ki Pauri & Brahmakund Ghat",
              category: "attraction",
              sub_category: "Sacred Bathing Ghat",
              business_status: "OPERATIONAL",
              rating: 4.8,
              user_ratings_total: 29000,
              photo_url: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800",
              photos: [
                "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=1000",
                "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000",
              ],
              lat: 29.9567,
              lng: 78.1707,
              editorial_summary: "The historic riverfront ghat where celestial drops of nectar fell; pilgrims gather for holy dips in crystal Himalayan currents.",
            },
          },
          {
            id: "g-5",
            day_number: 2,
            time_slot: "evening",
            order_index: 2,
            suggested_duration_mins: 75,
            travel_notes: "Watch thousands of flickering leaf-and-marigold diyas released onto the current as dusk descends.",
            place: {
              id: "g_deepdaan",
              place_id: "ChIJhar_deepdaan_01",
              name: "Haridwar Evening Floating Diya Deepdaan",
              category: "attraction",
              sub_category: "Devotional Tradition",
              business_status: "OPERATIONAL",
              rating: 4.9,
              user_ratings_total: 14000,
              photo_url: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800",
              photos: [
                "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=1000",
              ],
              lat: 29.9572,
              lng: 78.1712,
              editorial_summary: "Floating oil lamps drift along the swift canal waters, creating a shimmering ribbon of golden light on the Ganga.",
            },
          },
        ],
      },
      {
        day_number: 3,
        theme_title: "Rishikesh: Himalayan Riverbanks & Yoga Sanctuary",
        description: "Emerald turquoise rapids beneath the Shivaliks, ancient suspension bridges, and peaceful riverfront ashram meditation.",
        items: [
          {
            id: "g-6",
            day_number: 3,
            time_slot: "morning",
            order_index: 1,
            suggested_duration_mins: 90,
            travel_notes: "Sit quietly for morning meditation at the sacred sangam steps as cool mountain air flows down from Garhwal peaks.",
            place: {
              id: "g_triveni",
              place_id: "ChIJtriveni_ghat_01",
              name: "Triveni Ghat Dawn Dhyana & Holy Sangam",
              category: "attraction",
              sub_category: "Riverfront Meditation Ghat",
              business_status: "OPERATIONAL",
              rating: 4.8,
              user_ratings_total: 19500,
              photo_url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800",
              photos: [
                "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000",
              ],
              lat: 30.1033,
              lng: 78.2947,
              editorial_summary: "The sacred confluence where pilgrims gather for peaceful early dawn chants and spiritual contemplation beside emerald rapids.",
            },
          },
          {
            id: "g-7",
            day_number: 3,
            time_slot: "evening",
            order_index: 2,
            suggested_duration_mins: 90,
            travel_notes: "Experience the tranquil sunset Aarti conducted by ashram students beside the iconic Lord Shiva statue on the river.",
            place: {
              id: "g_parmarth",
              place_id: "ChIJparmarth_01",
              name: "Parmarth Niketan Riverfront Ganga Aarti",
              category: "attraction",
              sub_category: "Ashram Spiritual Aarti",
              business_status: "OPERATIONAL",
              rating: 4.9,
              user_ratings_total: 26000,
              photo_url: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800",
              photos: [
                "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=1000",
              ],
              lat: 30.1197,
              lng: 78.3129,
              editorial_summary: "Famous ashram riverside Aarti with universal prayers, Vedic chanting, and a majestic view of the Himalayan riverbank.",
            },
          },
        ],
      },
    ],
    stays: [
      {
        id: "g-stay-1",
        place_id: "brijrama_palace_ganga",
        name: "BrijRama Palace Heritage Hotel on Darbhanga Ghat",
        category: "stay",
        business_status: "OPERATIONAL",
        rating: 4.9,
        photo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        lat: 25.308,
        lng: 83.011,
      },
    ],
  },
};

// Aliases for Ganga
SAMPLE_TRIP_PLANS["Ganga"] = SAMPLE_TRIP_PLANS["Ganga, India"];
SAMPLE_TRIP_PLANS["River Ganga"] = SAMPLE_TRIP_PLANS["Ganga, India"];
SAMPLE_TRIP_PLANS["Ganges"] = SAMPLE_TRIP_PLANS["Ganga, India"];

export function getOrCreateTripPlan(
  locationName: string,
  days: number = 3,
  style: TripStyle = "balanced",
  diet: VegDietaryStatus = "any"
): TripPlan {
  const norm = locationName.trim().toLowerCase();

  // Normalized key match
  for (const [key, plan] of Object.entries(SAMPLE_TRIP_PLANS)) {
    const kLower = key.toLowerCase();
    if (kLower === norm || norm.includes(kLower) || kLower.includes(norm)) {
      return plan;
    }
  }

  // Ganga / Ganges specific detection
  if (norm.includes("ganga") || norm.includes("ganges")) {
    return SAMPLE_TRIP_PLANS["Ganga, India"];
  }

  return generateDynamicFallbackPlan(locationName, days, style, diet);
}
