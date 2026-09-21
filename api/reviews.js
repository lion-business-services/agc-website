/**
 * Vercel serverless function: GET /api/reviews
 * Pulls AGC's Google rating + up to 5 reviews (Google's limit) from the Places API (New).
 * The API key stays on the server. Until the two env vars below are set in Vercel,
 * this returns an empty list and the site shows its "reviews are on the way" state.
 *
 *   GOOGLE_PLACES_API_KEY   (Google Cloud → Places API (New) → Credentials)
 *   GOOGLE_PLACE_ID         (AGC's Place ID from Google's Place ID Finder)
 */
export default async function handler(req, res) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return res.status(200).json({ reviews: [] });

  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews" },
    });
    if (!r.ok) throw new Error(`places ${r.status}`);
    const p = await r.json();
    const reviews = (p.reviews || [])
      .filter((v) => v.rating >= 4 && v.text?.text)
      .map((v) => ({
        author: v.authorAttribution?.displayName || "Google user",
        photo: v.authorAttribution?.photoUri || "",
        rating: v.rating,
        text: v.text.text,
        when: v.relativePublishTimeDescription || "",
      }));
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800"); // refresh daily
    return res.status(200).json({ rating: p.rating, total: p.userRatingCount, url: p.googleMapsUri, reviews });
  } catch (e) {
    console.error("[reviews]", e);
    return res.status(200).json({ reviews: [] });
  }
}
