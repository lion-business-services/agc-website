import { Link } from "react-router-dom";
import { business } from "../config/business";
import { services } from "../config/services";
import Social from "./Social";

const quick = [["Home", "/"], ["Services", "/services"], ["About", "/about"], ["Reviews", "/reviews"], ["Contact Us", "/contact"], ["Request a Free Estimate", "/request-estimate"]];

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot">
        <div><img src="/brand/agc-logo.webp" alt={business.name} width="270" height="244" loading="lazy" /><p className="tag">{business.supportingLine}</p><div style={{ marginTop: 20 }}><Social /></div></div>
        <nav aria-label="Quick links"><h4>Quick links</h4><ul>{quick.map(([l, to]) => <li key={to}><Link to={to}>{l}</Link></li>)}</ul></nav>
        <nav aria-label="Services"><h4>Services</h4><ul>{services.map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`}>{s.name}</Link></li>)}</ul></nav>
        <div><h4>Contact</h4>
          <ul><li><a className="tel" href={business.phone.href}>{business.phone.display}</a></li><li><a href={business.email.href}>{business.email.display}</a></li><li>{business.domain}</li></ul>
          <ul className="creds"><li>{business.license}</li><li>{business.insured}</li><li>Proudly Serving {business.region}</li></ul>
        </div>
      </div>
      <div className="subfoot"><div className="wrap">
        <span>© {new Date().getFullYear()} {business.name}. All rights reserved. <Link to="/privacy" style={{ textDecoration: "underline" }}>Privacy</Link></span>
        <span>Built by {business.developer.name} · {business.developer.location} · <a href={business.developer.phoneHref}>{business.developer.phone}</a> · <a href={`mailto:${business.developer.email}`}>{business.developer.email}</a></span>
      </div></div>
    </footer>
  );
}
