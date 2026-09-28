/**
 * Vercel serverless function: POST /api/lead
 * Sends every estimate request to the AGC Command Center, where it becomes a lead
 * (same ticket number as the email and the customer's confirmation).
 * The business email still goes through FormSubmit and the customer email through /api/confirm;
 * this runs at the same moment and never blocks or changes them.
 *
 * Environment variables (Vercel → Settings → Environment Variables):
 *   INTAKE_SECRET        required. The same value as INTAKE_SECRET in the Command Center (Netlify).
 *   COMMAND_CENTER_URL   optional. Defaults to https://agc-cpm.netlify.app
 * Until INTAKE_SECRET is set this returns { saved:false } and nothing else changes.
 */
const TICKET = /^AGC-\d{6}-[A-HJ-NP-Z2-9]{4}$/;
const EMAIL = /^[^\s@<>()[\],;:"]{1,64}@[^\s@<>()[\],;:"]{1,190}\.[a-z]{2,24}$/i;
const FIELDS = ["firstName", "lastName", "phone", "email", "preferredContact", "projectType", "projectDescription", "measurements", "additionalDetails",
  "address", "city", "state", "zip", "budgetRange", "timeline", "appointmentDate", "appointmentTime", "alternativeAppointment", "notes"];

// Best-effort abuse limit (per server instance): 5 requests per IP per hour.
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
  if (req.method !== "POST") return res.status(405).json({ saved: false });
  if (!allowedOrigin(req.headers.origin)) return res.status(403).json({ saved: false });
  const secret = process.env.INTAKE_SECRET;
  if (!secret) return res.status(200).json({ saved: false, reason: "not_configured" });

  const b = typeof req.body === "string" ? safeJson(req.body) : req.body || {};
  if (b.company_website) return res.status(200).json({ saved: true }); // honeypot: pretend success
  if (!TICKET.test(String(b.ticket || "")) || !String(b.firstName || "").trim() ||
      (!String(b.phone || "").replace(/\D/g, "") && !EMAIL.test(String(b.email || "").trim()))) {
    return res.status(400).json({ saved: false, reason: "invalid" });
  }
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (tooMany(`ip:${ip}`, 5)) return res.status(429).json({ saved: false, reason: "rate_limited" });

  const lead = { ticket: b.ticket, consent: b.consent ? "yes" : "no", photos: String(Math.max(0, Math.min(99, parseInt(b.photos, 10) || 0))), page: String(b.page || "").slice(0, 120), already_emailed: "yes" };
  for (const k of FIELDS) if (b[k] != null && String(b[k]).trim()) lead[k] = String(b[k]).slice(0, k === "projectDescription" || k === "additionalDetails" || k === "measurements" || k === "notes" ? 3000 : 200);

  const base = (process.env.COMMAND_CENTER_URL || "https://agc-cpm.netlify.app").replace(/\/+$/, "");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(`${base}/api/intake`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-agc-intake": secret },
      body: JSON.stringify(lead),
      signal: ctrl.signal,
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) { console.error("[lead] command center", r.status, j.error || ""); return res.status(502).json({ saved: false }); }
    return res.status(200).json({ saved: true, ticket: j.ticket });
  } catch (e) {
    console.error("[lead]", e.name === "AbortError" ? "timeout" : e);
    return res.status(502).json({ saved: false });
  } finally { clearTimeout(timer); }
}

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }
