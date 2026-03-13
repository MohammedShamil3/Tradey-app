import { useNavigate } from "react-router-dom";
import { Wrench, Plug, PaintBrush, Hammer, Broom, Snowflake, Lightning, Drop } from "@phosphor-icons/react";
import HorizontalScroll from "@/components/ui/HorizontalScroll";
import { categoryColorMap } from "@/lib/icons";
import type { Icon } from "@phosphor-icons/react";

const services: { id: string; label: string; icon: Icon }[] = [
  { id: "plumbing", label: "Plumbing", icon: Drop },
  { id: "electrical", label: "Electrical", icon: Plug },
  { id: "painting", label: "Painting", icon: PaintBrush },
  { id: "carpentry", label: "Carpentry", icon: Hammer },
  { id: "cleaning", label: "Cleaning", icon: Broom },
  { id: "hvac", label: "HVAC", icon: Snowflake },
];

const ServiceTabs = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4">
      <HorizontalScroll
        title={<h3 className="text-lg font-bold text-foreground">Our Services</h3>}
        subtitle="Browse by trade category"
        className="gap-2 pb-1"
      >
        {services.map(({ id, label, icon: Icon }) => {
          const colors = categoryColorMap[id];
          return (
            <button
              key={id}
              onClick={() => navigate(`/categories/${id}`)}
              className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all bg-card text-foreground card-shadow active:scale-95"
              style={{ scrollSnapAlign: "start" }}
            >
              <Icon size={16} weight="regular" className={colors?.color || "text-muted-foreground"} />
              {label}
            </button>
          );
        })}
      </HorizontalScroll>
      <div className="mt-3 flex justify-center">
        <button onClick={() => navigate("/categories")} className="text-sm font-semibold text-primary">
          View all services →
        </button>
      </div>
    </div>
  );
};

export default ServiceTabs;
