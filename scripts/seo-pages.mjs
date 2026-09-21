/**
 * Runs automatically after `npm run build`.
 * A React site normally ships ONE index.html, so Facebook/iMessage link previews and some search
 * bots see the same title on every page. This writes a copy of index.html for each route with the
 * correct <title>, description, canonical, Open Graph tags and structured data (JSON-LD) baked in.
 * It also regenerates sitemap.xml. Nothing to maintain: it reads the same config files as the site.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { business } from "../src/config/business.js";
import { services } from "../src/config/services.js";

const base = business.url;
const R = business.region;
const pages = [
  { path: "/services", title: `Remodeling & Construction Services in ${R}`, desc: `Kitchen and bathroom remodeling, additions, decks, pergolas, windows, doors, flooring and commercial construction in ${R}. ${business.insured}. ${business.license}.` },
  { path: "/our-work", title: `Our Work: Remodeling Projects in ${R}`, desc: `Kitchens, bathrooms, decks, pergolas, additions and whole-home remodels completed by ${business.shortName} in ${R}.` },
  { path: "/about", title: `About ${business.shortName}`, desc: `${business.name} is a fully insured ${R} contractor (${business.license}) for residential remodeling and commercial construction.` },
  { path: "/reviews", title: "Customer Reviews", desc: `Google reviews from ${R} homeowners who have worked with ${business.shortName}.` },
  { path: "/contact", title: `Contact & ${R} Service Area`, desc: `Call ${business.phone.display} or email ${business.email.display}. ${business.name} serves homeowners and businesses throughout ${R}, New Jersey.` },
  { path: "/request-estimate", title: "Request a Free Estimate", desc: `Tell ${business.shortName} about your ${R} remodeling or construction project. Add photos and get a free estimate.` },
  { path: "/privacy", title: "Privacy Policy", desc: `How ${business.name} handles information submitted through this website.` },
  ...services.map((s) => ({
    path: `/services/${s.slug}`, title: s.metaTitle, desc: s.metaDescription,
    ld: [
      { "@context": "https://schema.org", "@type": "Service", name: s.name, serviceType: s.name, description: s.metaDescription, url: `${base}/services/${s.slug}`, provider: { "@id": `${base}/#business` }, areaServed: { "@type": "AdministrativeArea", name: "South Jersey, New Jersey" } },
      { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [["Home", "/"], ["Services", "/services"], [s.name, `/services/${s.slug}`]].map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: base + p })) },
    ],
  })),
];

const esc = (t) => t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const tpl = readFileSync("dist/index.html", "utf8");

for (const p of pages) {
  const title = `${p.title} | ${business.shortName}`;
  let html = tpl
    .replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(p.desc)}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${base}${p.path}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(p.desc)}`)
    .replace("</head>", `<meta property="og:url" content="${base}${p.path}" />\n${(p.ld || []).map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, "\\u003c")}</script>`).join("\n")}\n</head>`);
  mkdirSync(`dist${p.path}`, { recursive: true });
  writeFileSync(`dist${p.path}/index.html`, html);
}

// Add social profiles to the business schema on the home page once they are filled in.
const sameAs = Object.values(business.social).filter(Boolean);
if (sameAs.length) writeFileSync("dist/index.html", tpl.replace('"slogan":', `"sameAs":${JSON.stringify(sameAs)},"slogan":`));

const today = new Date().toISOString().slice(0, 10);
writeFileSync("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ["/", ...pages.map((p) => p.path)].map((p) => `  <url><loc>${base}${p === "/" ? "" : p}</loc><lastmod>${today}</lastmod></url>`).join("\n") + "\n</urlset>\n");
console.log(`SEO: wrote ${pages.length} page heads + sitemap.xml`);
