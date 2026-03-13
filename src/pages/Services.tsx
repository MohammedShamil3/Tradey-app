import MobileLayout from "@/components/layout/MobileLayout";
import ServiceBundles from "@/components/home/ServiceBundles";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { catAServices, catBServices, serviceCategories } from "@/data/services";
import { ArrowRight, Search, X, Star, ChevronDown, Briefcase } from "lucide-react";
import { Lightning, Clock, Package } from "@phosphor-icons/react";
import { serviceIconMap, iconMap, getServiceColors, categoryIconMap, categoryColorMap } from "@/lib/icons";

const Services = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeTab, setActiveTab] = useState<"catA" | "catB" | "bundles">("catA");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [expandedCatA, setExpandedCatA] = useState(false);
  const [expandedCatB, setExpandedCatB] = useState(false);
  const INITIAL_COUNT = 4;

  const filterServices = <T extends { name: string; description: string }>(services: T[]) => {
    if (!searchQuery.trim()) return services;
    const q = searchQuery.toLowerCase();
    return services.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  };

  const categoryFilteredCatA = activeCategory === "all" ? catAServices : catAServices.filter(s => s.categoryId === activeCategory);
  const categoryFilteredCatB = activeCategory === "all" ? catBServices : catBServices.filter(s => s.categoryId === activeCategory);
  const filteredCatA = filterServices(categoryFilteredCatA);
  const filteredCatB = filterServices(categoryFilteredCatB);
  const allResults = filteredCatA.length + filteredCatB.length;

  const clearSearch = () => {
    setSearchQuery("");
    searchParams.delete("search");
    setSearchParams(searchParams);
  };

  const renderCatACard = (service: typeof catAServices[0]) => {
    const iconName = serviceIconMap[service.id] || "wrench";
    const IconComponent = iconMap[iconName];
    const colors = getServiceColors(service.id);
    return (
      <button
        key={service.id}
        onClick={() => navigate(`/services/${service.id}`)}
        className="group flex w-full flex-col overflow-hidden rounded-2xl bg-card card-shadow transition-all hover:card-shadow-hover active:scale-[0.98] text-left"
      >
        <div className="flex items-start gap-3 p-4 pb-2">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.bg} bg-opacity-40`}>
            <IconComponent size={24} weight="duotone" className={colors.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-semibold text-foreground font-sans truncate">{service.name}</h3>
              {service.popular && (
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                  Popular
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{service.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border mx-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-primary">£{service.price}</span>
            <span className="h-3.5 w-px bg-border" />
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock size={12} />
              {service.duration}
            </span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
        </div>
      </button>
    );
  };

  const renderCatBCard = (service: typeof catBServices[0]) => {
    const iconName = serviceIconMap[service.id] || "wrench";
    const IconComponent = iconMap[iconName];
    const colors = getServiceColors(service.id);
    return (
      <button
        key={service.id}
        onClick={() => navigate(`/services/${service.id}`)}
        className="group flex w-full flex-col overflow-hidden rounded-2xl bg-card card-shadow transition-all hover:card-shadow-hover active:scale-[0.98] text-left"
      >
        <div className="flex items-start gap-3 p-4 pb-2">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.bg} bg-opacity-40`}>
            <IconComponent size={24} weight="duotone" className={colors.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-semibold text-foreground font-sans truncate">{service.name}</h3>
              {service.popular && (
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                  Popular
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{service.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border mx-4 py-2.5">
          <span className="text-sm font-bold text-primary">{service.priceLabel}</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
        </div>
      </button>
    );
  };

  return (
    <MobileLayout>
      {/* Sticky header area */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md pb-1">
        <div className="px-4 pt-6">
          <h1 className="mb-1 text-2xl font-extrabold text-foreground font-heading">Services</h1>
          <p className="mb-5 text-sm text-muted-foreground">Choose a service to get started</p>

          {/* Search bar */}
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-card px-4 py-3 card-shadow">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
            />
            {searchQuery && (
              <button onClick={clearSearch}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Category / Tab toggle (hide when searching) */}
        {!searchQuery.trim() && (
          <div className="px-4">
            <div className="mb-3 flex gap-2 rounded-xl bg-muted p-1">
              <button
                onClick={() => setActiveTab("catA")}
                className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition-all ${
                  activeTab === "catA" ? "bg-card text-foreground card-shadow" : "text-muted-foreground"
                }`}
              >
                <Lightning size={14} weight="bold" className="mr-1 inline" />
                Quick Jobs
              </button>
              <button
                onClick={() => setActiveTab("catB")}
                className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition-all ${
                  activeTab === "catB" ? "bg-card text-foreground card-shadow" : "text-muted-foreground"
                }`}
              >
                <Clock size={14} weight="bold" className="mr-1 inline" />
                Large Projects
              </button>
              <button
                onClick={() => setActiveTab("bundles")}
                className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition-all ${
                  activeTab === "bundles" ? "bg-card text-foreground card-shadow" : "text-muted-foreground"
                }`}
              >
                <Package size={14} weight="bold" className="mr-1 inline" />
                Bundles
              </button>
            </div>

            {activeTab !== "bundles" && (
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {serviceCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeCategory === cat.id
                        ? "bg-primary text-primary-foreground chip-active-shadow"
                        : "bg-card text-foreground card-shadow"
                    }`}
                  >
                    {(() => {
                      const iconName = categoryIconMap[cat.id] || "wrench";
                      const CatIcon = iconMap[iconName];
                      const colors = categoryColorMap[cat.id];
                      return CatIcon ? (
                        <CatIcon size={14} weight="regular" className={activeCategory === cat.id ? "text-primary-foreground" : (colors?.color || "text-muted-foreground")} />
                      ) : (
                        <span>{cat.emoji}</span>
                      );
                    })()}
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pt-2">
        {/* Show search results count when searching */}
        {searchQuery.trim() && (
          <p className="mb-4 text-sm text-muted-foreground">
            {allResults} result{allResults !== 1 ? "s" : ""} for "<span className="font-semibold text-foreground">{searchQuery}</span>"
          </p>
        )}

        {/* Service list */}
        {searchQuery.trim() ? (
          <div className="flex flex-col gap-3">
            {filteredCatA.map(renderCatACard)}
            {filteredCatB.map(renderCatBCard)}
            {allResults === 0 && (
              <div className="flex flex-col items-center py-12 text-center">
                <Search className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="font-bold text-foreground">No services found</p>
                <p className="text-sm text-muted-foreground">Try a different search term</p>
              </div>
            )}
          </div>
        ) : activeTab === "catA" ? (
          <div className="relative">
            <div className="flex flex-col gap-3">
              {(expandedCatA ? categoryFilteredCatA : categoryFilteredCatA.slice(0, INITIAL_COUNT)).map(renderCatACard)}
            </div>
            {!expandedCatA && categoryFilteredCatA.length > INITIAL_COUNT && (
              <div className="relative -mt-16 pt-16">
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                <button
                  onClick={() => setExpandedCatA(true)}
                  className="relative z-10 flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground card-shadow transition-transform active:scale-[0.98]"
                >
                  View {categoryFilteredCatA.length - INITIAL_COUNT} more
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            )}
          </div>
        ) : activeTab === "catB" ? (
          <div>
            <div className="relative">
              <div className="flex flex-col gap-3">
                {(expandedCatB ? categoryFilteredCatB : categoryFilteredCatB.slice(0, INITIAL_COUNT)).map(renderCatBCard)}
              </div>
              {!expandedCatB && categoryFilteredCatB.length > INITIAL_COUNT && (
                <div className="relative -mt-16 pt-16">
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                  <button
                    onClick={() => setExpandedCatB(true)}
                    className="relative z-10 flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground card-shadow transition-transform active:scale-[0.98]"
                  >
                    View {categoryFilteredCatB.length - INITIAL_COUNT} more
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 text-center">
              <h3 className="mb-1 font-bold text-foreground">Can't find what you need?</h3>
              <p className="mb-3 text-xs text-muted-foreground">
                Post a custom job and receive quotes from verified tradesmen
              </p>
              <button
                onClick={() => navigate("/jobs/post")}
                className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
              >
                Post a Job
              </button>
            </div>
          </div>
        ) : (
          /* Bundles tab */
          <div className="-mx-4">
            <ServiceBundles />
          </div>
        )}

        {/* Post a job promo */}
        {!searchQuery.trim() && (
          <div className="mt-6 mb-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 card-shadow">
              <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-primary-foreground/10" />
              <div className="absolute -bottom-4 -right-2 h-20 w-20 rounded-full bg-primary-foreground/5" />
              <div className="relative z-10">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">
                  <Briefcase className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-1 text-lg font-bold text-primary-foreground font-heading">
                  Got a bigger project?
                </h3>
                <p className="mb-4 text-sm text-primary-foreground/80">
                  Post a job and receive quotes from verified tradesmen in your area. Compare prices and pick the best fit.
                </p>
                <button
                  onClick={() => navigate("/jobs/post")}
                  className="flex items-center gap-2 rounded-xl bg-primary-foreground px-5 py-2.5 text-sm font-bold text-primary transition-transform active:scale-95"
                >
                  Post a Job <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Services;
