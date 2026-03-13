import MobileLayout from "@/components/layout/MobileLayout";
import ProviderCard from "@/components/home/ProviderCard";
import HorizontalScroll from "@/components/ui/HorizontalScroll";
import { useNavigate, useParams } from "react-router-dom";
import { getServiceById, getTradersByCategory, serviceCategories } from "@/data/services";
import { categoryImages } from "@/data/categoryImages";
import { ArrowLeft, CheckCircle2, Clock, Tag, ShieldCheck, Star, Users } from "lucide-react";
import { serviceIconMap, iconMap, getServiceColors, categoryIconMap, categoryColorMap } from "@/lib/icons";
import provider1 from "@/assets/provider-1.jpg";
import provider2 from "@/assets/provider-2.jpg";
import provider3 from "@/assets/provider-3.jpg";

const traderImages: Record<string, string> = {
  t1: provider1, t2: provider2, t3: provider3,
  t4: provider1, t5: provider2, t6: provider3,
  t7: provider1, t8: provider2, t9: provider3, t10: provider1,
};

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const service = getServiceById(serviceId || "");
  const category = service ? serviceCategories.find(c => c.id === service.categoryId) : null;
  const traders = service ? getTradersByCategory(service.categoryId) : [];
  const heroImage = service ? categoryImages[service.categoryId] : null;

  if (!service) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <p className="text-lg font-bold text-foreground">Service not found</p>
          <button onClick={() => navigate("/services")} className="mt-4 text-sm font-semibold text-primary">
            Back to services
          </button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="pb-24">
        {/* Hero */}
        <div className="relative h-44 overflow-hidden">
          {heroImage && (
            <img src={heroImage} alt={service.name} className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 rounded-full bg-card/80 p-2 backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            {category && (() => {
              const iconName = categoryIconMap[category.id] || "wrench";
              const CatIcon = iconMap[iconName];
              const colors = categoryColorMap[category.id];
              return (
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/categories/${category.id}`); }}
                  className="mb-1 inline-flex items-center gap-1 rounded-full bg-card/20 px-2 py-0.5 text-[10px] font-semibold text-card backdrop-blur-sm"
                >
                  {CatIcon && <CatIcon size={10} weight="regular" className="text-card" />} {category.label}
                </button>
              );
            })()}
            {(() => {
              const iconName = serviceIconMap[service.id] || "wrench";
              const SvcIcon = iconMap[iconName];
              return (
                <h1 className="text-xl font-extrabold text-card font-heading flex items-center gap-2">
                  <SvcIcon size={24} weight="regular" className="text-card" />
                  {service.name}
                </h1>
              );
            })()}
          </div>
        </div>

        <div className="px-4">
          {/* Price & Duration bar */}
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-accent p-3">
            {service.price && (
              <div className="flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-lg font-extrabold text-primary">£{service.price}</span>
              </div>
            )}
            {service.priceLabel && (
              <div className="flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-primary">{service.priceLabel}</span>
              </div>
            )}
            {service.duration && (
              <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{service.duration}</span>
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-3 flex gap-2">
            <div className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">
              <ShieldCheck className="h-3 w-3 text-primary" /> Verified Pros
            </div>
            <div className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">
              <Star className="h-3 w-3 text-star" /> Satisfaction Guaranteed
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <h2 className="mb-2 text-sm font-bold text-foreground uppercase tracking-wider">About This Service</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
          </div>

          {/* What's included */}
          {service.details && service.details.length > 0 && (
            <div className="mt-5">
              <h2 className="mb-2 text-sm font-bold text-foreground uppercase tracking-wider font-sans">What's Included</h2>
              <div className="rounded-2xl bg-card card-shadow overflow-hidden">
                {service.details.map((detail, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-4 py-3 ${i !== service.details!.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-foreground">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Traders */}
          {traders.length > 0 && (
            <div className="mt-6">
              <HorizontalScroll
                title={
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-foreground">Top Traders</h2>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{traders.length} available</span>
                  </div>
                }
                subtitle="Highest rated professionals for this service"
              >
                {traders.slice(0, 5).map(trader => (
                  <ProviderCard
                    key={trader.id}
                    id={trader.id}
                    name={trader.name}
                    image={traderImages[trader.id] || ""}
                    rating={trader.rating}
                    reviews={trader.reviews}
                    experience={`${trader.experience} experience`}
                  />
                ))}
              </HorizontalScroll>
            </div>
          )}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-[76px] z-10 bg-background/95 backdrop-blur-md border-t border-border/50 px-4 py-3">
        {service.category === "catA" ? (
          <button
            onClick={() => navigate(`/services/${service.id}/book`)}
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95 card-shadow"
          >
            Book Now{service.price ? ` — £${service.price}` : ""}
          </button>
        ) : (
          <button
            onClick={() => navigate(`/jobs/post?service=${service.id}`)}
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95 card-shadow"
          >
            Request a Free Quote
          </button>
        )}
      </div>
    </MobileLayout>
  );
};

export default ServiceDetail;
