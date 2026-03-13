import { useState } from "react";
import { categoryIconMap, categoryColorMap, iconMap } from "@/lib/icons";

const categories = [
  { id: "all", label: "All" },
  { id: "booked", label: "Booked" },
  { id: "electricians", label: "Electricians" },
  { id: "plumbers", label: "Plumbers" },
  { id: "painters", label: "Painters" },
];

const chipIconMap: Record<string, string> = {
  all: "fire",
  booked: "package",
  electricians: "lightning",
  plumbers: "wrench",
  painters: "paintBrush",
};

const CategoryChips = () => {
  const [active, setActive] = useState("all");

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-1 no-scrollbar">
      {categories.map((cat) => {
        const iconName = chipIconMap[cat.id] || "wrench";
        const IconComponent = iconMap[iconName];
        const colors = categoryColorMap[cat.id];
        return (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              active === cat.id
                ? "bg-primary text-primary-foreground chip-active-shadow"
                : "bg-card text-foreground card-shadow"
            }`}
          >
            {IconComponent && (
              <IconComponent
                size={14}
                weight="regular"
                className={active === cat.id ? "text-primary-foreground" : (colors?.color || "text-muted-foreground")}
              />
            )}
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryChips;
