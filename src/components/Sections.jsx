import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, ClipboardCheck, Hammer, Handshake, Home, Mail, MapPin, Phone, ShieldCheck, Star, TrendingUp, Users } from "lucide-react";
import { business } from "../config/business";
import { services, primaryServices } from "../config/services";
import { serviceImages, ownerPhoto } from "../config/images";
import { useParallax } from "../lib/motion";
import { Reveal, Tilt } from "./Motion";
import { track } from "../lib/analytics";
import EstimateButton from "./EstimateButton";
import ServiceIcon from "./ServiceIcon";
import MapEmbed from "./MapEmbed";
import { PREVIEW } from "../lib/preview";

export function Hero() {
  const ref = useParallax();
  return (
    <section className="hero" ref={ref}><div className="wrap hero-grid">
      <div>
        <span className="pill"><i />South Jersey General Contractor</span>
        <h1><span><i>Building a</i></span><span><i>stronger</i></span><span><i>tomorrow.</i></span></h1>
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
        <img src="/brand/agc-logo.webp" alt={`${business.name} logo: Quality, Integrity, Results`} width="720" height="652" fetchPriority="high" data-depth="-22" data-tilt="1" />
        <div className="float a" data-depth="34"><b><Hammer className="icon" aria-hidden /></b><span>Quality craftsmanship<small>Everyday homes to million-dollar properties</small></span></div>
        <div className="float b" data-depth="46"><b><ClipboardCheck className="icon" aria-hidden /></b><span>Free estimates<small>Tell us about your project</small></span></div>
      </div>
    </div></section>
  );
}

export function ServicesBento({ heading = true }) {
  const commercial = services.find((s) => s.secondary);
  return (
    <section className="section" id="services"><div className="wrap">
      {heading && <Reveal className="head">
        <div><h2>Expert construction and<br />remodeling for every vision</h2>
          <p className="lede">From focused home improvements to large-scale renovations, the same attention to quality, communication and craftsmanship.</p></div>
        <Link className="link" to="/services">All services <ArrowRight className="icon" aria-hidden /></Link>
      </Reveal>}
      <Reveal className="bento">
        {primaryServices.map((s) => {
          const img = serviceImages[s.image];
          return (
            <Tilt as={Link} key={s.slug} data-stagger className={`svc${s.slug === "pergolas" && !img?.src ? " tag" : ""}`} to={`/services/${s.slug}`}>
              {img?.src && <span className="thumb"><img src={img.src} alt={img.alt} loading="lazy" /></span>}
              <span className="ico"><ServiceIcon name={s.icon} /></span>
              <span className="go"><ArrowRight className="icon" aria-hidden /></span>
              <h3>{s.name}</h3><p>{s.summary}</p>
            </Tilt>
          );
        })}
        <Link data-stagger className="svc wide" to={`/services/${commercial.slug}`} style={{ gridColumn: "1/-1", minHeight: 0, flexDirection: "row", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <span className="ico"><ServiceIcon name="commercial" /></span>
          <span style={{ flex: 1, minWidth: 220 }}><h3 style={{ padding: 0, margin: 0 }}>{commercial.name}</h3><p>{commercial.summary}</p></span>
          <span className="btn btn-line" style={{ minHeight: 46 }}>Commercial services</span>
        </Link>
      </Reveal>
    </div></section>
  );
}

const points = [
  [Hammer, "Quality in every detail", "Work that holds up to a close look, from framing to the final trim line."],
  [Handshake, "Integrity in everything we do", "Clear pricing, clear communication, and we stand behind our work."],
  [Users, "Client focused", "Built around your needs. You know what is happening, what comes next and who to call."],
  [TrendingUp, "Results that last", "Layouts, transitions and finishes are planned, not improvised."],
];
const panelFacts = [business.insured, business.license, "Residential & Commercial", `Proudly Serving ${business.region}`, "Free Estimates", "Experience from everyday homes to million-dollar properties"];
export function WhyPanel() {
  return (
    <section id="why" style={{ paddingBottom: "clamp(64px,9vw,120px)" }}><div className="wrap"><Reveal variant="zoom" className="panel">
      <img className="panel-mark" src="/brand/agc-logo.webp" alt="" aria-hidden />
      <div className="panel-grid">
        <div>
          <span className="kicker"><i />Why homeowners choose AGC</span>
          <p className="words"><span>Quality.</span><span>Integrity.</span><span>Results.</span></p>
          <p className="lede">Three words on our logo, and the standard we hold every project to, whether it is a single bathroom or a whole-home renovation.</p>
          <div className="cta-row"><EstimateButton className="btn btn-red attn" arrow /><a className="btn btn-line" href={business.phone.href}><Phone className="icon" aria-hidden />{business.phone.display}</a></div>
        </div>
        <ul className="points">{points.map(([I, t, d], n) => <Tilt as="li" max={6} key={t} data-stagger><span className="num">0{n + 1}</span><span className="pi"><I className="icon" aria-hidden /></span><h3>{t}</h3><p>{d}</p></Tilt>)}</ul>
      </div>
      <div className="ticker" aria-hidden><div className="ticker-track">{[...panelFacts, ...panelFacts].map((f, i) => <span key={i}><Star className="icon" />{f}</span>)}</div></div>
      <ul className="sr-only">{panelFacts.map((f) => <li key={f}>{f}</li>)}</ul>
    </Reveal></div></section>
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
      <Reveal className="head"><h2>How an estimate works</h2></Reveal>
      <Reveal as="ol" className="steps">{steps.map(([t, d]) => <li key={t} data-stagger><h3>{t}</h3><p>{d}</p></li>)}</Reveal>
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
      <Reveal className="head"><h2>What homeowners say</h2>
        {has && data.rating && <div className="rating-sum"><b>{data.rating.toFixed(1)}</b><Stars n={Math.round(data.rating)} /><span>{data.total} Google reviews</span></div>}
      </Reveal>
      {has ? (
        <>
          <Reveal className="rcards" style={{ marginTop: 0 }}>
            {data.reviews.map((r, i) => (
              <div className="rcard" data-stagger key={i}><Stars n={r.rating} /><blockquote>{r.text}</blockquote>
                <div className="who">{r.photo ? <img className="av" src={r.photo} alt="" referrerPolicy="no-referrer" /> : <span className="av" />}<span>{r.author}<small>{r.when} · Google</small></span></div></div>
            ))}
          </Reveal>
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
        <Reveal className="reviews"><Stars /><div><h3>Customer reviews are on the way.</h3>
          <p style={{ marginTop: 8, maxWidth: "60ch" }}>We only publish real reviews from real customers. If we have worked on your home, we would be grateful if you shared your experience on Google.</p>
          {business.googleReviewUrl && <a className="btn btn-ghost" style={{ marginTop: 16 }} href={business.googleReviewUrl} target="_blank" rel="noopener noreferrer">Leave us a Google review</a>}</div></Reveal>
      )}
    </div></section>
  );
}

export function CtaBlock({ heading = "Ready to start your project?", type = "" }) {
  return (
    <section className="section" id="contact"><div className="wrap"><Reveal variant="zoom" className="cta">
      <div><h2>{heading}</h2><p>Tell us about your project and a member of our team will get back to you.</p>
        <div className="cta-row"><EstimateButton className="btn btn-white btn-xl attn attn-white" type={type} arrow /></div></div>
      <div className="cta-card">
        <a className="row big" href={business.phone.href} onClick={() => track("phone_click", { location: "cta" })}><b><Phone className="icon" aria-hidden /></b>{business.phone.display}</a>
        <a className="row" href={business.email.href} onClick={() => track("email_click", { location: "cta" })}><b><Mail className="icon" aria-hidden /></b>{business.email.display}</a>
      </div>
    </Reveal></div></section>
  );
}

export function AreaBlock({ map = true }) {
  return (
    <section id="area" style={{ paddingBottom: "clamp(64px,9vw,120px)" }}><div className="wrap">
      <Reveal className="area">
        <div className="pin"><MapPin className="icon" aria-hidden /></div>
        <div><h2>Proudly serving South Jersey</h2>
          <p className="lede" style={{ marginTop: 16 }}>Not sure whether your town is covered? Send your project address with your estimate request, or call {business.phone.display}, and we will let you know.</p></div>
      </Reveal>
      {map && <Reveal variant="zoom" style={{ marginTop: 40 }}><MapEmbed /></Reveal>}
    </div></section>
  );
}

/** Meet the owner. Photo + bio come from config/images.js and pages/About.jsx. */
export function OwnerSpotlight() {
  return (
    <section className="section" id="owner"><div className="wrap"><div className="owner">
      <Reveal variant="left">
        <Tilt max={5} className="owner-photo">
          {ownerPhoto.src && <img src={ownerPhoto.src} alt={ownerPhoto.alt} loading="lazy" width="840" height="2150" />}
          <img className="badge" src="/brand/agc-logo.webp" alt="" aria-hidden />
          <div className="name"><b>{business.owner}</b><small>Owner, {business.name}</small></div>
        </Tilt>
      </Reveal>
      <Reveal variant="right">
        <blockquote>From focused home improvements to large-scale renovations, we bring the same attention to quality, communication and craftsmanship to every project.</blockquote>
        <p className="lede">{business.shortName} is owned and led by {business.owner}. Most of our work is residential remodeling for South Jersey homeowners, with experience that runs from everyday homes to million-dollar properties. When you call, you talk to the people doing the work.</p>
        <ul className="trust-row">
          <li><ShieldCheck className="icon" aria-hidden />{business.insured}</li>
          <li><BadgeCheck className="icon" aria-hidden />{business.license}</li>
          <li><Home className="icon" aria-hidden />Residential &amp; Commercial</li>
        </ul>
        <div className="cta-row"><EstimateButton className="btn btn-red attn" arrow /><Link className="btn btn-ghost" to="/about">More about us</Link></div>
      </Reveal>
    </div></div></section>
  );
}

export function PageHero({ title, intro, crumbs = [], children }) {
  return (
    <section className="page-hero"><div className="wrap">
      <nav aria-label="Breadcrumb"><ol className="crumbs">
        <li><Link to="/">Home</Link></li>
        {crumbs.map(([l, to], i) => <li key={to}>{i === crumbs.length - 1 ? <span aria-current="page">{l}</span> : <Link to={to}>{l}</Link>}</li>)}
      </ol></nav>
      <Reveal><h1>{title}</h1>{intro && <p className="lede">{intro}</p>}{children}</Reveal>
    </div></section>
  );
}
