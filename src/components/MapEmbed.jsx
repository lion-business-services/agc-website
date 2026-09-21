import { MapPin } from "lucide-react";
import { business } from "../config/business";
import { PREVIEW } from "../lib/preview";

export default function MapEmbed({ height = 420 }) {
  if (!business.mapEmbedUrl) return null;
  if (PREVIEW) return (
    <div className="map map-demo" style={{ height }}><MapPin className="icon" aria-hidden /><b>Google Map loads here on the live site</b><span>Interactive map of South Jersey. After the Google Business Profile is connected it shows the AGC pin and star rating.</span></div>
  );
  return (
    <div className="map">
      <iframe title={`Google map: ${business.shortName} service area, ${business.region}`} src={business.mapEmbedUrl}
        height={height} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
    </div>
  );
}
