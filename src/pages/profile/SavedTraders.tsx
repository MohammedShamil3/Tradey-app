import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, Heart, Star, MapPin, BadgeCheck, HeartOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { traders } from "@/data/services";
import { toast } from "@/components/ui/use-toast";

import provider1 from "@/assets/provider-1.jpg";
import provider2 from "@/assets/provider-2.jpg";
import provider3 from "@/assets/provider-3.jpg";

// Demo image lookup
const traderImages: Record<string, string> = {
  t1: provider1,
  t2: provider2,
  t3: provider3,
};

const SavedTraders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("saved_traders")
      .select("trader_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const ids = (data || []).map((d: any) => d.trader_id);
        setSavedIds(ids);
        setLoading(false);
        // Show demo data when no real saved traders
        if (ids.length === 0) setShowDemo(true);
      });
  }, [user]);

  const displayTraders = showDemo && savedIds.length === 0
    ? traders.slice(0, 3) // demo data
    : traders.filter((t) => savedIds.includes(t.id));

  const handleUnsave = async (traderId: string) => {
    if (showDemo && savedIds.length === 0) {
      // Demo mode - just show toast
      toast({ title: "Demo mode", description: "Sign in and save traders to manage your list." });
      return;
    }
    if (!user) return;
    await supabase.from("saved_traders").delete().eq("user_id", user.id).eq("trader_id", traderId);
    setSavedIds((prev) => prev.filter((id) => id !== traderId));
    toast({ title: "Removed", description: "Trader removed from your saved list." });
  };

  const isEmpty = !loading && savedIds.length === 0 && !showDemo;

  return (
    <MobileLayout>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground font-heading">Saved Traders</h1>
        </div>
        {savedIds.length === 0 && (
          <button
            onClick={() => setShowDemo((p) => !p)}
            className="text-[11px] font-semibold text-primary"
          >
            {showDemo ? "Hide demo" : "Show demo"}
          </button>
        )}
      </div>

      <div className="px-4 py-5">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground font-heading">No saved traders yet</h2>
            <p className="text-sm text-muted-foreground max-w-[260px] leading-relaxed">
              When you find a trader you like, tap the heart icon to save them here for easy access later.
            </p>
            <button
              onClick={() => navigate("/services")}
              className="mt-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
            >
              Browse Services
            </button>
          </div>
        ) : (
          /* Traders list */
          <div className="flex flex-col gap-3">
            {showDemo && savedIds.length === 0 && (
              <div className="rounded-xl bg-accent/50 px-3 py-2 mb-1">
                <p className="text-[11px] text-muted-foreground text-center">
                  ✨ Showing demo traders — save real traders to see them here
                </p>
              </div>
            )}

            {displayTraders.map((trader) => {
              const image = traderImages[trader.id];
              return (
                <div
                  key={trader.id}
                  className="flex overflow-hidden rounded-2xl bg-card card-shadow"
                >
                  <button
                    onClick={() => navigate(`/traders/${trader.id}`)}
                    className="flex flex-1 items-center gap-3 p-3 text-left"
                  >
                    {/* Avatar */}
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {image ? (
                        <img src={image} alt={trader.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent text-lg font-bold text-primary">
                          {trader.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-semibold text-foreground font-sans truncate">{trader.name}</h3>
                        {trader.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                          <Star className="h-3 w-3 fill-star text-star" />
                          {trader.rating} ({trader.reviews})
                        </span>
                        <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {trader.location}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {trader.specialties.slice(0, 2).map((s) => (
                          <span key={s} className="rounded-full bg-accent px-2 py-0.5 text-[9px] font-semibold text-accent-foreground capitalize">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>

                  {/* Unsave button */}
                  <button
                    onClick={() => handleUnsave(trader.id)}
                    className="flex w-14 shrink-0 items-center justify-center border-l border-border active:bg-muted/60 transition-colors"
                  >
                    <HeartOff className="h-5 w-5 text-destructive" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default SavedTraders;
