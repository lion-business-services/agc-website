import { business } from "../config/business";
import { PREVIEW } from "./preview";

/**
 * Estimate ticket number, e.g. AGC-260921-K7M2 (AGC-YYMMDD-4 random characters).
 * Stamped on the subject, the email body, the on-site confirmation and the calendar event.
 */
export function makeTicket(prefix = "AGC") {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid misreading
  const rnd = crypto.getRandomValues(new Uint8Array(4));
  return `${prefix}-${ymd}-${[...rnd].map((n) => alphabet[n % alphabet.length]).join("")}`;
}

/**
 * Sends the submission to FormSubmit WITHOUT leaving the page.
 * A classic multipart POST (so photo attachments always arrive) is targeted at an invisible iframe.
 * FormSubmit's own "Thanks" page renders inside that hidden frame where nobody sees it, and the
 * website shows its own confirmation. Resolves when FormSubmit has answered (or after a timeout).
 */
export function postToFormSubmit({ ticket, subject, replyTo, rows, photos = [], honey = "" }) {
  const payload = { ticket, subject, to: business.leadEmail, cc: business.leadCc, rows: rows.filter(([, v]) => v), photos: photos.length };
  if (PREVIEW) { window.__agcLastSubmission = payload; return new Promise((res) => setTimeout(() => res(payload), 900)); }

  return new Promise((resolve) => {
    const frameName = `agc_fs_${Date.now()}`;
    const frame = document.createElement("iframe");
    frame.name = frameName; frame.setAttribute("aria-hidden", "true"); frame.tabIndex = -1;
    frame.style.cssText = "position:absolute;width:0;height:0;border:0;opacity:0;pointer-events:none";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `https://formsubmit.co/${business.leadEmail}`;
    form.enctype = "multipart/form-data";
    form.target = frameName;
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
    add("_honey", honey);
    add("_next", `${window.location.origin}/thank-you${ticket ? `?ref=${encodeURIComponent(ticket)}` : ""}`); // only matters if the iframe is ever visible
    rows.forEach(([k, v]) => add(k, v));
    photos.forEach(({ file, label }) => {
      const input = document.createElement("input");
      input.type = "file"; input.name = label;
      const dt = new DataTransfer(); dt.items.add(file); input.files = dt.files;
      form.appendChild(input);
    });

    let done = false;
    const finish = () => { if (done) return; done = true; resolve(payload); setTimeout(() => { frame.remove(); form.remove(); }, 1500); };
    let loads = 0;
    frame.addEventListener("load", () => { loads += 1; if (loads >= 1) setTimeout(finish, 300); }); // FormSubmit responds → done
    setTimeout(finish, 12000); // safety net: never leave the customer waiting
    document.body.append(frame, form);
    form.submit();
  });
}
