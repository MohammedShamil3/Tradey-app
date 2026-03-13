import { Star, BadgeCheck, MapPin, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Trader } from "@/data/services";
import Avatar from "boring-avatars";

const avatarPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];

interface TraderCardProps {
  trader: Trader;
  compact?: boolean;
}

const TraderCard = ({ trader, compact = false }: TraderCardProps) => {
  const navigate = useNavigate();
  const firstName = trader.name.split(" ")[0];

  if (compact) {
    return (
      <div onClick={() => navigate(`/traders/${trader.id}`)} className="min-w-[150px] shrink-0 rounded-2xl bg-card p-3 card-shadow text-center cursor-pointer transition-all active:scale-95">
        <div className="mx-auto mb-2">
          <Avatar size={56} name={trader.name} variant="beam" colors={avatarPalette} />
        </div>
        <h4 className="text-sm font-bold text-foreground">{firstName}</h4>
        <div className="mt-0.5 flex items-center justify-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-star text-star" />
          <span className="font-semibold text-foreground">{trader.rating}</span>
          <span className="text-muted-foreground">({trader.reviews})</span>
        </div>
        {trader.verified && (
          <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-semibold text-primary">
            <BadgeCheck className="h-3 w-3" />
            Verified
          </div>
        )}
      </div>
    );
  }

  // Profile card style
  return (
    <div onClick={() => navigate(`/traders/${trader.id}`)} className="rounded-2xl bg-card card-shadow overflow-hidden cursor-pointer transition-all active:scale-[0.98]">
      {/* Top section with avatar and info */}
      <div className="flex items-start gap-3 p-4">
        <div className="shrink-0 rounded-xl overflow-hidden">
          <Avatar size={56} name={trader.name} variant="beam" colors={avatarPalette} square />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="truncate text-base font-bold text-foreground">{firstName}</h4>
            {trader.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{trader.location}</span>
            <span>•</span>
            <span>{trader.experience} exp</span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-star text-star" />
            <span className="text-sm font-bold text-foreground">{trader.rating}</span>
            <span className="text-xs text-muted-foreground">({trader.reviews} reviews)</span>
          </div>
        </div>
      </div>
      {/* Skills */}
      <div className="flex gap-1.5 px-4 pb-3 flex-wrap">
        {trader.specialties.map(s => (
          <span key={s} className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold text-accent-foreground capitalize">
            {s}
          </span>
        ))}
      </div>
      {/* Action */}
      <button onClick={() => navigate(`/traders/${trader.id}`)} className="flex w-full items-center justify-between border-t border-border px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-accent/50">
        View Profile
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default TraderCard;
