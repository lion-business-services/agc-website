import { useSeo } from "../lib/seo";
import { Hero, ServicesBento, WhyPanel, OwnerSpotlight, Process, Reviews, CtaBlock, AreaBlock } from "../components/Sections";

export default function Home() {
  useSeo({ title: "South Jersey General Contractor | American General Contractor", path: "/",
    description: "Kitchen and bathroom remodeling, additions, decks, pergolas, windows, doors and flooring for South Jersey homeowners. Fully insured. NJ HIC #13VH10631700. Request a free estimate." });
  return (<><Hero /><ServicesBento /><WhyPanel /><OwnerSpotlight /><Process /><Reviews /><CtaBlock /><AreaBlock /></>);
}
