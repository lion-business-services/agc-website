import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, Phone, Plus } from "lucide-react";
import { business } from "../config/business";
import { getService } from "../config/services";
import { serviceImages } from "../config/images";
import { useSeo } from "../lib/seo";
import { track } from "../lib/analytics";
import { PageHero, Process, CtaBlock } from "../components/Sections";
import EstimateButton from "../components/EstimateButton";
import { Reveal, Tilt } from "../components/Motion";
import NotFound from "./NotFound";

export default function ServiceDetail() {
  const { slug } = useParams();
  const s = getService(slug);
  useSeo({ title: s ? s.metaTitle : "Page not found", description: s?.metaDescription, path: `/services/${slug}` });
  useEffect(() => { if (s) track("service_view", { service: s.slug }); }, [s]);
  if (!s) return <NotFound />;
  const img = serviceImages[s.image];
  return (<>
    <PageHero photo={img} title={s.h1} intro={s.summary} crumbs={[["Services", "/services"], [s.name, `/services/${s.slug}`]]}>
      <div className="cta-row"><EstimateButton type={s.estimateType} arrow />
        <a className="btn btn-line" href={business.phone.href}><Phone className="icon" aria-hidden />Call {business.phone.display}</a></div>
    </PageHero>
    <section className="section" style={{ paddingTop: 24 }}><div className="wrap split">
      <Reveal variant="left">
        <div className="prose">{s.intro.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>
        <h2 style={{ fontSize: "1.7rem", marginTop: 48 }}>{s.includesTitle}</h2>
        <ul className="checks">{s.includes.map((i) => <li key={i}><Check className="icon" aria-hidden />{i}</li>)}</ul>
        <h2 style={{ fontSize: "1.7rem", marginTop: 56 }}>Common questions</h2>
        <div className="faq">{s.faqs.map((f) => (
          <details key={f.q}><summary>{f.q}<Plus className="icon" aria-hidden /></summary><p>{f.a}</p></details>
        ))}</div>
      </Reveal>
      <Reveal variant="right" as="aside" className="side">
        <Tilt max={5} className="ph-img" style={{ aspectRatio: "4/3", borderRadius: "var(--r-lg)", overflow: "hidden" }}>{img?.src && <img src={img.src} alt={img.alt} loading="lazy" width="960" height="720" />}</Tilt>
        <Tilt max={5} className="card">
          <h3>{business.insured} · {business.license}</h3>
          <p style={{ margin: "8px 0 18px" }}>Experience you can trust, from everyday homes to million-dollar properties.</p>
          <EstimateButton type={s.estimateType} className="btn btn-red attn" />
        </Tilt>
        <div><h3>Related services</h3>
          <ul className="linklist">{s.related.map(getService).filter(Boolean).map((r) => <li key={r.slug}><Link to={`/services/${r.slug}`}>{r.name}<ArrowRight className="icon" aria-hidden /></Link></li>)}</ul></div>
      </Reveal>
    </div></section>
    <div style={{ background: "var(--soft)" }}><Process /></div>
    <CtaBlock type={s.estimateType} />
  </>);
}
