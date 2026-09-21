import { useSeo } from "../lib/seo";
import { PageHero, Gallery, CtaBlock } from "../components/Sections";

export default function OurWork() {
  useSeo({ title: "Our Work: Remodeling Projects in South Jersey", path: "/our-work",
    description: "Kitchens, bathrooms, decks, pergolas, additions and whole-home remodels completed by American General Contractor in South Jersey." });
  return (<>
    <PageHero title="Real projects. Real results." crumbs={[["Our Work", "/our-work"]]} intro="The best way to judge a contractor is to look closely at the work. Browse by project type." />
    <section className="section" style={{ paddingTop: 24 }}><div className="wrap"><Gallery /></div></section>
    <CtaBlock heading="See something like your project?" />
  </>);
}
