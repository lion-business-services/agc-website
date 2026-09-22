import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Camera, CheckCircle2, Copy, Check, Mail as MailIcon, X, Sparkles, Loader2, Phone, MessageSquare, Mail, CookingPot, Bath, HousePlus, Fence, Tent,
  AppWindow, DoorOpen, ShowerHead, Grid2x2, PaintRoller, Building2, CircleEllipsis,
} from "lucide-react";
import { projectTypes, budgetRanges, timelines, contactMethods, timeWindows, uploadRules } from "../config/estimate";
import { business } from "../config/business";
import { compressImage } from "../lib/compress";
import { submitEstimate } from "../lib/submitEstimate";
import { track } from "../lib/analytics";
import { PREVIEW } from "../lib/preview";

const STEPS = ["Project type", "Project details", "Location", "Budget and timeline", "Photos", "Your contact info", "Appointment request", "Review and send"];
const LAST = STEPS.length - 1;
const typeIcons = [CookingPot, Bath, HousePlus, Fence, Tent, AppWindow, DoorOpen, ShowerHead, Grid2x2, PaintRoller, Building2, CircleEllipsis];
const methodIcons = [Phone, MessageSquare, Mail];

const blank = {
  projectType: "", projectDescription: "", measurements: "", additionalDetails: "",
  address: "", city: "", state: "NJ", zip: "", budgetRange: "", timeline: "",
  firstName: "", lastName: "", phone: "", email: "", preferredContact: "",
  appointmentDate: "", appointmentTime: "", alternativeAppointment: "", notes: "",
  consent: false, company_website: "",
};

function validate(step, v) {
  const e = {};
  if (step === 0 && !v.projectType) e.projectType = "Choose a project type";
  if (step === 1 && v.projectDescription.trim().length < 10) e.projectDescription = "Tell us a little about the project (at least 10 characters)";
  if (step === 2) {
    if (v.address.trim().length < 3) e.address = "Enter the project address";
    if (v.city.trim().length < 2) e.city = "Enter the city";
    if (v.state.trim().length !== 2) e.state = "2 letters";
    if (!/^\d{5}(-\d{4})?$/.test(v.zip.trim())) e.zip = "Enter a valid ZIP code";
  }
  if (step === 3) {
    if (!v.budgetRange) e.budgetRange = "Choose a budget range";
    if (!v.timeline) e.timeline = "Choose a timeframe";
  }
  if (step === 5) {
    if (!v.firstName.trim()) e.firstName = "Enter your first name";
    if (!v.lastName.trim()) e.lastName = "Enter your last name";
    if (v.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number";
    if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "Enter a valid email address";
    if (!v.preferredContact) e.preferredContact = "Choose how you'd like to be contacted";
  }
  if (step === 7 && !v.consent) e.consent = "Please confirm we may contact you about your request";
  return e;
}

/** Demo only: shows the customer confirmation email exactly as it will look in an inbox. */
function EmailPreview({ onClose }) {
  const e = window.__agcLastEmail;
  return (
    <div className="email-preview" role="dialog" aria-modal="true" aria-label="Confirmation email preview">
      <div className="email-preview-bar"><span><b>Subject:</b> {e.subject}</span><button type="button" className="est-x" aria-label="Close preview" onClick={onClose}><X className="icon" aria-hidden /></button></div>
      <iframe title="Confirmation email" srcDoc={e.html} />
    </div>
  );
}

function Err({ msg }) {
  return msg ? <p className="err" role="alert" style={{ display: "block" }}>{msg}</p> : null;
}

function Options({ name, options, value, onChange, icons, three }) {
  return (
    <div className={`opts${three ? " three" : ""}`}>
      {options.map((o, n) => {
        const I = icons?.[n];
        return (
          <label className="opt" key={o}>
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} />
            {I && <I className="icon" aria-hidden />}<span>{o}</span>
          </label>
        );
      })}
    </div>
  );
}

function Field({ id, label, optional, error, children }) {
  return (
    <div className={`f${error ? " bad" : ""}`}>
      <label htmlFor={id}>{label} {optional && <em>({optional})</em>}</label>
      {children}
      {error && <p className="err" role="alert" style={{ display: "block" }}>{error}</p>}
    </div>
  );
}

function Uploader({ label, hint, Icon, items, onAdd, onRemove, busy }) {
  return (
    <div>
      <p className="flabel">{label}</p>
      <label className="drop">
        {busy ? <Loader2 className="icon spin" aria-hidden /> : <Icon className="icon" aria-hidden />}
        {busy ? "Preparing photos…" : hint}
        <small>Up to {uploadRules.maxFilesPerGroup} photos · {items.length}/{uploadRules.maxFilesPerGroup} added</small>
        <input type="file" accept={uploadRules.acceptAttr} multiple disabled={busy} onChange={(e) => { onAdd(e.target.files); e.target.value = ""; }} />
      </label>
      {items.length > 0 && (
        <div className="thumbs">
          {items.map((p, n) => (
            <div key={p.url}>
              <img src={p.url} alt={p.file.name} />
              <button type="button" aria-label={`Remove ${p.file.name}`} onClick={() => onRemove(n)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EstimateForm({ initialType = "" }) {
  const [v, setV] = useState({ ...blank, projectType: projectTypes.includes(initialType) ? initialType : "" });
  const [step, setStep] = useState(initialType && projectTypes.includes(initialType) ? 1 : 0);
  const [errors, setErrors] = useState({});
  const [current, setCurrent] = useState([]);
  const [inspiration, setInspiration] = useState([]);
  const [busy, setBusy] = useState("");
  const [fileMsg, setFileMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(null); // { ticket, appt } after a successful send
  const [copied, setCopied] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const heading = useRef(null);
  const body = useRef(null);
  const started = useRef(false);

  useEffect(() => { heading.current?.focus({ preventScroll: true }); if (body.current) body.current.scrollTop = 0; }, [step]);

  const set = (k, val) => {
    if (!started.current) { started.current = true; track("estimate_started"); }
    setV((p) => ({ ...p, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const input = (k, props = {}) => ({ id: k, value: v[k], onChange: (e) => set(k, e.target.value), "aria-invalid": Boolean(errors[k]), ...props });

  async function addPhotos(kind, list) {
    const [items, setItems] = kind === "current" ? [current, setCurrent] : [inspiration, setInspiration];
    const msgs = []; const next = [...items];
    setBusy(kind);
    for (const f of Array.from(list || [])) {
      if (next.length >= uploadRules.maxFilesPerGroup) { msgs.push(`Limit is ${uploadRules.maxFilesPerGroup} photos here.`); break; }
      if (!f.type.startsWith("image/")) { msgs.push(`${f.name} is not an image.`); continue; }
      try {
        const small = await compressImage(f);
        next.push({ file: small, url: URL.createObjectURL(small) });
      } catch { msgs.push(`${f.name} could not be read. Try a JPG or PNG.`); }
    }
    const other = kind === "current" ? inspiration : current;
    let total = [...next, ...other].reduce((s, p) => s + p.file.size, 0);
    while (total > uploadRules.maxTotalBytes && next.length > items.length) {
      total -= next.pop().file.size;
      msgs.push("That is the most photos one request can carry. You can send more later by email.");
    }
    setItems(next); setFileMsg([...new Set(msgs)].join(" ")); setBusy("");
  }
  const removePhoto = (kind, n) => (kind === "current" ? setCurrent : setInspiration)((l) => l.filter((_, i) => i !== n));

  function next() {
    const e = validate(step, v);
    setErrors(e);
    if (Object.keys(e).length) { requestAnimationFrame(() => body.current?.querySelector('[aria-invalid="true"]')?.focus()); return; }
    if (step < LAST) { track("estimate_step_completed", { step: step + 1 }); setStep(step + 1); return; }
    setSending(true);
    track("estimate_submitted", { project_type: v.projectType });
    submitEstimate(v, [...current.map((p) => ({ file: p.file, kind: "current" })), ...inspiration.map((p) => ({ file: p.file, kind: "inspiration" }))])
      .then((res) => { setDone({ ticket: res.ticket, emailed: res.emailed, appt: Boolean(v.appointmentDate || v.alternativeAppointment), name: v.firstName, email: v.email }); setSending(false); });
  }

  if (done) {
    const copy = () => navigator.clipboard?.writeText(done.ticket).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    return (
      <div className="est-body success" role="status" aria-live="polite">
        <div className="ok"><CheckCircle2 className="icon" aria-hidden /></div>
        <h3 tabIndex={-1} ref={heading}>Thank you{done.name ? `, ${done.name}` : ""}. Your request is in.</h3>
        <p className="sub">A member of the {business.shortName} team will review your project and contact you regarding the next step{done.appt ? ", including your requested appointment time" : ""}.</p>
        <div className="ticket"><small>Your estimate ticket number</small><b>{done.ticket}</b>
          <button type="button" className="btn btn-ghost" onClick={copy} style={{ minHeight: 44, padding: "0 18px", fontSize: ".92rem" }}>{copied ? <><Check className="icon" aria-hidden />Copied</> : <><Copy className="icon" aria-hidden />Copy number</>}</button>
          <span>Save this number and mention it if you call or email us about your project.</span></div>
        {done.emailed && <p className="emailed"><MailIcon className="icon" aria-hidden /><span>A confirmation with your ticket number is on its way to <b>{done.email}</b>.
          {PREVIEW && window.__agcLastEmail && <> <button type="button" className="linkbtn" onClick={() => setShowEmail(true)}>Preview the email</button></>}</span></p>}
        {showEmail && <EmailPreview onClose={() => setShowEmail(false)} />}
        {done.appt && <p className="note" style={{ marginTop: 20 }}>Your appointment time is a request, not yet confirmed. We will send a calendar invitation once it is accepted, or contact you to arrange another time.</p>}
        <ul className="next-steps">
          <li><b>1</b><span>We review your details{done.appt ? " and requested time" : ""}.</span></li>
          <li><b>2</b><span>We contact you by your preferred method to talk through the project.</span></li>
          <li><b>3</b><span>You receive a clear, free estimate.</span></li>
        </ul>
        <p style={{ textAlign: "center", marginTop: 26 }}>Need us sooner? Call <a href={business.phone.href} style={{ font: "800 1.25rem var(--display)", color: "var(--ink)" }}>{business.phone.display}</a></p>
        <div className="cta-row" style={{ justifyContent: "center", marginTop: 22 }}><Link className="btn btn-ghost" to="/" onClick={() => document.querySelector("dialog.est[open]")?.close()}>Back to home</Link></div>
      </div>
    );
  }

  const noPhotos = !current.length && !inspiration.length;
  const noAppt = !v.appointmentDate && !v.alternativeAppointment;
  const nextLabel = step === LAST ? "Send My Estimate Request" : step === 4 && noPhotos ? "Skip photos" : step === 6 && noAppt ? "Skip appointment" : "Continue";
  const review = [
    ["Project type", v.projectType, 0],
    ["Project details", v.projectDescription + (v.measurements ? `\nMeasurements: ${v.measurements}` : ""), 1],
    ["Location", `${v.address}, ${v.city}, ${v.state} ${v.zip}`, 2],
    ["Budget and timeline", `${v.budgetRange} · ${v.timeline}`, 3],
    ["Photos", `${current.length} current · ${inspiration.length} inspiration`, 4],
    ["Contact", `${v.firstName} ${v.lastName} · ${v.phone} · ${v.email} · Prefers ${v.preferredContact.toLowerCase()}`, 5],
    ["Appointment request", noAppt ? "No appointment requested" : [v.appointmentDate, v.appointmentTime].filter(Boolean).join(" · ") + (v.alternativeAppointment ? `\nAlternative: ${v.alternativeAppointment}` : ""), 6],
  ];

  return (
    <>
      <div className="est-prog">
        <p><b>Step {step + 1} of {STEPS.length}</b><span>{STEPS[step]}</span></p>
        <div className="bars" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label={`Step ${step + 1} of ${STEPS.length}`}>
          {STEPS.map((s, n) => <i key={s} className={n <= step ? "on" : ""} />)}
        </div>
      </div>

      <form className="est-body" ref={body} noValidate onSubmit={(e) => { e.preventDefault(); next(); }}>
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={v.company_website} onChange={(e) => set("company_website", e.target.value)} style={{ position: "absolute", left: -9999 }} />

        {step === 0 && <div className="step on"><h3 tabIndex={-1} ref={heading}>What kind of project is it?</h3><p className="sub">Pick the closest match. You can explain more next.</p>
          <Options name="projectType" options={projectTypes} icons={typeIcons} value={v.projectType} onChange={(o) => set("projectType", o)} /><Err msg={errors.projectType} /></div>}

        {step === 1 && <div className="step on"><h3 tabIndex={-1} ref={heading}>Tell us about the project</h3><p className="sub">A few sentences is plenty.</p>
          <div className="fgrid">
            <Field id="projectDescription" label="Project description" error={errors.projectDescription}><textarea {...input("projectDescription")} placeholder="What would you like done? What is there now?" /></Field>
            <Field id="measurements" label="Approximate measurements" optional="if known"><input {...input("measurements")} placeholder="Example: 12 ft × 16 ft" /></Field>
            <Field id="additionalDetails" label="Anything else we should know?" optional="optional"><textarea {...input("additionalDetails")} style={{ minHeight: 90 }} /></Field>
          </div></div>}

        {step === 2 && <div className="step on"><h3 tabIndex={-1} ref={heading}>Where is the project?</h3><p className="sub">So we can confirm it is in our service area.</p>
          <div className="fgrid addr">
            <div style={{ gridColumn: "1/-1" }}><Field id="address" label="Project address" error={errors.address}><input {...input("address", { autoComplete: "street-address" })} /></Field></div>
            <Field id="city" label="City" error={errors.city}><input {...input("city", { autoComplete: "address-level2" })} /></Field>
            <Field id="state" label="State" error={errors.state}><input {...input("state", { maxLength: 2, style: { textTransform: "uppercase" } })} /></Field>
            <Field id="zip" label="ZIP code" error={errors.zip}><input {...input("zip", { inputMode: "numeric", maxLength: 10, autoComplete: "postal-code" })} /></Field>
          </div></div>}

        {step === 3 && <div className="step on"><h3 tabIndex={-1} ref={heading}>Budget and timing</h3><p className="sub">Planning ranges only. These are not prices.</p>
          <p className="flabel">Budget range</p><Options name="budgetRange" options={budgetRanges} value={v.budgetRange} onChange={(o) => set("budgetRange", o)} /><Err msg={errors.budgetRange} />
          <p className="flabel" style={{ marginTop: 22 }}>When would you like it done?</p><Options name="timeline" options={timelines} value={v.timeline} onChange={(o) => set("timeline", o)} /><Err msg={errors.timeline} /></div>}

        {step === 4 && <div className="step on"><h3 tabIndex={-1} ref={heading}>Add photos</h3><p className="sub">Optional, but photos help us understand the project before we talk.</p>
          <Uploader label="Photos of the current space" hint="Take or choose photos" Icon={Camera} items={current} busy={busy === "current"} onAdd={(l) => addPhotos("current", l)} onRemove={(n) => removePhoto("current", n)} />
          <div style={{ height: 22 }} />
          <Uploader label="Inspiration or reference photos" hint="Add styles or finishes you like" Icon={Sparkles} items={inspiration} busy={busy === "inspiration"} onAdd={(l) => addPhotos("inspiration", l)} onRemove={(n) => removePhoto("inspiration", n)} />
          {fileMsg && <p className="err" role="alert" style={{ display: "block" }}>{fileMsg}</p>}</div>}

        {step === 5 && <div className="step on"><h3 tabIndex={-1} ref={heading}>How can we reach you?</h3><p className="sub">We only use this to respond to your request.</p>
          <div className="fgrid two">
            <Field id="firstName" label="First name" error={errors.firstName}><input {...input("firstName", { autoComplete: "given-name" })} /></Field>
            <Field id="lastName" label="Last name" error={errors.lastName}><input {...input("lastName", { autoComplete: "family-name" })} /></Field>
            <Field id="phone" label="Phone" error={errors.phone}><input {...input("phone", { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "609-555-0100" })} /></Field>
            <Field id="email" label="Email" error={errors.email}><input {...input("email", { type: "email", inputMode: "email", autoComplete: "email", autoCapitalize: "none" })} /></Field>
          </div>
          <p className="flabel" style={{ marginTop: 20 }}>Preferred contact method</p>
          <Options three name="preferredContact" options={contactMethods} icons={methodIcons} value={v.preferredContact} onChange={(o) => set("preferredContact", o)} /><Err msg={errors.preferredContact} /></div>}

        {step === 6 && <div className="step on"><h3 tabIndex={-1} ref={heading}>Request an appointment</h3><p className="sub">Optional. Pick the day and time you prefer for your free estimate visit, or skip this and we will call to schedule.</p>
          <p className="note"><b>This is a request, not a confirmed appointment.</b> Appointment requests are subject to availability and service location. A member of the American General Contractor team will contact you to confirm your appointment.</p>
          <div className="fgrid">
            <div style={{ maxWidth: 280 }}><Field id="appointmentDate" label="Preferred date"><input {...input("appointmentDate", { type: "date", min: new Date().toISOString().slice(0, 10) })} /></Field></div>
            <div><p className="flabel">Preferred time window</p><Options name="appointmentTime" options={timeWindows} value={v.appointmentTime} onChange={(o) => set("appointmentTime", o)} /></div>
            <Field id="alternativeAppointment" label="Alternative date and time"><input {...input("alternativeAppointment")} placeholder="Example: any weekday after 3pm" /></Field>
            <Field id="notes" label="Additional notes" optional="optional"><textarea {...input("notes")} style={{ minHeight: 90 }} /></Field>
          </div></div>}

        {step === 7 && <div className="step on"><h3 tabIndex={-1} ref={heading}>Review your request</h3><p className="sub">Make sure everything looks right.</p>
          <div className="rev">{review.map(([k, t, s]) => (
            <div key={k}><div><b>{k}</b><span>{t}</span></div><button type="button" aria-label={`Edit ${k}`} onClick={() => setStep(s)}>Edit</button></div>
          ))}</div>
          <label className="consent"><input type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={Boolean(errors.consent)} />
            <span>I agree that {business.name} may contact me by phone, text or email about this request, as described in the <a href="/privacy" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>privacy policy</a>.</span></label>
          <Err msg={errors.consent} /></div>}
      </form>

      <div className="est-foot">
        <button type="button" className="btn btn-ghost" id="back" style={{ visibility: step ? "visible" : "hidden" }} disabled={sending} onClick={() => setStep(step - 1)}><ArrowLeft className="icon" aria-hidden />Back</button>
        <button type="button" className="btn btn-red" disabled={sending || Boolean(busy)} onClick={next}>
          {sending ? <><Loader2 className="icon spin" aria-hidden />Sending…</> : <>{nextLabel}{step < LAST && <ArrowRight className="icon" aria-hidden />}</>}
        </button>
      </div>
    </>
  );
}
