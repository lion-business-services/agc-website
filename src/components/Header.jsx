import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BadgeCheck, ChevronDown, MapPin, Menu, Phone, ShieldCheck, X } from "lucide-react";
import { business } from "../config/business";
import { services } from "../config/services";
import { serviceImages } from "../config/images";
import { track } from "../lib/analytics";
import EstimateButton from "./EstimateButton";
import ServiceIcon from "./ServiceIcon";
import Social from "./Social";

const nav = [["Home", "/"], ["Services", "/services"], ["About", "/about"], ["Contact Us", "/contact"]];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  const close = () => setOpen(false);

  return (
    <>
      <div className="topbar"><div className="wrap">
        <ul>
          <li><ShieldCheck className="icon" aria-hidden />{business.insured}</li>
          <li><BadgeCheck className="icon" aria-hidden />{business.license}</li>
          <li><MapPin className="icon" aria-hidden />Proudly Serving {business.region}</li>
        </ul>
        <div className="right">
          <Social />
          <a href={business.phone.href} onClick={() => track("phone_click", { location: "topbar" })}>{business.phone.display}</a>
          <a href={business.email.href} onClick={() => track("email_click", { location: "topbar" })}>{business.email.display}</a>
        </div>
      </div></div>

      <header className={scrolled ? "scrolled" : ""}>
        <a href="#main" className="skip">Skip to content</a>
        <div className="wrap nav">
          <Link className="brand" to="/" aria-label={`${business.name} home`}>
            <span className="brand-badge"><img src="/brand/agc-logo.webp" alt="" width="168" height="152" /></span>
            <span className="brand-name">American<small>General Contractor LLC</small></span>
          </Link>
          <nav aria-label="Main"><ul className="menu">
            {nav.map(([label, to]) => (
              <li key={to}>
                <NavLink to={to} end={to === "/"} className={({ isActive }) => (isActive ? "on" : "")}>{label}</NavLink>
                {to === "/services" && (
                  <div className="dd"><ul>
                    {services.map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`}>{serviceImages[s.image]?.thumb ? <img className="dd-thumb" src={serviceImages[s.image].thumb} alt="" width="160" height="120" loading="lazy" /> : <ServiceIcon name={s.icon} />}<span>{s.name}</span></Link></li>)}
                  </ul></div>
                )}
              </li>
            ))}
          </ul></nav>
          <div className="nav-cta">
            <a className="phone" href={business.phone.href} onClick={() => track("phone_click", { location: "header" })}><Phone className="icon" aria-hidden />{business.phone.display}</a>
            <EstimateButton className="btn btn-red attn" />
            <button className="burger" type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Menu className="icon" aria-hidden /></button>
          </div>
        </div>
      </header>

      {open && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer-head">
            <img src="/brand/agc-logo.webp" alt={business.name} />
            <button className="est-x" type="button" aria-label="Close menu" onClick={close} autoFocus><X className="icon" aria-hidden /></button>
          </div>
          <nav aria-label="Mobile">
            {nav.map(([label, to]) => to === "/services" ? (
              <div key={to}>
                <button type="button" aria-expanded={subOpen} onClick={() => setSubOpen(!subOpen)}>{label}<ChevronDown className="icon" aria-hidden style={{ transform: subOpen ? "rotate(180deg)" : "" }} /></button>
                {subOpen && <div className="sub">
                  <Link to="/services" onClick={close} style={{ color: "var(--red)", fontWeight: 700 }}>All services</Link>
                  {services.map((s) => <Link key={s.slug} to={`/services/${s.slug}`} onClick={close}>{s.name}</Link>)}
                </div>}
              </div>
            ) : <Link key={to} to={to} onClick={close} aria-current={pathname === to ? "page" : undefined}>{label}</Link>)}
          </nav>
          <div className="drawer-foot">
            <span onClick={close}><EstimateButton className="btn btn-red attn" /></span>
            <a className="btn btn-ghost" href={business.phone.href}>Call {business.phone.display}</a>
          </div>
        </div>
      )}
    </>
  );
}
