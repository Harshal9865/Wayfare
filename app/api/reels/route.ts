import { NextRequest, NextResponse } from "next/server";

export interface ReelItem {
  id: string;
  creator: string;
  destination: string;
  regionType: "india" | "abroad";
  query: string;
  caption: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  likes: number;
  tags: string[];
}

// Guaranteed-working public travel MP4 videos (with CORS and direct streaming)
const VERIFIED_FALLBACK_VIDEOS = {
  sunrise: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  nature: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  mountains: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  river: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
  heritage: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
};

const REELS_DATABASE: ReelItem[] = [
  {
    id: "reel-varanasi-aarti",
    creator: "@sacred_banaras",
    destination: "Varanasi, India",
    regionType: "india",
    query: "Varanasi, India",
    caption: "The resonant echo of conch shells during morning Ganga Aarti at Assi Ghat 🪔🙏",
    duration: "0:45",
    thumbnailUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&auto=format&fit=crop&q=80",
    videoUrl: VERIFIED_FALLBACK_VIDEOS.river,
    likes: 4850,
    tags: ["Varanasi", "Spiritual", "Ghats", "Heritage"],
  },
  {
    id: "reel-rishikesh-yoga",
    creator: "@himalayan_yogi",
    destination: "Rishikesh, India",
    regionType: "india",
    query: "Rishikesh, India",
    caption: "Sunrise meditation by the emerald waters of Mother Ganga under Lakshman Jhula 🧘‍♂️✨",
    duration: "0:35",
    thumbnailUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
    videoUrl: VERIFIED_FALLBACK_VIDEOS.nature,
    likes: 3120,
    tags: ["Rishikesh", "Yoga", "Ashram", "Nature"],
  },
  {
    id: "reel-ladakh-pass",
    creator: "@ladakh_diaries",
    destination: "Leh Ladakh, India",
    regionType: "india",
    query: "Leh Ladakh, India",
    caption: "Riding through Khardung La pass at 18,380 ft surrounded by prayer flags 🏔️🏍️",
    duration: "0:40",
    thumbnailUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80",
    videoUrl: VERIFIED_FALLBACK_VIDEOS.mountains,
    likes: 5240,
    tags: ["Ladakh", "Mountains", "Adventure", "Passes"],
  },
  {
    id: "reel-kerala-houseboat",
    creator: "@backwater_tales",
    destination: "Alleppey, Kerala",
    regionType: "india",
    query: "Alleppey, India",
    caption: "Gliding quietly through palm tree canals on a traditional houseboat at golden hour 🌴🛶",
    duration: "0:30",
    thumbnailUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80",
    videoUrl: VERIFIED_FALLBACK_VIDEOS.river,
    likes: 2980,
    tags: ["Kerala", "Backwaters", "Houseboat", "Serene"],
  },
  {
    id: "reel-jaipur-palace",
    creator: "@pinkcity_diaries",
    destination: "Jaipur, Rajasthan",
    regionType: "india",
    query: "Jaipur, India",
    caption: "Sunlight filtering through the 953 jharokhas of Hawa Mahal at early dawn 🏰✨",
    duration: "0:38",
    thumbnailUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&auto=format&fit=crop&q=80",
    videoUrl: VERIFIED_FALLBACK_VIDEOS.heritage,
    likes: 4120,
    tags: ["Jaipur", "Forts", "Palace", "Royal"],
  },
  {
    id: "reel-kyoto-bamboo",
    creator: "@wander_in_kyoto",
    destination: "Kyoto, Japan",
    regionType: "abroad",
    query: "Kyoto, Japan",
    caption: "Early 06:00 AM silence in Arashiyama Bamboo Grove before any crowd arrives 🌿✨",
    duration: "0:28",
    thumbnailUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80",
    videoUrl: VERIFIED_FALLBACK_VIDEOS.nature,
    likes: 2420,
    tags: ["Kyoto", "Temples", "Bamboo", "Japan"],
  },
  {
    id: "reel-lisbon-tram",
    creator: "@lisbon_stories",
    destination: "Lisbon, Portugal",
    regionType: "abroad",
    query: "Lisbon, Portugal",
    caption: "Riding Tram 28 through the sun-drenched terracotta curves of Alfama 🚋🇵🇹",
    duration: "0:32",
    thumbnailUrl: "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=600&auto=format&fit=crop&q=80",
    videoUrl: VERIFIED_FALLBACK_VIDEOS.sunrise,
    likes: 3190,
    tags: ["Lisbon", "Tram", "Portugal", "Coastal"],
  },
  {
    id: "reel-oaxaca-weavers",
    creator: "@oaxaca_craft",
    destination: "Oaxaca, Mexico",
    regionType: "abroad",
    query: "Oaxaca, Mexico",
    caption: "Watching traditional Zapotec weavers dye wool using natural cochineal and indigo 🧶🎨",
    duration: "0:50",
    thumbnailUrl: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=600&auto=format&fit=crop&q=80",
    videoUrl: VERIFIED_FALLBACK_VIDEOS.heritage,
    likes: 1930,
    tags: ["Oaxaca", "Artisans", "Mexico", "Craft"],
  },
  {
    id: "reel-amalfi-cliffside",
    creator: "@mediterranean_breeze",
    destination: "Amalfi, Italy",
    regionType: "abroad",
    query: "Amalfi, Italy",
    caption: "Cruising along Positano cliffs with lemon trees hanging over crystal blue coves 🍋🚤",
    duration: "0:42",
    thumbnailUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80",
    videoUrl: VERIFIED_FALLBACK_VIDEOS.sunrise,
    likes: 3840,
    tags: ["Amalfi", "Italy", "Coast", "Villas"],
  },
];

// In-memory likes cache
const LIKES_CACHE: Record<string, number> = {};

// In-memory Pexels response cache (1-hour TTL)
const PEXELS_CACHE = new Map<string, { timestamp: number; reels: ReelItem[] }>();
const CACHE_TTL_MS = 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") || "india";
  const filter = searchParams.get("filter") || "All";
  const search = searchParams.get("search")?.toLowerCase() || "";

  const pexelsApiKey = process.env.PEXELS_API_KEY;

  // Build appropriate Pexels search query
  let searchQuery = "";
  if (search) {
    searchQuery = `${search} travel`;
  } else if (filter !== "All") {
    searchQuery = `${filter} travel landscape`;
  } else if (region === "india") {
    searchQuery = "India travel temple river mountains";
  } else {
    searchQuery = "travel landscape nature voyage";
  }

  const cacheKey = `${region}-${filter}-${searchQuery.toLowerCase()}`;

  // Check cache first
  const cached = PEXELS_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    const cachedWithLikes = cached.reels.map((r) => ({
      ...r,
      likes: r.likes + (LIKES_CACHE[r.id] || 0),
    }));
    return NextResponse.json({
      success: true,
      total: cachedWithLikes.length,
      reels: cachedWithLikes,
      source: "cache",
    });
  }

  // Query live Pexels API
  if (pexelsApiKey) {
    try {
      const pexelsRes = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(
          searchQuery
        )}&per_page=8&orientation=portrait`,
        {
          headers: { Authorization: pexelsApiKey },
        }
      );

      if (pexelsRes.ok) {
        const pexelsData = await pexelsRes.json();
        if (pexelsData.videos && pexelsData.videos.length > 0) {
          const liveReels: ReelItem[] = pexelsData.videos.map((v: any, index: number) => {
            // Find best portrait/hd MP4 video file
            const mp4Files = (v.video_files || []).filter(
              (f: any) => f.file_type === "video/mp4" || (f.link && f.link.includes(".mp4"))
            );
            const chosenFile =
              mp4Files.find((f: any) => f.quality === "hd" && f.width <= 1080) ||
              mp4Files.find((f: any) => f.quality === "sd") ||
              mp4Files[0] ||
              v.video_files[0];

            const destinationTitle =
              filter !== "All"
                ? filter
                : region === "india"
                ? index % 3 === 0
                  ? "Varanasi, India"
                  : index % 3 === 1
                  ? "Rishikesh, India"
                  : "Leh Ladakh, India"
                : index % 3 === 0
                ? "Kyoto, Japan"
                : index % 3 === 1
                ? "Lisbon, Portugal"
                : "Amalfi, Italy";

            return {
              id: `pexels-${v.id}`,
              creator: `@${v.user?.name ? v.user.name.toLowerCase().replace(/[^a-z0-9]/g, "_") : "traveler"}`,
              destination: destinationTitle,
              regionType: (region === "india" ? "india" : "abroad") as "india" | "abroad",
              query: filter !== "All" ? filter : destinationTitle,
              caption: `Atmospheric journey through ${destinationTitle} • Captured at natural golden hour ✨`,
              duration: `0:${v.duration < 10 ? "0" + v.duration : Math.min(v.duration, 59)}`,
              thumbnailUrl: v.image || "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600",
              videoUrl: chosenFile?.link || VERIFIED_FALLBACK_VIDEOS.nature,
              likes: 1800 + index * 320,
              tags: [filter, "Pexels", "Voyage"],
            };
          });

          // Cache results
          PEXELS_CACHE.set(cacheKey, { timestamp: Date.now(), reels: liveReels });

          return NextResponse.json({
            success: true,
            total: liveReels.length,
            reels: liveReels.map((r) => ({
              ...r,
              likes: r.likes + (LIKES_CACHE[r.id] || 0),
            })),
            source: "pexels_live",
          });
        }
      }
    } catch (err) {
      console.warn("Pexels Video API fetch error, falling back to verified archive:", err);
    }
  }

  // Fallback to verified database
  let result = [...REELS_DATABASE];

  if (region === "india") {
    result = result.filter((r) => r.regionType === "india");
  } else if (region === "abroad") {
    result = result.filter((r) => r.regionType === "abroad");
  }

  if (filter !== "All") {
    result = result.filter(
      (r) =>
        r.destination.toLowerCase().includes(filter.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase() === filter.toLowerCase())
    );
  }

  const updatedReels = result.map((r) => ({
    ...r,
    likes: r.likes + (LIKES_CACHE[r.id] || 0),
  }));

  return NextResponse.json({
    success: true,
    total: updatedReels.length,
    reels: updatedReels,
    source: "database",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reelId, action } = body;

    if (!reelId) {
      return NextResponse.json({ error: "reelId is required" }, { status: 400 });
    }

    if (!LIKES_CACHE[reelId]) {
      LIKES_CACHE[reelId] = 0;
    }

    if (action === "like") {
      LIKES_CACHE[reelId] += 1;
    } else if (action === "unlike") {
      LIKES_CACHE[reelId] = Math.max(0, LIKES_CACHE[reelId] - 1);
    }

    const originalReel = REELS_DATABASE.find((r) => r.id === reelId);
    const totalLikes = (originalReel?.likes || 1200) + LIKES_CACHE[reelId];

    return NextResponse.json({
      success: true,
      reelId,
      likes: totalLikes,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update like" }, { status: 500 });
  }
}
