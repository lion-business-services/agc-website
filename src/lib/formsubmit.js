import { business } from "../config/business";
import { PREVIEW } from "./preview";

/** Posts a list of [label, value] rows (+ optional photos) to FormSubmit as a normal multipart form. */
export function postToFormSubmit({ subject, replyTo, rows, photos = [], honey = "", autoresponse = "" }) {
  if (PREVIEW) { // demo: show what WOULD be emailed, send nothing
    sessionStorageSafe({ autoresponse, subject, to: business.leadEmail, cc: business.leadCc, rows: rows.filter(([, v]) => v), photos: photos.length });
    document.querySelector("dialog.est[open]")?.close();
    window.__agcNavigate?.("/thank-you");
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
  add("_next", `${window.location.origin}/thank-you`);
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
