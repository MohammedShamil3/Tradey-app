import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import HorizontalScroll from "@/components/ui/HorizontalScroll";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

import provider1 from "@/assets/provider-1.jpg";
import provider2 from "@/assets/provider-2.jpg";
import provider3 from "@/assets/provider-3.jpg";

// Mock trader data lookup (in a real app this would come from the DB)
const traderData: Record<string, { name: string; image: string; rating: number; reviews: number; specialty: string }> = {
  t1: { name: "John Smith", image: provider1, rating: 4.9, reviews: 200, specialty: "Plumbing" },
  t2: { name: "Sophie Baker", image: provider2, rating: 4.8, reviews: 156, specialty: "Electrical" },
  t3: { name: "Peter Jensen", image: provider3, rating: 4.7, reviews: 98, specialty: "Painting" },
};

const SavedTradersList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchSaved = async () => {
      const { data } = await supabase
        .from("saved_traders")
        .select("trader_id")
        .eq("user_id", user.id);
      if (data) setSavedIds(data.map((d) => d.trader_id));
    };
    fetchSaved();
  }, [user]);

  // Merge saved IDs with trader data
  const traders = savedIds
    .map((id) => (traderData[id] ? { id, ...traderData[id] } : null))
    .filter(Boolean) as { id: string; name: string; image: string; rating: number; reviews: number; specialty: string }[];

  if (traders.length === 0) return null;

  return (
    <div className="px-4">
      <HorizontalScroll
        title={
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-destructive" />
            <h3 className="text-lg font-bold text-foreground font-heading">Your Saved Traders</h3>
          </div>
        }
        trailing={
          <button
            onClick={() => navigate("/profile/favourites")}
            className="mr-2 text-xs font-semibold text-primary"
          >
            View all
          </button>
        }
      >
        {traders.map((t) => (
          <button
            key={t.id}
            onClick={() => navigate(`/traders/${t.id}`)}
            className="flex w-[160px] shrink-0 flex-col overflow-hidden rounded-2xl bg-card card-shadow transition-all active:scale-[0.97]"
          >
            <div className="relative h-32 overflow-hidden">
              <img src={t.image} alt={t.name} className="h-full w-full object-cover" />
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-card/90 px-2 py-0.5 backdrop-blur-sm">
                <Star className="h-3 w-3 fill-star text-star" />
                <span className="text-[10px] font-bold text-foreground">{t.rating}</span>
              </div>
            </div>
            <div className="p-2.5">
              <h4 className="text-sm font-semibold text-foreground font-sans">{t.name}</h4>
              <p className="text-[10px] text-muted-foreground">{t.specialty}</p>
            </div>
          </button>
        ))}
      </HorizontalScroll>
    </div>
  );
};

export default SavedTradersList;
