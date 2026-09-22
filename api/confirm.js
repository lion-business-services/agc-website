/**
 * Vercel serverless function: POST /api/confirm
 * Sends the customer their "we received your estimate request" email through Resend.
 * The business still receives every request through FormSubmit; this is only the customer's copy.
 *
 * Environment variables (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY   required. From resend.com → API Keys (restrict it to "Sending access").
 *   CONFIRM_FROM     optional. Overrides the sender, e.g. "American General Contractor <estimates@americanbuildnj.com>"
 * Until RESEND_API_KEY is set this returns { sent:false } and the site simply does not mention an email.
 */
import { buildConfirmationEmail } from "./_lib/confirmationEmail.js";
import { business } from "../src/config/business.js";

const PROJECT_TYPES = new Set(["Kitchen Remodeling", "Bathroom Remodeling", "Addition", "Deck", "Pergola / Outdoor Living", "Windows", "Exterior / Entry Doors", "Shower / Glass Door Installation", "Flooring", "General Remodeling", "Commercial", "Other"]);
const CONTACT = new Set(["Phone", "Text", "Email"]);
const WINDOWS = new Set(["Morning (8am – 12pm)", "Afternoon (12pm – 4pm)", "Evening (4pm – 7pm)", "Flexible", ""]);
const TICKET = /^AGC-\d{6}-[A-HJ-NP-Z2-9]{4}$/;
const EMAIL = /^[^\s@<>()[\],;:"]{1,64}@[^\s@<>()[\],;:"]{1,190}\.[a-z]{2,24}$/i;

// Best-effort abuse limits (per server instance): 5 per IP and 2 per recipient per hour.
const hits = new Map();
const tooMany = (key, max) => {
  const now = Date.now(), list = (hits.get(key) || []).filter((t) => now - t < 3600e3);
  list.push(now); hits.set(key, list); if (hits.size > 5000) hits.clear();
  return list.length > max;
};
const allowedOrigin = (o) => {
  if (!o) return true; // some browsers omit it on same-origin POSTs
  try {
    const h = new URL(o).hostname;
    return h === "localhost" || h.endsWith("americanbuildnj.com") || h.endsWith(".vercel.app") ||
      (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean).includes(h);
  } catch { return false; }
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ sent: false });
  if (!allowedOrigin(req.headers.origin)) return res.status(403).json({ sent: false });

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(200).json({ sent: false, reason: "not_configured" });

  const b = typeof req.body === "string" ? safeJson(req.body) : req.body || {};
  if (b.company_website) return res.status(200).json({ sent: true }); // honeypot: pretend success

  const d = {
    ticket: String(b.ticket || ""),
    email: String(b.email || "").trim().toLowerCase(),
    firstName: String(b.firstName || "").trim().slice(0, 40),
    projectType: String(b.projectType || ""),
    city: String(b.city || "").trim().slice(0, 60),
    state: String(b.state || "NJ").trim().toUpperCase().slice(0, 2),
    preferredContact: String(b.preferredContact || ""),
    appointmentDate: /^\d{4}-\d{2}-\d{2}$/.test(b.appointmentDate || "") ? b.appointmentDate : "",
    appointmentTime: String(b.appointmentTime || ""),
    hasAlternative: Boolean(b.hasAlternative),
  };
  if (!TICKET.test(d.ticket) || !EMAIL.test(d.email) || !PROJECT_TYPES.has(d.projectType) ||
      (d.preferredContact && !CONTACT.has(d.preferredContact)) || !WINDOWS.has(d.appointmentTime)) {
    return res.status(400).json({ sent: false, reason: "invalid" });
  }

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (tooMany(`ip:${ip}`, 5) || tooMany(`to:${d.email}`, 2)) return res.status(429).json({ sent: false, reason: "rate_limited" });

  const { subject, html, text } = buildConfirmationEmail(d);
  const cfg = business.confirmationEmail;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `confirm-${d.ticket}` },
      body: JSON.stringify({
        from: process.env.CONFIRM_FROM || cfg.from,
        to: [d.email],
        reply_to: cfg.replyTo,
        subject, html, text,
        tags: [{ name: "type", value: "estimate_confirmation" }],
      }),
    });
    if (!r.ok) { console.error("[confirm] resend", r.status, await r.text().catch(() => "")); return res.status(502).json({ sent: false }); }
    return res.status(200).json({ sent: true });
  } catch (e) {
    console.error("[confirm]", e);
    return res.status(502).json({ sent: false });
  }
}

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }
