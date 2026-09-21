/**
 * PREVIEW MODE — only used to make the single-file demo (`npm run build:preview`).
 * In preview, forms do not email anyone, and Google content is simulated.
 * The real site (npm run dev / npm run build) never turns this on.
 */
export const PREVIEW = import.meta.env.VITE_PREVIEW === "1";
