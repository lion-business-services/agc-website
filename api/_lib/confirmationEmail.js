/**
 * Customer confirmation email: "We received your estimate request."
 * Shared by the Vercel function (api/confirm.js) and the website demo preview.
 * Only fixed wording plus a few validated, escaped fields are used, so the endpoint
 * cannot be abused to send arbitrary content.
 */
import { business } from "../../src/config/business.js";

const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const NAVY = "#0a2342", RED = "#d01c2e", GOLD = "#f5b921", TEXT = "#344054", SOFT = "#f4f6fa", LINE = "#e4e8ef";

function fmtDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/** d = { ticket, firstName, projectType, city, state, preferredContact, appointmentDate, appointmentTime, hasAlternative } */
export function buildConfirmationEmail(d, { logoUrl = `${business.url}/brand/agc-logo-email.png` } = {}) {
  const cfg = business.confirmationEmail;
  const name = esc(d.firstName || "there");
  const ticket = esc(d.ticket);
  const date = fmtDate(d.appointmentDate);
  const wantsAppt = Boolean(date || d.hasAlternative);
  const apptText = wantsAppt ? [date, d.appointmentTime].filter(Boolean).join(" · ") || "Alternative time provided" : "";
  const location = [d.city, d.state].filter(Boolean).map(esc).join(", ");
  const socials = [["Facebook", business.social.facebook], ["Instagram", business.social.instagram], ["Google", business.social.google]].filter(([, u]) => u);

  const subject = `We received your estimate request · Ticket ${d.ticket}`;
  const preheader = `Thank you, ${d.firstName || ""}. Your ticket number is ${d.ticket}. We will contact you ${cfg.responseTime}.`;

  const row = (k, v) => v ? `<tr><td style="padding:10px 0;border-bottom:1px solid ${LINE};color:#667085;font-size:14px;width:44%;vertical-align:top">${k}</td><td style="padding:10px 0;border-bottom:1px solid ${LINE};color:${NAVY};font-size:14px;font-weight:600;vertical-align:top">${v}</td></tr>` : "";
  const step = (n, t) => `<tr><td style="padding:6px 0;vertical-align:top;width:40px"><div style="width:28px;height:28px;border-radius:14px;background:${RED};color:#fff;font:700 14px/28px Arial,sans-serif;text-align:center">${n}</div></td><td style="padding:10px 0 6px;color:${TEXT};font-size:15px;line-height:1.5">${t}</td></tr>`;

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${SOFT};font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 28px rgba(10,35,66,.08)">
  <tr><td style="background:${NAVY};padding:26px 28px" align="center">
    <img src="${logoUrl}" width="150" alt="${esc(business.name)}" style="display:block;width:150px;max-width:150px;height:auto;border:0">
  </td></tr>
  <tr><td style="height:5px;background:${RED};line-height:5px;font-size:0">&nbsp;</td></tr>
  <tr><td style="padding:34px 32px 8px">
    <p style="margin:0 0 6px;color:${RED};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Request received</p>
    <h1 style="margin:0 0 16px;color:${NAVY};font-size:26px;line-height:1.25;font-weight:800">Thank you, ${name}. We have your estimate request.</h1>
    <p style="margin:0;color:${TEXT};font-size:16px;line-height:1.6">Thank you for choosing ${esc(business.name)}. We received your request and a member of our team will contact you <b style="color:${NAVY}">${esc(cfg.responseTime)}</b> to talk through your project${wantsAppt ? " and your requested appointment time" : ""}.</p>
  </td></tr>
  <tr><td style="padding:24px 32px 4px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT};border:1px dashed #b8c2d2;border-radius:14px"><tr><td align="center" style="padding:20px">
      <p style="margin:0 0 6px;color:#667085;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Your estimate ticket number</p>
      <p style="margin:0;color:${RED};font-size:28px;font-weight:800;letter-spacing:1px;font-family:'Courier New',Courier,monospace">${ticket}</p>
      <p style="margin:8px 0 0;color:#667085;font-size:13px">Please mention this number if you call or email us.</p>
    </td></tr></table>
  </td></tr>
  <tr><td style="padding:22px 32px 0">
    <p style="margin:0 0 4px;color:${NAVY};font-size:15px;font-weight:700">Request summary</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Project", esc(d.projectType))}${row("Location", location)}${row("Preferred contact", esc(d.preferredContact))}${row("Appointment requested", esc(apptText))}
    </table>
  </td></tr>
  ${wantsAppt ? `<tr><td style="padding:18px 32px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff8e6;border-left:4px solid ${GOLD};border-radius:10px"><tr><td style="padding:14px 16px;color:${NAVY};font-size:14px;line-height:1.5"><b>Your appointment time is a request and is not confirmed yet.</b> Once it is accepted you will receive a calendar invitation. If that time does not work, we will contact you to arrange another.</td></tr></table></td></tr>` : ""}
  <tr><td style="padding:24px 32px 0">
    <p style="margin:0 0 6px;color:${NAVY};font-size:15px;font-weight:700">What happens next</p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      ${step(1, `We review your project details${wantsAppt ? " and requested time" : ""}.`)}${step(2, `We contact you ${esc(cfg.responseTime)}${d.preferredContact ? ` by ${esc(d.preferredContact.toLowerCase())}` : ""}.`)}${step(3, "You receive a clear, free estimate.")}
    </table>
  </td></tr>
  <tr><td align="center" style="padding:28px 32px 8px">
    <p style="margin:0 0 14px;color:${TEXT};font-size:15px">Need to reach us sooner?</p>
    <a href="${business.phone.href}" style="display:inline-block;background:${RED};color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 28px;border-radius:999px">Call ${business.phone.display}</a>
    <p style="margin:14px 0 0;color:#667085;font-size:13px">Or simply reply to this email.</p>
  </td></tr>
  ${cfg.spanish ? `<tr><td style="padding:22px 32px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LINE}"><tr><td style="padding-top:18px;color:${TEXT};font-size:14px;line-height:1.6"><b style="color:${NAVY}">En español:</b> Gracias, ${name}. Recibimos su solicitud de presupuesto. Su número de caso es <b style="color:${RED}">${ticket}</b>. Nuestro equipo se comunicará con usted en 1 a 2 días hábiles.${wantsAppt ? " La cita solicitada aún no está confirmada; le enviaremos una invitación de calendario al confirmarla." : ""} ¿Preguntas? Llame al ${business.phone.display}.</td></tr></table></td></tr>` : ""}
  <tr><td style="padding:28px 32px 30px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LINE}"><tr><td style="padding-top:20px;color:#667085;font-size:12px;line-height:1.7" align="center">
      <b style="color:${NAVY};font-size:13px">${esc(business.name)}</b><br>
      ${esc(business.license)} · ${esc(business.insured)} · Proudly serving ${esc(business.region)}<br>
      <a href="${business.phone.href}" style="color:#667085;text-decoration:none">${business.phone.display}</a> · <a href="mailto:${business.leadEmail}" style="color:#667085;text-decoration:none">${business.leadEmail}</a> · <a href="${business.url}" style="color:#667085;text-decoration:none">${business.domain}</a><br>
      ${socials.map(([l, u]) => `<a href="${u}" style="color:${NAVY};font-weight:700;text-decoration:none">${l}</a>`).join(" &nbsp;·&nbsp; ")}
      <br><br><span style="color:#98a2b3">You are receiving this one-time message because an estimate was requested at ${business.domain}. If this was not you, reply and let us know.</span>
    </td></tr></table>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  const text = [
    `Thank you, ${d.firstName || "there"}. We have your estimate request.`,
    "",
    `Thank you for choosing ${business.name}. A member of our team will contact you ${cfg.responseTime}.`,
    "",
    `Your estimate ticket number: ${d.ticket}`,
    "Please mention this number if you call or email us.",
    "",
    `Project: ${d.projectType}`,
    location && `Location: ${[d.city, d.state].filter(Boolean).join(", ")}`,
    d.preferredContact && `Preferred contact: ${d.preferredContact}`,
    wantsAppt && `Appointment requested: ${apptText} (not confirmed yet; you will receive a calendar invitation once accepted)`,
    "",
    `Need us sooner? Call ${business.phone.display} or reply to this email.`,
    "",
    `${business.name} · ${business.license} · ${business.insured}`,
    business.url,
  ].filter((l) => l !== false && l !== undefined && l !== null).join("\n");

  return { subject, html, text };
}
