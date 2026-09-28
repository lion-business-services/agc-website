import { PREVIEW } from "./preview";

/**
 * Asks /api/lead (Vercel function) to create the lead in the AGC Command Center,
 * with the same ticket number the customer and the business email get.
 * Never throws and never delays the customer: the email through FormSubmit is the safety net.
 */
export async function sendToCommandCenter(v, ticket, photoCount) {
  const data = {
    ticket, firstName: v.firstName, lastName: v.lastName, phone: v.phone, email: v.email, preferredContact: v.preferredContact,
    projectType: v.projectType, projectDescription: v.projectDescription, measurements: v.measurements, additionalDetails: v.additionalDetails,
    address: v.address, city: v.city, state: v.state, zip: v.zip, budgetRange: v.budgetRange, timeline: v.timeline,
    appointmentDate: v.appointmentDate, appointmentTime: v.appointmentTime, alternativeAppointment: v.alternativeAppointment, notes: v.notes,
    consent: Boolean(v.consent), photos: photoCount, page: typeof window !== "undefined" ? window.location.pathname : "", company_website: v.company_website,
  };
  if (PREVIEW) { window.__agcLastLead = data; return true; }
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: ctrl.signal, keepalive: true });
    clearTimeout(t);
    if (!r.ok) return false;
    const j = await r.json().catch(() => ({}));
    return j.saved === true;
  } catch { return false; }
}
