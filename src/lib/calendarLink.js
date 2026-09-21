/**
 * One-click link for Daniel: opens Google Calendar with the visit pre-filled and the customer added as a guest.
 * When he clicks Save → "Send invitation", Google emails the customer the invite. THAT is the confirmation.
 */
const windowStart = { "Morning (8am – 12pm)": 9, "Afternoon (12pm – 4pm)": 13, "Evening (4pm – 7pm)": 17, Flexible: 10 };

export function calendarLink(v) {
  if (!v.appointmentDate) return "";
  const day = v.appointmentDate.replace(/-/g, "");
  const h = windowStart[v.appointmentTime] ?? 10;
  const t = (n) => `${day}T${String(n).padStart(2, "0")}0000`;
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `Estimate visit: ${v.firstName} ${v.lastName} (${v.projectType})`,
    dates: `${t(h)}/${t(h + 1)}`,
    ctz: "America/New_York",
    location: `${v.address}, ${v.city}, ${v.state} ${v.zip}`,
    details: `Customer: ${v.firstName} ${v.lastName}\nPhone: ${v.phone}\nEmail: ${v.email}\nPrefers: ${v.preferredContact}\nProject: ${v.projectType}\nRequested window: ${v.appointmentTime || "not specified"}${v.alternativeAppointment ? `\nAlso works: ${v.alternativeAppointment}` : ""}\n\n${v.projectDescription}`,
    add: v.email,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}
