import { ArrowRight } from "lucide-react";
import { useEstimate } from "./EstimateContext";

export default function EstimateButton({ className = "btn btn-red", type = "", arrow = false, children = "Request a Free Estimate" }) {
  const { openEstimate } = useEstimate();
  return (
    <button type="button" className={className} onClick={() => openEstimate(type)}>
      {children}{arrow && <ArrowRight className="icon" aria-hidden />}
    </button>
  );
}
