import { Link } from "react-router-dom";
import { useSeo } from "../lib/seo";
import EstimateButton from "../components/EstimateButton";

export default function NotFound() {
  useSeo({ title: "Page not found" });
  return (
    <section className="section"><div className="wrap" style={{ textAlign: "center", maxWidth: 680 }}>
      <p aria-hidden style={{ font: "800 clamp(5rem,14vw,9rem)/1 var(--display)", color: "var(--line)" }}>404</p>
      <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", marginTop: 8 }}>This page isn’t on the plans</h1>
      <p className="lede" style={{ margin: "16px auto 0" }}>The page may have moved, or the link may be mistyped.</p>
      <div className="cta-row" style={{ justifyContent: "center" }}><Link className="btn btn-ghost" to="/">Go to the home page</Link><EstimateButton /></div>
    </div></section>
  );
}
