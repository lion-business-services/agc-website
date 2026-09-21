import { useSeo } from "../lib/seo";
import { PageHero, ServicesBento, CtaBlock } from "../components/Sections";

export default function Services() {
  useSeo({ title: "Remodeling & Construction Services in South Jersey", path: "/services",
    description: "Kitchen and bathroom remodeling, additions, decks, pergolas, windows, doors, flooring and commercial construction in South Jersey. Fully insured. NJ HIC #13VH10631700." });
  return (<>
    <PageHero title="Remodeling and construction services" crumbs={[["Services", "/services"]]} intro="One contractor for the projects South Jersey homeowners ask for most, from a single room to the whole house." />
    <ServicesBento heading={false} /><CtaBlock />
  </>);
}
