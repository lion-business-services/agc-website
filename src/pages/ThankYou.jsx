import { Link, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { business } from "../config/business";
import { useSeo } from "../lib/seo";
import { PREVIEW } from "../lib/preview";

export default function ThankYou() {
  useSeo({ title: "Thank You", path: "/thank-you" });
  const [params] = useSearchParams();
  const sent = PREVIEW ? window.__agcLastSubmission : null;
  const ticket = params.get("ref") || sent?.ticket || "";
  return (
    <section className="section"><div className="wrap"><div className="done" style={{ maxWidth: 640, marginInline: "auto" }}>
      <div className="ok"><Check className="icon" aria-hidden /></div>
      <h1 style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>Thank you. We received your project request.</h1>
      {ticket && <div className="ticket"><small>Your estimate ticket number</small><b>{ticket}</b><span>Save this number. Mention it if you call or email us about your project.</span></div>}
      <p className="lede" style={{ margin: "18px auto 0" }}>A member of the American General Contractor team will review your information and contact you regarding the next step.</p>
      <p style={{ marginTop: 32 }}>Need to reach us sooner?</p>
      <a className="tel" href={business.phone.href}>{business.phone.display}</a>
      <div style={{ marginTop: 32 }}><Link className="btn btn-ghost" to="/">Back to home</Link></div>
      {sent && (
        <div className="card" style={{ textAlign: "left", marginTop: 40 }}>
          <span className="demo-tag" style={{ marginTop: 0 }}>Demo only: nothing was sent. On the live site this email goes out:</span>
          <p style={{ marginTop: 16 }}><b>To:</b> {sent.to}<br /><b>Cc:</b> {sent.cc}<br /><b>Subject:</b> {sent.subject}</p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, fontSize: ".95rem" }}><tbody>
            {sent.rows.map(([k, val]) => <tr key={k} style={{ borderTop: "1px solid var(--line)" }}><td style={{ padding: "8px 12px 8px 0", fontWeight: 600, color: "var(--ink)", verticalAlign: "top", whiteSpace: "nowrap" }}>{k}</td><td style={{ padding: "8px 0", wordBreak: "break-word" }}>{String(val).startsWith("https://") ? <a href={val} target="_blank" rel="noopener noreferrer" style={{ color: "var(--red)", fontWeight: 700, textDecoration: "underline" }}>Open in Google Calendar (try it)</a> : val}</td></tr>)}
            {sent.photos > 0 && <tr style={{ borderTop: "1px solid var(--line)" }}><td style={{ padding: "8px 12px 8px 0", fontWeight: 600, color: "var(--ink)" }}>Attachments</td><td>{sent.photos} photo{sent.photos > 1 ? "s" : ""}</td></tr>}
          </tbody></table>
          {sent.autoresponse && <><p style={{ marginTop: 24 }}><b>And the customer automatically receives this email:</b></p><p className="note" style={{ marginTop: 10, marginBottom: 0 }}>{sent.autoresponse}</p></>}
        </div>
      )}
    </div></div></section>
  );
}
