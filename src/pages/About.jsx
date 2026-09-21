import { business } from "../config/business";
import { ownerPhoto } from "../config/images";
import { useSeo } from "../lib/seo";
import { PageHero, WhyPanel, CtaBlock } from "../components/Sections";
import { Reveal, Tilt } from "../components/Motion";

/** OWNER BIO: add Daniel's approved biography here, one string per paragraph. Empty = hidden. */
const ownerBio = [];

export default function About() {
  useSeo({ title: "About American General Contractor", path: "/about",
    description: `${business.name} is a fully insured South Jersey contractor (${business.license}) for residential remodeling and commercial construction.` });
  return (<>
    <PageHero title={`About ${business.shortName}`} crumbs={[["About", "/about"]]} intro={business.supportingLine} />
    <section className="section" style={{ paddingTop: 24 }}><div className="wrap split">
      <Reveal variant="left" className="prose">
        <h2 style={{ marginBottom: 24 }}>A contractor South Jersey homeowners can trust</h2>
        <p>{business.name} provides remodeling and construction services to homeowners and businesses throughout South Jersey. Most of our work is residential: kitchens, bathrooms, additions, decks, pergolas, windows, doors and flooring.</p>
        <p>From focused home improvements to large-scale renovations, we bring the same attention to quality, communication and craftsmanship to every project. Our experience runs from everyday homes to million-dollar properties, and the standard does not change with the size of the job.</p>
        <p>We are a registered New Jersey Home Improvement Contractor ({business.license}) and fully insured.</p>
      </Reveal>
      <Reveal variant="right" as="figure" style={{ margin: 0 }}>
        <Tilt max={5} className="owner-photo" style={{ maxWidth: 380 }}>
          {ownerPhoto.src && <img src={ownerPhoto.src} alt={ownerPhoto.alt} width="840" height="2150" />}
          <img className="badge" src="/brand/agc-logo.webp" alt="" aria-hidden />
          <div className="name"><b>{business.owner}</b><small>Owner, {business.name}</small></div>
        </Tilt>
        {ownerBio.length > 0 && <figcaption style={{ marginTop: 20, maxWidth: 380, marginInline: "auto" }}>{ownerBio.map((p) => <p key={p.slice(0, 24)} style={{ marginTop: 12 }}>{p}</p>)}</figcaption>}
      </Reveal>
    </div></section>
    <WhyPanel /><CtaBlock />
  </>);
}
