import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, ClipboardCheck, Hammer, Home, Image as ImageIcon, Mail, MapPin, MessagesSquare, Phone, Ruler, ShieldCheck, Star } from "lucide-react";
import { business } from "../config/business";
import { services, primaryServices } from "../config/services";
import { serviceImages, projects, projectCategories } from "../config/images";
import { track } from "../lib/analytics";
import EstimateButton from "./EstimateButton";
import ServiceIcon from "./ServiceIcon";
import MapEmbed from "./MapEmbed";
import { PREVIEW } from "../lib/preview";

export function Hero() {
  return (
    <section className="hero"><div className="wrap hero-grid">
      <div>
        <span className="pill"><i />South Jersey General Contractor</span>
        <h1><span>Building a</span><span>stronger</span><span>tomorrow.</span></h1>
        <p className="support">{business.supportingLine}</p>
        <p className="lede">Professional remodeling and construction services for homeowners throughout South Jersey.</p>
        <div className="cta-row">
          <EstimateButton className="btn btn-red btn-xl attn" arrow />
          <a className="btn btn-ghost btn-xl" href={business.phone.href} onClick={() => track("phone_click", { location: "hero" })}><Phone className="icon" aria-hidden />Call {business.phone.display}</a>
        </div>
        <ul className="chips">
          <li><ShieldCheck className="icon" aria-hidden />{business.insured}</li>
          <li><BadgeCheck className="icon" aria-hidden />{business.license}</li>
          <li><Home className="icon" aria-hidden />Residential &amp; Commercial</li>
        </ul>
      </div>
      <div className="stage">
        <div className="ring" /><div className="disc" />
        <img src="/brand/agc-logo.webp" alt={`${business.name} logo: Quality, Integrity, Results`} width="720" height="652" fetchPriority="high" />
        <div className="float a"><b><Hammer className="icon" aria-hidden /></b><span>Quality craftsmanship<small>Everyday homes to million-dollar properties</small></span></div>
        <div className="float b"><b><ClipboardCheck className="icon" aria-hidden /></b><span>Free estimates<small>Tell us about your project</small></span></div>
      </div>
    </div></section>
  );
}

export function ServicesBento({ heading = true }) {
  const commercial = services.find((s) => s.secondary);
  return (
    <section className="section" id="services"><div className="wrap">
      {heading && <div className="head">
        <div><h2>Expert construction and<br />remodeling for every vision</h2>
          <p className="lede">From focused home improvements to large-scale renovations, the same attention to quality, communication and craftsmanship.</p></div>
        <Link className="link" to="/services">All services <ArrowRight className="icon" aria-hidden /></Link>
      </div>}
      <div className="bento">
        {primaryServices.map((s) => {
          const img = serviceImages[s.image];
          return (
            <Link key={s.slug} className={`svc${s.slug === "pergolas" && !img?.src ? " tag" : ""}`} to={`/services/${s.slug}`}>
              {img?.src && <span className="thumb"><img src={img.src} alt={img.alt} loading="lazy" /></span>}
              <span className="ico"><ServiceIcon name={s.icon} /></span>
              <span className="go"><ArrowRight className="icon" aria-hidden /></span>
              <h3>{s.name}</h3><p>{s.summary}</p>
            </Link>
          );
        })}
        <Link className="svc wide" to={`/services/${commercial.slug}`} style={{ gridColumn: "1/-1", minHeight: 0, flexDirection: "row", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <span className="ico"><ServiceIcon name="commercial" /></span>
          <span style={{ flex: 1, minWidth: 220 }}><h3 style={{ padding: 0, margin: 0 }}>{commercial.name}</h3><p>{commercial.summary}</p></span>
          <span className="btn btn-line" style={{ minHeight: 46 }}>Commercial services</span>
        </Link>
      </div>
    </div></section>
  );
}

const points = [
  [Hammer, "High-quality craftsmanship", "Work that holds up to a close look, from framing to the final trim line."],
  [MessagesSquare, "Clear communication", "You know what is happening, what comes next and who to call."],
  [Ruler, "Attention to detail", "Layouts, transitions and finishes are planned, not improvised."],
  [ShieldCheck, `${business.insured} · ${business.license}`, "Registered New Jersey Home Improvement Contractor."],
];
export function WhyPanel() {
  return (
    <section id="why" style={{ paddingBottom: "clamp(64px,9vw,120px)" }}><div className="wrap"><div className="panel"><div className="panel-grid">
      <div><p className="words"><span>Quality.</span><span>Integrity.</span><span>Results.</span></p>
        <p className="lede">Three words on our logo, and the standard we hold every project to.</p></div>
      <ul className="points">{points.map(([I, t, d]) => <li key={t}><I className="icon" aria-hidden /><h3>{t}</h3><p>{d}</p></li>)}</ul>
    </div></div></div></section>
  );
}

const grads = ["g1", "g2", "g3", "g4", "g5", "g6"];
export function Gallery({ filterable = true }) {
  const [cat, setCat] = useState("All");
  useEffect(() => { if (filterable) track("gallery_view"); }, [filterable]);
  const list = cat === "All" ? projects : projects.filter((p) => p.category === cat);
  return (
    <>
      {filterable && <div className="filters" role="group" aria-label="Filter projects">
        {["All", ...projectCategories].map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
      </div>}
      <div className="gallery">
        {list.map((p, n) => (
          <figure key={n} className={`shot ${cat === "All" ? p.size || "" : ""} ${grads[n % grads.length]}`} style={{ margin: 0 }}>
            {p.src ? <img className="user" src={p.src} alt={p.alt} loading="lazy" /> : <span className="ph"><ImageIcon className="icon" aria-hidden />Photo coming soon</span>}
            <figcaption>{p.category}</figcaption>
          </figure>
        ))}
      </div>
      {list.length === 0 && <p style={{ textAlign: "center", padding: "40px 0" }}>Photos for this category are coming soon.</p>}
    </>
  );
}

const steps = [
  ["Request an estimate", "Tell us about the project online or by phone. Photos help."],
  ["We review and reach out", "A member of our team contacts you about the next step."],
  ["We look at it together", "We confirm what you want and answer your questions."],
  ["You receive your estimate", "Clear scope, so you can decide with confidence."],
];
export function Process() {
  return (
    <section className="section"><div className="wrap">
      <div className="head"><h2>How an estimate works</h2></div>
      <ol className="steps">{steps.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}</ol>
    </div></section>
  );
}

function Stars({ n = 5 }) {
  return <div className="stars" role="img" aria-label={`${n} out of 5 stars`}>{[1, 2, 3, 4, 5].map((i) => <Star key={i} className="icon" aria-hidden style={{ opacity: i <= n ? 1 : 0.25 }} />)}</div>;
}
/** Loads live Google reviews from /api/reviews. Shows an honest empty state until Google is connected. */
export function Reviews() {
  const [data, setData] = useState(null);
  useEffect(() => {
    let live = true;
    fetch("/api/reviews").then((r) => (r.ok ? r.json() : null)).then((j) => live && setData(j?.reviews?.length ? j : { reviews: [] })).catch(() => live && setData({ reviews: [] }));
    return () => { live = false; };
  }, []);
  const has = data?.reviews?.length > 0;
  return (
    <section id="reviews" className="section" style={{ background: "var(--soft)" }}><div className="wrap">
      <div className="head"><h2>What homeowners say</h2>
        {has && data.rating && <div className="rating-sum"><b>{data.rating.toFixed(1)}</b><Stars n={Math.round(data.rating)} /><span>{data.total} Google reviews</span></div>}
      </div>
      {has ? (
        <>
          <div className="rcards" style={{ marginTop: 0 }}>
            {data.reviews.map((r, i) => (
              <div className="rcard" key={i}><Stars n={r.rating} /><blockquote>{r.text}</blockquote>
                <div className="who">{r.photo ? <img className="av" src={r.photo} alt="" referrerPolicy="no-referrer" /> : <span className="av" />}<span>{r.author}<small>{r.when} · Google</small></span></div></div>
            ))}
          </div>
          {business.googleReviewUrl && <p style={{ marginTop: 28 }}><a className="btn btn-ghost" href={business.googleReviewUrl} target="_blank" rel="noopener noreferrer">Leave us a Google review</a></p>}
          {data.url && <p style={{ marginTop: 20 }}><a className="link" href={data.url} target="_blank" rel="noopener noreferrer">Read all reviews on Google <ArrowRight className="icon" aria-hidden /></a></p>}
        </>
      ) : PREVIEW ? (
        <>
          <p style={{ marginBottom: 20 }}><span className="demo-tag" style={{ marginTop: 0 }}>Demo layout: real Google reviews and the star rating fill these cards automatically once Google is connected.</span></p>
          <div className="rcards" style={{ marginTop: 0 }}>{[92, 80, 64].map((w) => (
            <div className="rcard" key={w}><Stars /><div className="l" /><div className="l" style={{ width: `${w}%` }} /><div className="l" style={{ width: `${w - 30}%` }} />
              <div className="who"><span className="av" /><span>Customer name<small>Pulled from Google</small></span></div></div>))}</div>
        </>
      ) : (
        <div className="reviews"><Stars /><div><h3>Customer reviews are on the way.</h3>
          <p style={{ marginTop: 8, maxWidth: "60ch" }}>We only publish real reviews from real customers. If we have worked on your home, we would be grateful if you shared your experience on Google.</p>
          {business.googleReviewUrl && <a className="btn btn-ghost" style={{ marginTop: 16 }} href={business.googleReviewUrl} target="_blank" rel="noopener noreferrer">Leave us a Google review</a>}</div></div>
      )}
    </div></section>
  );
}

export function CtaBlock({ heading = "Ready to start your project?", type = "" }) {
  return (
    <section className="section" id="contact"><div className="wrap"><div className="cta">
      <div><h2>{heading}</h2><p>Tell us about your project and a member of our team will get back to you.</p>
        <div className="cta-row"><EstimateButton className="btn btn-white btn-xl attn attn-white" type={type} arrow /></div></div>
      <div className="cta-card">
        <a className="row big" href={business.phone.href} onClick={() => track("phone_click", { location: "cta" })}><b><Phone className="icon" aria-hidden /></b>{business.phone.display}</a>
        <a className="row" href={business.email.href} onClick={() => track("email_click", { location: "cta" })}><b><Mail className="icon" aria-hidden /></b>{business.email.display}</a>
      </div>
    </div></div></section>
  );
}

export function AreaBlock({ map = true }) {
  return (
    <section id="area" style={{ paddingBottom: "clamp(64px,9vw,120px)" }}><div className="wrap">
      <div className="area">
        <div className="pin"><MapPin className="icon" aria-hidden /></div>
        <div><h2>Proudly serving South Jersey</h2>
          <p className="lede" style={{ marginTop: 16 }}>Not sure whether your town is covered? Send your project address with your estimate request, or call {business.phone.display}, and we will let you know.</p></div>
      </div>
      {map && <div style={{ marginTop: 40 }}><MapEmbed /></div>}
    </div></section>
  );
}

export function PageHero({ title, intro, crumbs = [], children }) {
  return (
    <section className="page-hero"><div className="wrap">
      <nav aria-label="Breadcrumb"><ol className="crumbs">
        <li><Link to="/">Home</Link></li>
        {crumbs.map(([l, to], i) => <li key={to}>{i === crumbs.length - 1 ? <span aria-current="page">{l}</span> : <Link to={to}>{l}</Link>}</li>)}
      </ol></nav>
      <h1>{title}</h1>{intro && <p className="lede">{intro}</p>}{children}
    </div></section>
  );
}
