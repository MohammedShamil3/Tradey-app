import { useNavigate } from "react-router-dom";
import HorizontalScroll from "@/components/ui/HorizontalScroll";
import { Package, ArrowRight } from "lucide-react";
import { 
  House, 
  Broom, 
  Key, 
  PaintBrush, 
  Lightning, 
  Flower, 
  Drop, 
  Bathtub, 
  Wrench, 
  Wall, 
  Shower, 
  Fire, 
  ShieldCheck,
  Lock,
  type Icon
} from "@phosphor-icons/react";

export interface BundleService {
  name: string;
  icon: Icon;
  price: number;
  color: { bg: string; color: string };
}

export interface Bundle {
  id: string;
  name: string;
  tagline: string;
  icon: Icon;
  iconColor: { bg: string; color: string };
  savings: string;
  totalPrice: number;
  services: BundleService[];
}

const bundles: Bundle[] = [
  {
    id: "move-in",
    name: "Move-In Ready",
    tagline: "Everything for your new home",
    icon: House,
    iconColor: { bg: "bg-orange-100", color: "text-orange-500" },
    savings: "Save €45",
    totalPrice: 249,
    services: [
      { name: "Deep Cleaning", icon: Broom, price: 89, color: { bg: "bg-muted", color: "text-foreground" } },
      { name: "Lock Change", icon: Key, price: 75, color: { bg: "bg-muted", color: "text-foreground" } },
      { name: "Wall Touch-Up Paint", icon: PaintBrush, price: 65, color: { bg: "bg-muted", color: "text-foreground" } },
      { name: "Electrical Check", icon: Lightning, price: 65, color: { bg: "bg-muted", color: "text-foreground" } },
    ],
  },
  {
    id: "spring-refresh",
    name: "Spring Refresh",
    tagline: "Revive your living space",
    icon: Flower,
    iconColor: { bg: "bg-pink-100", color: "text-pink-500" },
    savings: "Save €35",
    totalPrice: 189,
    services: [
      { name: "Window Cleaning", icon: Wall, price: 55, color: { bg: "bg-muted", color: "text-foreground" } },
      { name: "Garden Tidy-Up", icon: Flower, price: 75, color: { bg: "bg-muted", color: "text-foreground" } },
      { name: "Gutter Cleaning", icon: House, price: 60, color: { bg: "bg-muted", color: "text-foreground" } },
      { name: "Pressure Wash", icon: Drop, price: 55, color: { bg: "bg-muted", color: "text-foreground" } },
    ],
  },
  {
    id: "bathroom-blitz",
    name: "Bathroom Blitz",
    tagline: "Complete bathroom maintenance",
    icon: Bathtub,
    iconColor: { bg: "bg-sky-100", color: "text-sky-500" },
    savings: "Save €30",
    totalPrice: 159,
    services: [
      { name: "Tap Repair", icon: Wrench, price: 45, color: { bg: "bg-muted", color: "text-foreground" } },
      { name: "Re-Grouting", icon: Wall, price: 55, color: { bg: "bg-muted", color: "text-foreground" } },
      { name: "Drain Unblock", icon: Shower, price: 40, color: { bg: "bg-muted", color: "text-foreground" } },
      { name: "Sealant Refresh", icon: Drop, price: 35, color: { bg: "bg-muted", color: "text-foreground" } },
    ],
  },
  {
    id: "safety-check",
    name: "Home Safety",
    tagline: "Peace of mind package",
    icon: ShieldCheck,
    iconColor: { bg: "bg-emerald-100", color: "text-emerald-500" },
    savings: "Save €40",
    totalPrice: 199,
    services: [
      { name: "Smoke Detector Install", icon: Fire, price: 45, color: { bg: "bg-muted", color: "text-foreground" } },
      { name: "Electrical Inspection", icon: Lightning, price: 85, color: { bg: "bg-muted", color: "text-foreground" } },
      { name: "Gas Safety Check", icon: Fire, price: 65, color: { bg: "bg-muted", color: "text-foreground" } },
      { name: "Lock Security Upgrade", icon: Lock, price: 55, color: { bg: "bg-muted", color: "text-foreground" } },
    ],
  },
];

const ServiceBundles = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4">
      <HorizontalScroll
        title={
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground font-heading">Bundles</h3>
          </div>
        }
      >
      {bundles.map((bundle) => {
        const BundleIcon = bundle.icon;
        return (
          <button
            key={bundle.id}
            onClick={() => navigate(`/bundles/${bundle.id}`)}
            className="flex w-[260px] shrink-0 flex-col rounded-2xl bg-card card-shadow overflow-hidden text-left transition-all active:scale-[0.97]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/40 px-4 pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/40 bg-opacity-40">
                  <BundleIcon size={22} weight="regular" className={bundle.iconColor.color} />
                </div>
                <span className="rounded-full bg-gradient-to-r from-emerald-500 to-green-400 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm shadow-emerald-500/30">
                  {bundle.savings}
                </span>
              </div>
              <h4 className="mt-2 text-sm font-bold text-foreground">{bundle.name}</h4>
              <p className="text-[10px] text-muted-foreground">{bundle.tagline}</p>
            </div>

            {/* Services list */}
            <div className="flex flex-col gap-1.5 px-4 py-3">
              {bundle.services.map((svc, i) => {
                const SvcIcon = svc.icon;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`flex h-5 w-5 items-center justify-center rounded ${svc.color.bg}`}>
                      <SvcIcon size={12} weight="duotone" className={svc.color.color} />
                    </div>
                    <span className="flex-1 text-[11px] text-foreground">{svc.name}</span>
                    <span className="text-[10px] text-muted-foreground">€{svc.price}</span>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between border-t border-border px-4 py-3">
              <div>
                <span className="text-base font-extrabold text-primary">€{bundle.totalPrice}</span>
                <span className="ml-1 text-[10px] text-muted-foreground line-through">
                  €{bundle.services.reduce((a, s) => a + s.price, 0)}
                </span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-primary">
                Book Bundle <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </button>
        );
      })}
      </HorizontalScroll>
    </div>
  );
};

export { bundles };
export default ServiceBundles;
