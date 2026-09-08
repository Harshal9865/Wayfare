import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';
  const count = parseInt(searchParams.get('count') || '5', 10);
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || '';

  if (!query || !apiKey) {
    return NextResponse.json({ photos: [], name: '', address: '', rating: 0, isOpen: null });
  }

  try {
    // Step 1: Text Search to get place_id
    const searchRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`
    );
    const searchData = await searchRes.json();
    const topPlace = searchData.results?.[0];

    if (!topPlace) {
      return NextResponse.json({ photos: [], name: '', address: '', rating: 0, isOpen: null });
    }

    const placeId = topPlace.place_id;

    // Step 2: Place Details to get full photo refs + hours
    const detailRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos,name,formatted_address,rating,opening_hours,user_ratings_total&key=${apiKey}`
    );
    const detailData = await detailRes.json();
    const result = detailData.result;

    // Extract up to `count` photo references
    const photoRefs: string[] = (result?.photos || [])
      .slice(0, count)
      .map((p: { photo_reference: string }) => p.photo_reference);

    // Build Google Places Photo URLs — these redirect to CDN images
    const photoUrls = photoRefs.map(
      (ref) =>
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${apiKey}`
    );

    return NextResponse.json({
      photos: photoUrls,
      name: result?.name || topPlace.name || '',
      address: result?.formatted_address || topPlace.formatted_address || '',
      rating: result?.rating || topPlace.rating || 0,
      userRatingsTotal: result?.user_ratings_total || topPlace.user_ratings_total || 0,
      isOpen: result?.opening_hours?.open_now ?? null,
    });
  } catch (err) {
    console.error('[/api/places/photos] Error:', err);
    return NextResponse.json({ photos: [], name: '', address: '', rating: 0, isOpen: null });
  }
}
