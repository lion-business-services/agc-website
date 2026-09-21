export const projectTypes = [
  "Kitchen Remodeling", "Bathroom Remodeling", "Addition", "Deck",
  "Pergola / Outdoor Living", "Windows", "Exterior / Entry Doors",
  "Shower / Glass Door Installation", "Flooring", "General Remodeling",
  "Commercial", "Other",
];

/** Editable. These are homeowner planning ranges, NOT AGC pricing. */
export const budgetRanges = [
  "Under $10,000", "$10,000 – $25,000", "$25,000 – $50,000",
  "$50,000 – $100,000", "$100,000 – $250,000", "$250,000+", "I'm not sure yet",
];

export const timelines = [
  "As soon as possible", "Within 1–3 months", "3–6 months", "6+ months", "Planning / researching",
];

export const contactMethods = ["Phone", "Text", "Email"];

export const timeWindows = [
  "Morning (8am – 12pm)", "Afternoon (12pm – 4pm)", "Evening (4pm – 7pm)", "Flexible",
];

/** FormSubmit accepts 10 MB total per submission, so photos are shrunk in the browser first. */
export const uploadRules = {
  maxFilesPerGroup: 6,
  maxTotalBytes: 9 * 1024 * 1024, // after shrinking, all photos together
  maxEdge: 1600,
  quality: 0.78,
  acceptAttr: "image/*",
};

