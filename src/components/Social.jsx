import { siFacebook, siInstagram, siTiktok, siYoutube, siGoogle } from "simple-icons";
import { business } from "../config/business";

const icons = { facebook: siFacebook, instagram: siInstagram, tiktok: siTiktok, youtube: siYoutube, google: siGoogle };
const labels = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube", google: "Google" };

/** Shows an icon link for every profile filled in at business.social. Renders nothing if none are set. */
export default function Social({ className = "social" }) {
  const list = Object.entries(business.social).filter(([k, url]) => url && icons[k]);
  if (!list.length) return null;
  return (
    <ul className={className} aria-label="Social media">
      {list.map(([k, url]) => (
        <li key={k}><a href={url} target="_blank" rel="noopener noreferrer me" aria-label={`${business.shortName} on ${labels[k]}`}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d={icons[k].path} /></svg>
        </a></li>
      ))}
    </ul>
  );
}
