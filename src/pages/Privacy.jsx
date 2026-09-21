import { business } from "../config/business";
import { useSeo } from "../lib/seo";
import { PageHero } from "../components/Sections";

/** Plain-language starter policy. Have AGC (or counsel) review before launch. */
export default function Privacy() {
  useSeo({ title: "Privacy Policy", path: "/privacy", description: `How ${business.name} handles information submitted through this website.` });
  return (<>
    <PageHero title="Privacy policy" crumbs={[["Privacy", "/privacy"]]} />
    <section className="section" style={{ paddingTop: 16 }}><div className="wrap prose" style={{ maxWidth: 760 }}>
      <h3>What we collect</h3>
      <p>When you request an estimate, we collect the information you enter: your name, phone number, email address, project address, project details, appointment preferences and any photos you attach.</p>
      <h3 style={{ marginTop: 32 }}>How we use it</h3>
      <p>We use this information only to respond to your request, prepare an estimate, schedule appointments and carry out work you hire us for. By submitting the form you agree that we may contact you by phone, text message or email about your request. Message and data rates may apply. You can ask us to stop contacting you at any time.</p>
      <h3 style={{ marginTop: 32 }}>Sharing</h3>
      <p>We do not sell your information. Estimate requests are delivered to our email through a form delivery service (FormSubmit) acting on our behalf.</p>
      <h3 style={{ marginTop: 32 }}>Your choices</h3>
      <p>To ask what information we hold about you, or to have it corrected or deleted, call {business.phone.display} or email {business.email.display}.</p>
    </div></section>
  </>);
}
