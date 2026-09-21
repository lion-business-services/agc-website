import { useSeo } from "../lib/seo";
import { PageHero, Reviews, CtaBlock } from "../components/Sections";

export default function ReviewsPage() {
  useSeo({ title: "Customer Reviews", path: "/reviews", description: "Reviews from South Jersey homeowners who have worked with American General Contractor." });
  return (<><PageHero title="Customer reviews" crumbs={[["Reviews", "/reviews"]]} intro="What South Jersey homeowners say about working with us." /><Reviews /><CtaBlock /></>);
}
