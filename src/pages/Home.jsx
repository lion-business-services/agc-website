import { useSeo } from "../lib/seo";
import { Hero, ServicesBento, WhyPanel, Gallery, Process, Reviews, CtaBlock, AreaBlock } from "../components/Sections";

export default function Home() {
  useSeo({ title: "South Jersey General Contractor | American General Contractor", path: "/",
    description: "Kitchen and bathroom remodeling, additions, decks, pergolas, windows, doors and flooring for South Jersey homeowners. Fully insured. NJ HIC #13VH10631700. Request a free estimate." });
  return (
    <>
      <Hero /><ServicesBento /><WhyPanel />
      <section className="section" id="work" style={{ background: "var(--soft)" }}><div className="wrap">
        <div className="head"><h2>Real projects. Real results.</h2></div>
        <Gallery />
      </div></section>
      <Process /><Reviews /><CtaBlock /><AreaBlock />
    </>
  );
}
