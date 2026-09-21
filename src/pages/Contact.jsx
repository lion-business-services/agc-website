import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, Mail, Phone } from "lucide-react";
import { business } from "../config/business";
import { services } from "../config/services";
import { useSeo } from "../lib/seo";
import { PageHero, AreaBlock, CtaBlock } from "../components/Sections";
import EstimateButton from "../components/EstimateButton";
import Social from "../components/Social";

/** Contact + Service Area on one page (the old /service-area link redirects here). */
export default function Contact() {
  useSeo({ title: `Contact & ${business.region} Service Area`, path: "/contact",
    description: `Call ${business.phone.display} or email ${business.email.display}. ${business.name} serves homeowners and businesses throughout ${business.region}, New Jersey.` });
  return (<>
    <PageHero title="Contact us" crumbs={[["Contact Us", "/contact"]]} intro="Call, email or send us your project details. We proudly serve homeowners and businesses throughout South Jersey." />
    <section className="section" style={{ paddingTop: 24, paddingBottom: 56 }}><div className="wrap">
      <div className="contact-cards">
        <div className="card"><Phone className="icon" aria-hidden /><h3>Call us</h3><p>The fastest way to reach us.</p><a className="btn btn-ghost" href={business.phone.href}>{business.phone.display}</a></div>
        <div className="card"><ClipboardList className="icon" aria-hidden /><h3>Free estimate</h3><p>Share project details and photos, and request an appointment time.</p><EstimateButton className="btn btn-red attn" /></div>
        <div className="card"><Mail className="icon" aria-hidden /><h3>Email us</h3><p>For general questions.</p><a className="btn btn-ghost" href={business.email.href}>{business.email.display}</a></div>
      </div>
      <p style={{ textAlign: "center", marginTop: 32, color: "var(--ink)" }}><strong>{business.name}</strong> · {business.license} · {business.insured}</p>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}><Social className="social dark" /></div>
    </div></section>
    <div id="service-area"><AreaBlock /></div>
    <section className="section" style={{ background: "var(--soft)" }}><div className="wrap">
      <h2>Services available across South Jersey</h2>
      <ul className="linklist" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", columnGap: 32, marginTop: 32 }}>
        {services.map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`}>{s.name}<ArrowRight className="icon" aria-hidden /></Link></li>)}
      </ul>
    </div></section>
    <CtaBlock heading="Is your project in South Jersey?" />
  </>);
}
