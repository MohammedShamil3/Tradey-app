import MobileLayout from "@/components/layout/MobileLayout";
import ProviderCard from "@/components/home/ProviderCard";
import HorizontalScroll from "@/components/ui/HorizontalScroll";
import { useNavigate, useParams } from "react-router-dom";
import { serviceCategories, getServicesByCategory, getTradersByCategory } from "@/data/services";
import { categoryImages } from "@/data/categoryImages";
import { ArrowLeft, Star, Users } from "lucide-react";
import { ShieldCheck, CheckCircle, Lightning, Clock } from "@phosphor-icons/react";
import { getCategoryIcon, serviceIconMap, iconMap, getServiceColors } from "@/lib/icons";
import provider1 from "@/assets/provider-1.jpg";
import provider2 from "@/assets/provider-2.jpg";
import provider3 from "@/assets/provider-3.jpg";

const traderImages: Record<string, string> = {
  t1: provider1, t2: provider2, t3: provider3,
  t4: provider1, t5: provider2, t6: provider3,
  t7: provider1, t8: provider2, t9: provider3, t10: provider1
};

const CategoryDetail = () => {
  const { categoryId } = useParams<{categoryId: string;}>();
  const navigate = useNavigate();
  const category = serviceCategories.find((c) => c.id === categoryId);
  const services = getServicesByCategory(categoryId || "");
  const traders = getTradersByCategory(categoryId || "");
  const quickJobs = services.filter((s) => s.category === "catA");
  const largeProjects = services.filter((s) => s.category === "catB");
  const heroImage = categoryImages[categoryId || ""];
  const avgRating = traders.length ?
  (traders.reduce((sum, t) => sum + t.rating, 0) / traders.length).toFixed(1) :
  "4.8";

  if (!category) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <p className="text-lg font-bold text-foreground">Category not found</p>
          <button onClick={() => navigate("/categories")} className="mt-4 text-sm font-semibold text-primary">
            Back to categories
          </button>
        </div>
      </MobileLayout>);

  }

  return (
    <MobileLayout>
      <div className="pb-6">
        {/* Hero Banner */}
        <div className="relative h-52 overflow-hidden">
          {heroImage &&
          <img src={heroImage} alt={category.label} className="h-full w-full object-cover" />
          }
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 rounded-full bg-card/80 p-2 backdrop-blur-sm">
            
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              {(() => {
                const CategoryIcon = getCategoryIcon(categoryId || "");
                return <CategoryIcon size={28} weight="fill" className="text-card" />;
              })()}
              <h1 className="text-2xl font-extrabold text-card font-heading">
                {category.label}
              </h1>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-card/80">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-star text-star" />
                {avgRating} avg rating
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {traders.length} traders
              </span>
              <span className="flex items-center gap-1">
                <Lightning size={12} weight="fill" />
                {services.length} services
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5 flex flex-col gap-6">
          {/* Trust badges */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
            <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-card border border-border px-3 py-2 text-[11px] font-semibold text-foreground card-shadow">
              <ShieldCheck size={14} weight="duotone" className="text-primary" />
              Verified Pros
            </div>
            <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-card border border-border px-3 py-2 text-[11px] font-semibold text-foreground card-shadow">
              <CheckCircle size={14} weight="duotone" className="text-primary" />
              Insured Work
            </div>
            <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-card border border-border px-3 py-2 text-[11px] font-semibold text-foreground card-shadow">
              <Star className="h-3.5 w-3.5 text-star fill-star" />
              Top Rated
            </div>
          </div>

          {/* About */}
          <div>
            <h2 className="mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">About</h2>
            <p className="text-sm leading-relaxed text-foreground">{category.description}</p>
          </div>

          {/* Quick Jobs - Grid */}
          {quickJobs.length > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                    <Lightning size={16} weight="duotone" className="text-primary" />
                  </div>
                  <h2 className="text-base font-bold text-foreground">Quick Jobs</h2>
                </div>
                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">Fixed Price</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {quickJobs.map((service) => {
                  const iconName = serviceIconMap[service.id] || "wrench";
                  const IconComponent = iconMap[iconName];
                  const colors = getServiceColors(service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => navigate(`/services/${service.id}`)}
                      className="flex flex-col items-start rounded-2xl bg-card p-3.5 card-shadow transition-all hover:card-shadow-hover active:scale-[0.97] text-left"
                    >
                      <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg} bg-opacity-40`}>
                        <IconComponent size={22} weight="duotone" className={colors.color} />
                      </div>
                      <h4 className="font-bold text-foreground leading-tight text-[13px]">{service.name}</h4>
                      <p className="mt-1 text-[10px] text-muted-foreground line-clamp-2">{service.description}</p>
                      <div className="mt-auto pt-3 flex items-center justify-between w-full">
                        <span className="text-sm font-extrabold text-primary">£{service.price}</span>
                        {service.duration && (
                          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                            <Clock size={10} />
                            {service.duration}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Large Projects */}
          {largeProjects.length > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary">
                    <Clock size={16} weight="duotone" className="text-secondary-foreground" />
                  </div>
                  <h2 className="text-base font-bold text-foreground">Large Projects</h2>
                </div>
                <span className="rounded-md bg-secondary px-2.5 py-1 text-[10px] font-bold text-secondary-foreground">Custom Quote</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {largeProjects.map((service) => {
                  const iconName = serviceIconMap[service.id] || "wrench";
                  const IconComponent = iconMap[iconName];
                  const colors = getServiceColors(service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => navigate(`/services/${service.id}`)}
                      className="flex items-center gap-3 rounded-2xl bg-card p-4 card-shadow transition-all hover:card-shadow-hover active:scale-[0.97] text-left"
                    >
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors.bg} bg-opacity-40`}>
                        <IconComponent size={24} weight="duotone" className={colors.color} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-foreground">{service.name}</h4>
                        <p className="mt-0.5 text-xs text-muted-foreground">{service.description}</p>
                      </div>
                      <span className="text-xs font-bold text-primary shrink-0">Get Quote →</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => navigate(quickJobs.length > 0 ? `/services/${quickJobs[0].id}/book` : "/jobs/post")}
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95 card-shadow"
          >
            {quickJobs.length > 0 ? "Book a Service" : "Request a Quote"}
          </button>

          {/* Top Traders */}
          {traders.length > 0 && (
            <HorizontalScroll
              title={
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground">Top {category.label} Traders</h2>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{traders.length}</span>
                </div>
              }
              subtitle="Verified professionals ready to help"
            >
              {traders.map((trader) => (
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
          )}

          {/* Post Job CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent/30 border border-primary/20 p-5 text-center">
            <h3 className="mb-1 text-base font-bold text-foreground">Need something specific?</h3>
            <p className="mb-4 text-xs text-muted-foreground leading-relaxed">
              Post a custom job and get quotes from verified {category.label.toLowerCase()} professionals
            </p>
            <button
              onClick={() => navigate("/jobs/post")}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95 card-shadow"
            >
              Post a Job
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>);

};

export default CategoryDetail;