/** Finishes the one-file demo: embeds the logo once, and turns the script into a plain (non-module) script at the end of <body>. */
import { readFileSync, writeFileSync } from "node:fs";
let h = readFileSync("dist-preview/index.html", "utf8");
const logo = "data:image/webp;base64," + readFileSync("public/brand/agc-logo.webp").toString("base64");
h = h.replace(/<link rel="(icon|apple-touch-icon|preload|canonical)"[^>]*>\s*/g, "");
const m = h.match(/<script type="module"[^>]*>([\s\S]*?)<\/script>/);
if (!m) throw new Error("bundle script not found");
const js = m[1].split("`/brand/agc-logo.webp`").join("window.__LOGO").split('"/brand/agc-logo.webp"').join("window.__LOGO").replace(/<\/script/g, "<\\/script");
h = h.replace(m[0], () => "");
const fallback = '<p style="font:16px system-ui;padding:40px;text-align:center;color:#475467">Loading the American General Contractor demo…<br><br>If this message stays, this viewer is blocking the demo. Open the file in Chrome, Edge or Safari on a computer, or use the demo link instead.</p>';
h = h.replace('<div id="root"></div>', () => `<div id="root">${fallback}</div>\n<script>window.__LOGO=${JSON.stringify(logo)};</script>\n<script>${js}</script>`);
writeFileSync("dist-preview/agc-full-site-demo.html", h);
console.log("Demo written: dist-preview/agc-full-site-demo.html", Math.round(h.length / 1024) + " KB");
