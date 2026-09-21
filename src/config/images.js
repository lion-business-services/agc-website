/**
 * PHOTOS — edit this file to add pictures. No other code changes needed.
 * 1. Put the image in /public/projects/ (or /public/team/ for Daniel's photo)
 * 2. Set src to its path, e.g. "/projects/kitchen-01.jpg", and describe it in alt.
 * While src is null a colored placeholder shows instead.
 *
 * Stock photos are fine for `serviceImages`. The `projects` gallery must only
 * show real American General Contractor work.
 */
export const serviceImages = {
  kitchen:    { src: null, alt: "" },
  bathroom:   { src: null, alt: "" },
  addition:   { src: null, alt: "" },
  deck:       { src: null, alt: "" },
  pergola:    { src: null, alt: "" },
  windows:    { src: null, alt: "" },
  flooring:   { src: null, alt: "" },
  remodel:    { src: null, alt: "" },
  commercial: { src: null, alt: "" },
};

export const ownerPhoto = { src: null, alt: "Daniel A. Bettran, owner of American General Contractor LLC" };

export const projectCategories = [
  "Kitchen Remodeling", "Bathroom Remodeling", "Pergolas & Outdoor Living", "Decks",
  "Additions", "Windows & Doors", "Flooring", "Whole-Home Remodeling",
];

/** Add as many as you like. size: "big" | "tall" | undefined */
export const projects = [
  { category: "Kitchen Remodeling",        src: null, alt: "", size: "big" },
  { category: "Bathroom Remodeling",       src: null, alt: "" },
  { category: "Pergolas & Outdoor Living", src: null, alt: "", size: "tall" },
  { category: "Decks",                     src: null, alt: "" },
  { category: "Additions",                 src: null, alt: "" },
  { category: "Windows & Doors",           src: null, alt: "" },
  { category: "Flooring",                  src: null, alt: "" },
  { category: "Whole-Home Remodeling",     src: null, alt: "" },
];
