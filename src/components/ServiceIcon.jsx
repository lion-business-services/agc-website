import { CookingPot, Bath, HousePlus, Fence, Tent, DoorOpen, Grid2x2, PaintRoller, Building2 } from "lucide-react";
const map = { kitchen: CookingPot, bath: Bath, addition: HousePlus, deck: Fence, pergola: Tent, window: DoorOpen, floor: Grid2x2, remodel: PaintRoller, commercial: Building2 };
export default function ServiceIcon({ name, className = "icon" }) {
  const I = map[name] || PaintRoller;
  return <I className={className} aria-hidden />;
}
