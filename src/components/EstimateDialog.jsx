import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import EstimateForm from "./EstimateForm";

export default function EstimateDialog({ open, onClose, initialType, formKey }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} className="est" aria-labelledby="est-title" onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="est-head">
        <img src="/brand/agc-logo.webp" alt="" width="64" />
        <div><strong id="est-title">Request a free estimate</strong><span>About 3 minutes. Request your visit time in the same form.</span></div>
        <button className="est-x" type="button" aria-label="Close" onClick={onClose}><X className="icon" aria-hidden /></button>
      </div>
      <EstimateForm key={formKey} initialType={initialType} />
    </dialog>
  );
}
