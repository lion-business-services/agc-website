/**
 * PHOTOS — edit this file to add or swap pictures. No other code changes needed.
 * Files live in /public/services/ (three sizes per service, generated from the same photo):
 *   <key>-hero.webp 1920x1080 (service page banner), <key>-card.webp 960x720 (cards), <key>-thumb.webp 160x120 (menu)
 * To replace a photo: save the new one under the same three names, or point `src` at any new file
 * (the site falls back to the -card file for the other sizes automatically).
 */
const svc = (key, alt) => ({ src: `/services/${key}-card.webp`, hero: `/services/${key}-hero.webp`, thumb: `/services/${key}-thumb.webp`, alt });

export const serviceImages = {
  kitchen:    svc("kitchen",    "Remodeled kitchen with dark wood cabinets, white island and hardwood floors"),
  bathroom:   svc("bathroom",   "Renovated bathroom with freestanding tub, glass shower and arched window"),
  addition:   svc("addition",   "Home addition being framed onto the side of a house"),
  deck:       svc("deck",       "Wood deck with pergola, dining table and outdoor seating"),
  pergola:    svc("pergola",    "Modern pergola over a patio with outdoor dining furniture"),
  windows:    svc("windows",    "New windows and doors staged inside a home during installation"),
  flooring:   svc("flooring",   "Installer measuring and laying hardwood flooring planks"),
  remodel:    svc("remodel",    "Open-concept remodeled living room and kitchen with new flooring"),
  commercial: svc("commercial", "Commercial building under construction with roof trusses and excavator"),
};

export const ownerPhoto = { src: "/team/daniel-bettran.jpg", alt: "Daniel A. Bettran, owner of American General Contractor LLC" };
