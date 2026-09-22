import { business } from "../config/business";
import { PREVIEW } from "./preview";

/**
 * Estimate ticket number, e.g. AGC-260921-K7M2 (AGC-YYMMDD-4 random characters).
 * Generated in the browser and stamped on the subject, the email body, the customer's auto-reply
 * and the thank-you page, so every case can be found by one reference.
 */
export function makeTicket(prefix = "AGC") {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid misreading
  const rnd = crypto.getRandomValues(new Uint8Array(4));
  return `${prefix}-${ymd}-${[...rnd].map((n) => alphabet[n % alphabet.length]).join("")}`;
}

/** Posts a list of [label, value] rows (+ optional photos) to FormSubmit as a normal multipart form. */
export function postToFormSubmit({ ticket, subject, replyTo, rows, photos = [], honey = "", autoresponse = "" }) {
  if (PREVIEW) { // demo: show what WOULD be emailed, send nothing
    sessionStorageSafe({ ticket, autoresponse, subject, to: business.leadEmail, cc: business.leadCc, rows: rows.filter(([, v]) => v), photos: photos.length });
    document.querySelector("dialog.est[open]")?.close();
    window.__agcNavigate?.(`/thank-you?ref=${encodeURIComponent(ticket || "")}`);
    return true;
  }
  const form = document.createElement("form");
  form.method = "POST";
  form.action = `https://formsubmit.co/${business.leadEmail}`;
  form.enctype = "multipart/form-data";
  form.style.display = "none";
  const add = (name, value) => {
    if (value === "" || value == null) return;
    const i = document.createElement("input");
    i.type = "hidden"; i.name = name; i.value = value;
    form.appendChild(i);
  };
  add("_subject", subject);
  add("_cc", business.leadCc);
  add("_replyto", replyTo);
  add("_template", "table");
  add("_captcha", "false");
  add("_next", `${window.location.origin}/thank-you${ticket ? `?ref=${encodeURIComponent(ticket)}` : ""}`);
  add("_honey", honey);
  add("_autoresponse", autoresponse); // automatic reply to the customer (uses the "email" field)
  rows.forEach(([k, v]) => add(k, v));
  photos.forEach(({ file, label }) => {
    const input = document.createElement("input");
    input.type = "file"; input.name = label;
    const dt = new DataTransfer(); dt.items.add(file); input.files = dt.files;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}

function sessionStorageSafe(data) { window.__agcLastSubmission = data; }
