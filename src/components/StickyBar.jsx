import { ClipboardList, Phone } from "lucide-react";
import { useLocation } from "react-router-dom";
import { business } from "../config/business";
import { track } from "../lib/analytics";
import { useEstimate } from "./EstimateContext";

export default function StickyBar() {
  const { openEstimate } = useEstimate();
  const { pathname } = useLocation();
  if (pathname === "/request-estimate") return null;
  return (
    <div className="sticky">
      <a href={business.phone.href} onClick={() => track("phone_click", { location: "sticky" })}><Phone className="icon" aria-hidden />CALL</a>
      <a className="attn-bar" href="/request-estimate" onClick={(e) => { e.preventDefault(); openEstimate(); }}><ClipboardList className="icon" aria-hidden />FREE ESTIMATE</a>
    </div>
  );
}
