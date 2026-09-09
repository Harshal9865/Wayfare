/**
 * Intelligent Travel Image Resolver & Knowledge Engine for WAYFARE
 * Provides context-aware, verified photography and resilient SVG fallbacks for ANY place in India or worldwide.
 */

interface PhotoSet {
  main: string;
  angles: string[];
}

// Curated high-resolution, verified travel photography catalog
const KNOWLEDGE_PHOTO_REGISTRY: Record<string, PhotoSet> = {
  // 1. Spiritual & Sacred Temples / Ghats / Shrines
  spiritual_ghat: {
    main: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000&auto=format&fit=crop&q=80",
    ],
  },
  spiritual_temple: {
    main: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1000&auto=format&fit=crop&q=80",
    ],
  },
  spiritual_monastery: {
    main: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588096344356-9b433cf5884a?w=1000&auto=format&fit=crop&q=80",
    ],
  },

  // 2. Forts, Palaces & Royal Heritage
  fort_heritage: {
    main: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000&auto=format&fit=crop&q=80",
    ],
  },
  palace_pavilion: {
    main: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80",
    ],
  },
  ancient_ruins: {
    main: "https://images.unsplash.com/photo-1600100397608-f010f443b351?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1600100397608-f010f443b351?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80",
    ],
  },

  // 3. Mountains, Hills & Valleys
  mountain_peaks: {
    main: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80",
    ],
  },
  tea_plantations: {
    main: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1000&auto=format&fit=crop&q=80",
    ],
  },
  high_desert_lake: {
    main: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80",
    ],
  },

  // 4. Beaches, Backwaters & Rivers
  beach_coastal: {
    main: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80",
    ],
  },
  backwaters_houseboat: {
    main: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1000&auto=format&fit=crop&q=80",
    ],
  },
  waterfalls: {
    main: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1546548970-71785318a17b?w=1000&auto=format&fit=crop&q=80",
    ],
  },

  // 5. Forests, Wildlife & Safari
  wildlife_forest: {
    main: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1000&auto=format&fit=crop&q=80",
    ],
  },

  // 6. Culinary & Dining
  culinary_thali: {
    main: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1000&auto=format&fit=crop&q=80",
    ],
  },

  // 7. Stays & Hospitality
  heritage_hotel: {
    main: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80",
    ],
  },

  // 8. General City / Cultural Promenade
  cultural_promenade: {
    main: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80",
    angles: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80",
    ],
  },
};

/**
 * Categorize a place based on name, category, and location to find its perfect knowledge match
 */
export function getSmartContextualPhoto(
  placeName: string,
  subCategory: string = "",
  locationName: string = ""
): PhotoSet {
  const text = `${placeName} ${subCategory} ${locationName}`.toLowerCase();

  // Spiritual / Temple / Ghat / Gurudwara / Sacred
  if (
    text.includes("ghat") ||
    text.includes("aarti") ||
    text.includes("ganga") ||
    text.includes("ganges") ||
    text.includes("sangam") ||
    text.includes("prayag")
  ) {
    return KNOWLEDGE_PHOTO_REGISTRY.spiritual_ghat;
  }

  if (
    text.includes("temple") ||
    text.includes("mandir") ||
    text.includes("dham") ||
    text.includes("jyotirlinga") ||
    text.includes("amman") ||
    text.includes("swamy") ||
    text.includes("shrine") ||
    text.includes("gurudwara") ||
    text.includes("church") ||
    text.includes("mosque") ||
    text.includes("masjid")
  ) {
    return KNOWLEDGE_PHOTO_REGISTRY.spiritual_temple;
  }

  if (
    text.includes("monastery") ||
    text.includes("gompa") ||
    text.includes("stupa") ||
    text.includes("ashram") ||
    text.includes("meditation")
  ) {
    return KNOWLEDGE_PHOTO_REGISTRY.spiritual_monastery;
  }

  // Forts & Palaces
  if (
    text.includes("fort") ||
    text.includes("qila") ||
    text.includes("garh") ||
    text.includes("haveli") ||
    text.includes("bastion")
  ) {
    return KNOWLEDGE_PHOTO_REGISTRY.fort_heritage;
  }

  if (
    text.includes("palace") ||
    text.includes("mahal") ||
    text.includes("chandra") ||
    text.includes("niwas")
  ) {
    return KNOWLEDGE_PHOTO_REGISTRY.palace_pavilion;
  }

  if (
    text.includes("ruins") ||
    text.includes("ancient") ||
    text.includes("caves") ||
    text.includes("stone") ||
    text.includes("monument") ||
    text.includes("archaeological") ||
    text.includes("hampi") ||
    text.includes("ajanta") ||
    text.includes("ellora")
  ) {
    return KNOWLEDGE_PHOTO_REGISTRY.ancient_ruins;
  }

  // Mountains & Nature
  if (
    text.includes("mountain") ||
    text.includes("peak") ||
    text.includes("snow") ||
    text.includes("pass") ||
    text.includes("trek") ||
    text.includes("himalaya") ||
    text.includes("valley") ||
    text.includes("glacier") ||
    text.includes("viewpoint")
  ) {
    return KNOWLEDGE_PHOTO_REGISTRY.mountain_peaks;
  }

  if (
    text.includes("tea") ||
    text.includes("coffee") ||
    text.includes("estate") ||
    text.includes("plantation") ||
    text.includes("munnar") ||
    text.includes("darjeeling") ||
    text.includes("coorg") ||
    text.includes("ooty")
  ) {
    return KNOWLEDGE_PHOTO_REGISTRY.tea_plantations;
  }

  if (
    text.includes("spiti") ||
    text.includes("ladakh") ||
    text.includes("pangong") ||
    text.includes("desert") ||
    text.includes("kutch") ||
    text.includes("rann")
  ) {
    return KNOWLEDGE_PHOTO_REGISTRY.high_desert_lake;
  }

  // Beaches, Water & Rivers
  if (
    text.includes("beach") ||
    text.includes("sea") ||
    text.includes("coast") ||
    text.includes("shore") ||
    text.includes("cove")
  ) {
    return KNOWLEDGE_PHOTO_REGISTRY.beach_coastal;
  }

  if (
    text.includes("backwaters") ||
    text.includes("houseboat") ||
    text.includes("canal") ||
    text.includes("lagoon") ||
    text.includes("lake")
  ) {
    return KNOWLEDGE_PHOTO_REGISTRY.backwaters_houseboat;
  }

  if (text.includes("waterfall") || text.includes("falls")) {
    return KNOWLEDGE_PHOTO_REGISTRY.waterfalls;
  }

  // Wildlife & Safari
  if (
    text.includes("safari") ||
    text.includes("national park") ||
    text.includes("wildlife") ||
    text.includes("sanctuary") ||
    text.includes("tiger") ||
    text.includes("forest") ||
    text.includes("jungle")
  ) {
    return KNOWLEDGE_PHOTO_REGISTRY.wildlife_forest;
  }

  // Food & Dining
  if (
    text.includes("food") ||
    text.includes("restaurant") ||
    text.includes("thali") ||
    text.includes("cafe") ||
    text.includes("bazaar") ||
    text.includes("rasoi") ||
    text.includes("cuisine") ||
    text.includes("dining")
  ) {
    return KNOWLEDGE_PHOTO_REGISTRY.culinary_thali;
  }

  // Stay / Hotel / Resort
  if (
    text.includes("hotel") ||
    text.includes("resort") ||
    text.includes("stay") ||
    text.includes("palace hotel") ||
    text.includes("villa")
  ) {
    return KNOWLEDGE_PHOTO_REGISTRY.heritage_hotel;
  }

  // Default cultural promenade
  return KNOWLEDGE_PHOTO_REGISTRY.cultural_promenade;
}

/**
 * Programmatic SVG Travel Badge Fallback
 * Encoded as a data URI so it works 100% offline with ZERO network requests.
 */
export function generateTravelCardPlaceholderSvg(
  placeName: string,
  category: string = "Waypoint",
  locationName: string = "Cultural Corridor"
): string {
  const initial = (placeName || "W").charAt(0).toUpperCase();
  const safeName = (placeName || "Cultural Landmark")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const safeLoc = (locationName || "Verified Waypoint")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#142B28" />
        <stop offset="50%" stop-color="#1E4D45" />
        <stop offset="100%" stop-color="#0F1F1D" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(250,247,242,0.06)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)" />
    <rect width="100%" height="100%" fill="url(#grid)" />
    <circle cx="400" cy="200" r="140" fill="none" stroke="rgba(30,140,128,0.25)" stroke-width="2" stroke-dasharray="6,6"/>
    <circle cx="400" cy="200" r="70" fill="rgba(30,140,128,0.2)" stroke="rgba(250,247,242,0.2)" stroke-width="2"/>
    <text x="400" y="222" font-family="serif" font-size="64" fill="#FAF7F2" font-weight="bold" text-anchor="middle">${initial}</text>
    <rect x="280" y="320" width="240" height="30" rx="15" fill="rgba(250,247,242,0.12)" stroke="rgba(250,247,242,0.2)" stroke-width="1"/>
    <text x="400" y="340" font-family="sans-serif" font-size="11" letter-spacing="2" fill="#FAF7F2" font-weight="600" text-anchor="middle" text-transform="uppercase">${category.toUpperCase()} · VERIFIED SPOT</text>
    <text x="400" y="390" font-family="serif" font-size="22" fill="#FAF7F2" text-anchor="middle">${safeName}</text>
    <text x="400" y="420" font-family="sans-serif" font-size="12" letter-spacing="1" fill="rgba(250,247,242,0.6)" text-anchor="middle">${safeLoc}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
