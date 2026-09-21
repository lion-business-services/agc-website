import { useSearchParams } from "react-router-dom";
import { useSeo } from "../lib/seo";
import { PageHero } from "../components/Sections";
import EstimateForm from "../components/EstimateForm";

export default function RequestEstimate() {
  const [params] = useSearchParams();
  useSeo({ title: "Request a Free Estimate", path: "/request-estimate",
    description: "Tell American General Contractor about your South Jersey remodeling or construction project. Add photos, request an appointment and get a free estimate." });
  return (<>
    <PageHero title="Request a free estimate" crumbs={[["Request an Estimate", "/request-estimate"]]} intro="A few short steps. It takes about three minutes, and photos are optional." />
    <section className="section" style={{ paddingTop: 16 }}><div className="wrap"><div className="inline-form"><EstimateForm initialType={params.get("type") || ""} /></div></div></section>
  </>);
}
