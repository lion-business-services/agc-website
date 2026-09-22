import { business } from "../config/business";
import { postToFormSubmit, makeTicket } from "./formsubmit";
import { calendarLink } from "./calendarLink";

export function submitEstimate(v, photos) {
  const wantsAppt = Boolean(v.appointmentDate || v.alternativeAppointment);
  const ticket = makeTicket();
  const link = calendarLink({ ...v, projectType: `${v.projectType} · ${ticket}` });
  return postToFormSubmit({
    ticket,
    subject: `[${ticket}] Estimate request${wantsAppt ? " + APPOINTMENT" : ""}: ${v.projectType} — ${v.firstName} ${v.lastName} (${v.city})`,
    replyTo: v.email, honey: v.company_website,
    rows: [
      ["TICKET NUMBER", ticket],
      ["Customer", `${v.firstName} ${v.lastName}`], ["Phone", v.phone], ["email", v.email], ["Preferred contact", v.preferredContact],
      ["Project type", v.projectType], ["Project description", v.projectDescription], ["Measurements", v.measurements],
      ["Additional details", v.additionalDetails], ["Project address", `${v.address}, ${v.city}, ${v.state} ${v.zip}`],
      ["Budget range", v.budgetRange], ["Timeline", v.timeline],
      ["Appointment request", wantsAppt ? ([v.appointmentDate, v.appointmentTime].filter(Boolean).join(" · ") || "See alternative") + "  (NOT CONFIRMED until you accept)" : "None requested"],
      ["Alternative date/time", v.alternativeAppointment], ["Notes", v.notes],
      ["Photos attached", String(photos.length)], ["Consent to contact", "Yes"],
      ["TO ACCEPT THE APPOINTMENT", link ? "Click the Google Calendar link below, set the exact time, then Save and choose Send invitation. The customer gets the invite as their confirmation. To decline or change it, just reply to this email." : ""],
      ["ACCEPT: add to Google Calendar", link],
    ],
    photos: photos.map(({ file, kind }, n) => ({ file, label: `${kind === "current" ? "Current photo" : "Inspiration photo"} ${n + 1}` })),
  });
}
