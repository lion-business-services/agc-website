/** Finishes the one-file demo: embeds the logo, owner and service photos, and turns the script into a plain (non-module) script. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
let h = readFileSync("dist-preview/index.html", "utf8");
const b64 = (p, mime) => `data:${mime};base64,${readFileSync(p).toString("base64")}`;
const logo = b64("public/brand/agc-logo.webp", "image/webp");
h = h.replace(/<link rel="(icon|apple-touch-icon|preload|canonical)"[^>]*>\s*/g, "");
const m = h.match(/<script type="module"[^>]*>([\s\S]*?)<\/script>/);
if (!m) throw new Error("bundle script not found");
let js = m[1].split("`/brand/agc-logo.webp`").join("window.__LOGO").split('"/brand/agc-logo.webp"').join("window.__LOGO");
// service photos: rewrite runtime paths to a lookup table
js = js.replace(/`\/services\/\$\{(\w+)\}-(hero|card|thumb)\.webp`/g, (_, v, k) => `(window.__IMG[${v}+"-${k}"]||"")`);
js = js.split('"/team/daniel-bettran.jpg"').join("window.__OWNER").replace(/<\/script/g, "<\\/script");
const imgs = {};
for (const key of ["kitchen","bathroom","addition","deck","pergola","windows","flooring","remodel","commercial"]) for (const k of ["hero","card","thumb"]) {
  const f = `public/services/${key}-${k}.webp`; if (existsSync(f)) imgs[`${key}-${k}`] = b64(f, "image/webp");
}
h = h.replace(m[0], () => "");
const fallback = '<p style="font:16px system-ui;padding:40px;text-align:center;color:#475467">Loading the American General Contractor demo…<br><br>If this message stays, this viewer is blocking the demo. Open the file in Chrome, Edge or Safari on a computer, or use the demo link instead.</p>';
h = h.replace('<div id="root"></div>', () => `<div id="root">${fallback}</div>\n<script>window.__LOGO=${JSON.stringify(logo)};window.__OWNER=${JSON.stringify(b64("public/team/daniel-bettran.jpg", "image/jpeg"))};window.__IMG=${JSON.stringify(imgs)};</script>\n<script>${js}</script>`);
writeFileSync("dist-preview/agc-full-site-demo.html", h);
console.log("Demo written:", Math.round(h.length / 1024) + " KB");
