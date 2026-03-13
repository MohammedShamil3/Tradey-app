import MobileLayout from "@/components/layout/MobileLayout";
import { useNavigate, useParams } from "react-router-dom";
import { traders, getServicesByCategory, serviceCategories } from "@/data/services";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  ArrowLeft, Star, BadgeCheck, MapPin, Clock, Phone, MessageCircle,
  ChevronRight, Shield, Award, ThumbsUp, Heart,
} from "lucide-react";
import { categoryIconMap, categoryColorMap, iconMap } from "@/lib/icons";
import Avatar from "boring-avatars";

const avatarPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];

const mockReviews = [
  { id: "r1", author: "Emily R.", rating: 5, date: "2 weeks ago", text: "Absolutely brilliant work. Arrived on time, kept everything tidy, and the result was perfect. Would highly recommend!", avatar: "E" },
  { id: "r2", author: "Mark T.", rating: 5, date: "1 month ago", text: "Very professional and knowledgeable. Explained everything clearly and the price was fair. Will definitely use again.", avatar: "M" },
  { id: "r3", author: "Sarah L.", rating: 4, date: "1 month ago", text: "Good job overall, completed within the estimated time. Minor touch-up needed but came back promptly to fix it.", avatar: "S" },
  { id: "r4", author: "David K.", rating: 5, date: "2 months ago", text: "Outstanding quality of work. You can tell they take real pride in what they do. Five stars!", avatar: "D" },
  { id: "r5", author: "Hannah P.", rating: 4, date: "3 months ago", text: "Reliable and friendly. Did a great job on our kitchen. Only small delay due to parts but communicated well.", avatar: "H" },
];


const TraderProfile = () => {
  const { traderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const trader = traders.find((t) => t.id === traderId);
  const [isSaved, setIsSaved] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);

  useEffect(() => {
    if (!user || !traderId) return;
    supabase
      .from("saved_traders")
      .select("id")
      .eq("user_id", user.id)
      .eq("trader_id", traderId)
      .maybeSingle()
      .then(({ data }) => setIsSaved(!!data));
  }, [user, traderId]);

  const toggleSave = async () => {
    if (!user || !traderId || savingToggle) return;
    setSavingToggle(true);
    if (isSaved) {
      await supabase.from("saved_traders").delete().eq("user_id", user.id).eq("trader_id", traderId);
      setIsSaved(false);
      toast({ title: "Removed", description: "Trader removed from saved list." });
    } else {
      await supabase.from("saved_traders").insert({ user_id: user.id, trader_id: traderId });
      setIsSaved(true);
      toast({ title: "Saved!", description: "Trader added to your saved list." });
    }
    setSavingToggle(false);
  };

  if (!trader) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center px-4 pt-20 text-center">
          <p className="text-lg font-bold text-foreground">Trader not found</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm font-semibold text-primary">Go back</button>
        </div>
      </MobileLayout>
    );
  }

  const colorIdx = trader.id.charCodeAt(1) % 3;
  const traderServices = trader.specialties.flatMap((s) => getServicesByCategory(s));
  const traderCategories = trader.specialties
    .map((s) => serviceCategories.find((c) => c.id === s))
    .filter(Boolean);

  const completionRate = 95 + (trader.id.charCodeAt(1) % 5);
  const responseTime = trader.id.charCodeAt(1) % 3 === 0 ? "< 1 hour" : "< 30 min";
  const jobsCompleted = trader.reviews * 2 + Math.floor(trader.rating * 10);
  const traderReviews = mockReviews.slice(0, 3 + (trader.id.charCodeAt(1) % 3));
  const ratingDistribution = [
    { stars: 5, pct: 72 + (trader.id.charCodeAt(1) % 10) },
    { stars: 4, pct: 15 },
    { stars: 3, pct: 8 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 2 },
  ];

  return (
    <MobileLayout>
      <div className="pb-24">
        {/* Header with back button */}
        <div className="relative">
          <div className="h-36 bg-gradient-to-br from-primary/30 to-accent/50 relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={toggleSave}
              disabled={savingToggle}
              className="absolute right-4 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-transform active:scale-90"
            >
              <Heart className={`h-5 w-5 ${isSaved ? "fill-destructive text-destructive" : "text-foreground"}`} />
            </button>
          </div>

          <div className="relative -mt-12 px-4">
            <div className="rounded-2xl border-4 border-background shadow-lg overflow-hidden w-24 h-24">
              <Avatar size={88} name={trader.name} variant="beam" colors={avatarPalette} square />
            </div>
          </div>
        </div>

        <div className="mt-3 px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-foreground font-heading">{trader.name}</h1>
            {trader.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{trader.location}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{trader.experience}</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-star text-star" />
              <span className="text-lg font-extrabold text-foreground">{trader.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">({trader.reviews} reviews)</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {traderCategories.map(
              (cat) =>
                cat && (
                  <span key={cat.id} className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {(() => {
                      const iconName = categoryIconMap[cat.id] || "wrench";
                      const CatIcon = iconMap[iconName];
                      const colors = categoryColorMap[cat.id];
                      return CatIcon ? <CatIcon size={12} weight="regular" className={colors?.color || "text-muted-foreground"} /> : null;
                    })()}
                    {cat.label}
                  </span>
                )
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex gap-3 px-4">
          <button
            onClick={() => navigate("/chat")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />Message
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-card py-3 text-sm font-bold text-foreground card-shadow transition-transform active:scale-95">
            <Phone className="h-4 w-4" />Call
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3 px-4">
          <div className="flex flex-col items-center rounded-2xl bg-card p-3 card-shadow">
            <Award className="mb-1 h-5 w-5 text-primary" />
            <span className="text-lg font-extrabold text-foreground">{jobsCompleted}</span>
            <span className="text-[10px] text-muted-foreground">Jobs Done</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-card p-3 card-shadow">
            <ThumbsUp className="mb-1 h-5 w-5 text-primary" />
            <span className="text-lg font-extrabold text-foreground">{completionRate}%</span>
            <span className="text-[10px] text-muted-foreground">Completion</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-card p-3 card-shadow">
            <Clock className="mb-1 h-5 w-5 text-primary" />
            <span className="text-sm font-extrabold text-foreground">{responseTime}</span>
            <span className="text-[10px] text-muted-foreground">Response</span>
          </div>
        </div>

        {/* Verified badges */}
        {trader.verified && (
          <div className="mx-4 mt-5 flex items-center gap-3 rounded-2xl bg-primary/5 p-4">
            <Shield className="h-8 w-8 shrink-0 text-primary" />
            <div>
              <h4 className="text-sm font-bold text-foreground">Verified Professional</h4>
              <p className="text-xs text-muted-foreground">ID verified • Background checked • Insurance confirmed</p>
            </div>
          </div>
        )}

        {/* Services offered */}
        <div className="mt-6 px-4">
          <h3 className="mb-3 text-base font-bold text-foreground font-heading">Services Offered</h3>
          <div className="flex flex-col gap-2">
            {traderServices.slice(0, 6).map((service) => (
              <button
                key={service.id}
                onClick={() => navigate(`/services/${service.id}`)}
                className="flex items-center gap-3 rounded-2xl bg-card p-3 card-shadow transition-all active:scale-[0.98]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-xl">{service.icon}</div>
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-bold text-foreground">{service.name}</h4>
                  <p className="text-xs text-muted-foreground">{service.description}</p>
                </div>
                <div className="text-right">
                  {service.price ? (
                    <span className="text-sm font-bold text-primary">£{service.price}</span>
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground">Quote</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-6 px-4">
          <h3 className="mb-3 text-base font-bold text-foreground font-heading">Customer Reviews</h3>

          <div className="mb-4 rounded-2xl bg-card p-4 card-shadow">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-foreground">{trader.rating}</div>
                <div className="mt-1 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(trader.rating) ? "fill-star text-star" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{trader.reviews} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {ratingDistribution.map((row) => (
                  <div key={row.stars} className="flex items-center gap-2">
                    <span className="w-3 text-right text-xs text-muted-foreground">{row.stars}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-star" style={{ width: `${Math.min(row.pct, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {traderReviews.map((review) => (
              <div key={review.id} className="rounded-2xl bg-card p-4 card-shadow">
                <div className="flex items-center gap-3">
                  <div className="shrink-0"><Avatar size={36} name={review.author} variant="beam" colors={avatarPalette} /></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground">{review.author}</h4>
                    <p className="text-[10px] text-muted-foreground">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-star text-star" />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{review.text}</p>
              </div>
            ))}
          </div>

          <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-card py-3 text-sm font-semibold text-primary card-shadow transition-all active:scale-[0.98]">
            See All {trader.reviews} Reviews
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Sticky Book CTA */}
      <div className="sticky bottom-[76px] z-10 bg-background/95 backdrop-blur-md border-t border-border/50 px-4 py-3">
        <button
          onClick={() => navigate(`/traders/${trader.id}/services`)}
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
        >
          Book {trader.name.split(" ")[0]}
        </button>
      </div>
    </MobileLayout>
  );
};

export default TraderProfile;
