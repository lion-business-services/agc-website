/**
 * Single source of truth for business information.
 * Change a value here and it updates everywhere on the site.
 * Do NOT add facts (address, years in business, counties) until AGC approves them.
 */
export const business = {
  /** Estimate requests go here (FormSubmit). leadCc is copied on every request. */
  leadEmail: "info@americanbuildnj.com",
  leadCc: "daniel.bettran@gmail.com",
  name: "American General Contractor LLC",
  shortName: "American General Contractor",
  initials: "AGC",
  owner: "Daniel A. Bettran",
  tagline: "Building a Stronger Tomorrow",
  supportingLine: "Your Vision. Our Expertise. A Better Tomorrow.",
  values: "Quality • Integrity • Results",
  phone: {
    display: "609-317-6618",
    href: "tel:+16093176618",
    e164: "+16093176618",
  },
  email: {
    display: "info@AmericanBuildNJ.com",
    href: "mailto:info@AmericanBuildNJ.com",
  },
  domain: "AmericanBuildNJ.com",
  url: "https://americanbuildnj.com",
  region: "South Jersey",
  state: "NJ",
  stateName: "New Jersey",
  license: "NJ HIC #13VH10631700",
  licenseNumber: "13VH10631700",
  insured: "Fully Insured",
  /** SOCIAL MEDIA: paste the full profile links. Empty ones stay hidden. */
  social: {
    facebook: "https://www.facebook.com/americangeneralcontractor",
    instagram: "https://www.instagram.com/americangeneralcontractor",
    tiktok: "",
    youtube: "",
    google: "https://share.google/IajItNz2ZzSkhBn3W", // Google Business Profile share link
  },
  /**
   * GOOGLE PLACE ID — unlocks the "Write a review" link and live reviews.
   * Open the share link above in a browser, then get the Place ID from Google's Place ID Finder
   * (developers.google.com/maps/documentation/places/web-service/place-id) by searching the business name.
   * It looks like "ChIJ...". Also add it in Vercel as GOOGLE_PLACE_ID for the live reviews function.
   */
  googlePlaceId: "",
  /** Direct "leave a review" link. Leave empty: it is built from googlePlaceId, or falls back to the Google share link. */
  googleReviewUrl: "",
  /**
   * GOOGLE MAP shown on the Service Area and Contact pages.
   * Default is a South Jersey overview. Once the Google Business Profile is live, replace with
   * Google Maps → AGC listing → Share → Embed a map → copy only the src="..." link.
   */
  mapEmbedUrl: "https://www.google.com/maps?q=South+Jersey,+New+Jersey&z=9&output=embed",
  developer: {
    name: "VYNTEX, LLC",
    location: "NJ",
    phone: "609-780-3218",
    phoneHref: "tel:+16097803218",
    email: "info@vyntexusa.com",
  },
};

export const trustPoints = [
  business.insured,
  business.license,
  "Residential & Commercial",
  `Serving ${business.region}`,
];

/** Best available "leave us a Google review" link. */
export const reviewLink = () =>
  business.googleReviewUrl ||
  (business.googlePlaceId ? `https://search.google.com/local/writereview?placeid=${business.googlePlaceId}` : business.social.google);
