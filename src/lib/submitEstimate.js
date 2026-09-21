import { business } from "../config/business";
import { postToFormSubmit } from "./formsubmit";
import { calendarLink } from "./calendarLink";

export function submitEstimate(v, photos) {
  const wantsAppt = Boolean(v.appointmentDate || v.alternativeAppointment);
  const link = calendarLink(v);
  return postToFormSubmit({
    subject: `New estimate request${wantsAppt ? " + APPOINTMENT REQUEST" : ""}: ${v.projectType} — ${v.firstName} ${v.lastName} (${v.city})`,
    replyTo: v.email, honey: v.company_website,
    autoresponse: `Thank you for contacting ${business.name}. We received your estimate request for ${v.projectType}.${wantsAppt ? " Your requested appointment time is NOT confirmed yet. We will review it and send you a calendar invitation or contact you to confirm." : " A member of our team will contact you about the next step."} Questions? Call ${business.phone.display}.`,
    rows: [
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
