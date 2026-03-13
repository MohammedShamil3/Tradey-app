import MobileLayout from "@/components/layout/MobileLayout";
import { useNavigate, useParams } from "react-router-dom";
import { traders, getServicesByCategory, serviceCategories } from "@/data/services";
import {
  ArrowLeft,
  Star,
  BadgeCheck,
  Tag,
  Clock,
  ChevronRight,
} from "lucide-react";
import Avatar from "boring-avatars";

const avatarPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];

const TraderServices = () => {
  const { traderId } = useParams();
  const navigate = useNavigate();
  const trader = traders.find((t) => t.id === traderId);

  if (!trader) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center px-4 pt-20 text-center">
          <p className="text-lg font-bold text-foreground">Trader not found</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm font-semibold text-primary">
            Go back
          </button>
        </div>
      </MobileLayout>
    );
  }

  const traderServices = trader.specialties.flatMap((s) => getServicesByCategory(s));
  const catAServices = traderServices.filter((s) => s.category === "catA");
  const catBServices = traderServices.filter((s) => s.category === "catB");

  const handleServiceSelect = (serviceId: string, category: "catA" | "catB") => {
    if (category === "catA") {
      navigate(`/services/${serviceId}/book?trader=${trader.id}`);
    } else {
      navigate(`/jobs/post?service=${serviceId}&trader=${trader.id}`);
    }
  };

  return (
    <MobileLayout>
      <div className="pb-6">
        {/* Header */}
        <div className="px-4 pt-6">
          <div className="mb-5 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground font-heading">Book {trader.name.split(" ")[0]}</h1>
              <p className="text-xs text-muted-foreground">Choose a service to get started</p>
            </div>
          </div>

          {/* Trader mini card */}
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-card p-4 card-shadow">
            <div className="shrink-0 rounded-xl overflow-hidden">
              <Avatar size={56} name={trader.name} variant="beam" colors={avatarPalette} square />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-foreground">{trader.name}</h3>
                {trader.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-star text-star" />
                  {trader.rating}
                </span>
                <span>•</span>
                <span>{trader.reviews} reviews</span>
                <span>•</span>
                <span>{trader.experience}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category A - Bookable services */}
        {catAServices.length > 0 && (
          <div className="px-4">
            <h2 className="mb-3 text-sm font-bold text-foreground uppercase tracking-wider">
              Book Instantly
            </h2>
            <div className="flex flex-col gap-2">
              {catAServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id, "catA")}
                  className="flex items-center gap-3 rounded-2xl bg-card p-4 card-shadow transition-all active:scale-[0.98]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-xl">
                    {service.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-sm font-bold text-foreground">{service.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{service.description}</p>
                    {service.duration && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {service.duration}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {service.price && (
                      <span className="text-sm font-extrabold text-primary">£{service.price}</span>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category B - Quote services */}
        {catBServices.length > 0 && (
          <div className="mt-6 px-4">
            <h2 className="mb-3 text-sm font-bold text-foreground uppercase tracking-wider">
              Request a Quote
            </h2>
            <div className="flex flex-col gap-2">
              {catBServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id, "catB")}
                  className="flex items-center gap-3 rounded-2xl bg-card p-4 card-shadow transition-all active:scale-[0.98]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-xl">
                    {service.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-sm font-bold text-foreground">{service.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{service.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                      <Tag className="mr-1 inline h-3 w-3" />
                      Quote
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {traderServices.length === 0 && (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">No services available for this trader.</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default TraderServices;
