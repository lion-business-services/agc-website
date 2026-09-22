import { PREVIEW } from "./preview";

/**
 * Asks /api/confirm (Vercel function) to email the customer their confirmation + ticket number.
 * Resolves true only if the email was actually accepted for delivery, so the site never
 * claims an email was sent when it was not.
 */
export async function sendConfirmation(v, ticket) {
  const data = {
    ticket, email: v.email, firstName: v.firstName, projectType: v.projectType, city: v.city, state: v.state,
    preferredContact: v.preferredContact, appointmentDate: v.appointmentDate, appointmentTime: v.appointmentTime,
    hasAlternative: Boolean(v.alternativeAppointment), company_website: v.company_website,
  };
  if (PREVIEW) {
    const { buildConfirmationEmail } = await import("../../api/_lib/confirmationEmail.js");
    window.__agcLastEmail = buildConfirmationEmail(data, { logoUrl: window.__LOGO || "/brand/agc-logo-email.png" });
    return true;
  }
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 9000);
    const r = await fetch("/api/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: ctrl.signal, keepalive: true });
    clearTimeout(t);
    if (!r.ok) return false;
    const j = await r.json().catch(() => ({}));
    return j.sent === true;
  } catch { return false; }
}
