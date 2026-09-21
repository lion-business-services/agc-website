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
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    google: "", // Google Business Profile link (the "share" link from Google Maps)
  },
  /** Link customers use to write a Google review (Google Business Profile → "Ask for reviews"). */
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
