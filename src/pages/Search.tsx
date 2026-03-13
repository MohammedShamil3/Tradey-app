import MobileLayout from "@/components/layout/MobileLayout";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { catAServices, catBServices, serviceCategories } from "@/data/services";
import { Search as SearchIcon, ArrowLeft, X, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { EmojiIcon, getEmojiIconColors, categoryIconMap, categoryColorMap, iconMap, serviceIconMap, getServiceColors } from "@/lib/icons";

const recentSearches = ["Tap repair", "Painting", "Boiler service"];
const trendingTags = [
  { label: "Plumbing", categoryId: "plumbing" },
  { label: "Electrical", categoryId: "electrical" },
  { label: "Painting", categoryId: "painting" },
  { label: "Cleaning", categoryId: "cleaning" },
  { label: "HVAC", categoryId: "hvac" },
  { label: "Carpentry", categoryId: "carpentry" },
];

const allServices = [
  ...catAServices.map((s) => ({ ...s, type: "quick" as const })),
  ...catBServices.map((s) => ({ ...s, type: "project" as const })),
];

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredServices = query.trim()
    ? allServices.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const categories = serviceCategories.filter((c) => c.id !== "all");
  const filteredCategories = query.trim()
    ? categories.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : [];

  const hasResults = filteredServices.length > 0 || filteredCategories.length > 0;
  const isSearching = query.trim().length > 0;

  return (
    <MobileLayout>
      <div className="px-4 pt-6 pb-4">
        {/* Search header */}
        <div className="mb-5 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="shrink-0">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-card px-4 py-3 card-shadow">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search services, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Default state: recent + trending */}
        {!isSearching && (
          <>
            {/* Recent searches */}
            <div className="mb-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Recent Searches
              </h3>
              <div className="flex flex-col gap-1">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors active:bg-muted"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground/60" />
                    <span className="flex-1 text-sm text-foreground">{term}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40" />
                  </button>
                ))}
              </div>
            </div>

            {/* Trending / Popular tags */}
            <div className="mb-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                Trending Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => {
                  const iconName = categoryIconMap[tag.categoryId] || "wrench";
                  const CatIcon = iconMap[iconName];
                  const colors = categoryColorMap[tag.categoryId];
                  return (
                    <button
                      key={tag.label}
                      onClick={() => setQuery(tag.label)}
                      className="flex items-center gap-1.5 rounded-full bg-card px-3.5 py-2 text-sm font-semibold text-foreground card-shadow transition-all active:scale-95"
                    >
                      {CatIcon && <CatIcon size={14} weight="regular" className={colors?.color || "text-muted-foreground"} />}
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Popular services */}
            <div>
              <h3 className="mb-3 text-sm font-bold text-foreground">Popular Services</h3>
              <div className="flex flex-col gap-2">
                {allServices
                  .filter((s) => s.popular)
                  .slice(0, 4)
                  .map((service) => (
                    <button
                      key={service.id}
                      onClick={() => navigate(`/services/${service.id}`)}
                      className="flex items-center gap-3 rounded-2xl bg-card p-3 card-shadow transition-all active:scale-[0.98]"
                    >
                      {(() => {
                        const iconName = serviceIconMap[service.id] || "wrench";
                        const SvcIcon = iconMap[iconName];
                        const colors = getServiceColors(service.id);
                        return (
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.bg} bg-opacity-40`}>
                            <SvcIcon size={20} weight="regular" className={colors.color} />
                          </div>
                        );
                      })()}
                      <div className="flex-1 text-left">
                        <h4 className="text-sm font-bold text-foreground">{service.name}</h4>
                        <p className="text-xs text-muted-foreground">{service.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* Search results */}
        {isSearching && (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {filteredServices.length + filteredCategories.length} result
              {filteredServices.length + filteredCategories.length !== 1 ? "s" : ""} for "
              <span className="font-semibold text-foreground">{query}</span>"
            </p>

            {/* Matching categories */}
            {filteredCategories.length > 0 && (
              <div className="mb-5">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                    {filteredCategories.map((cat) => {
                      const iconName = categoryIconMap[cat.id] || "wrench";
                      const CatIcon = iconMap[iconName];
                      const colors = categoryColorMap[cat.id];
                      return (
                        <button
                          key={cat.id}
                          onClick={() => navigate(`/categories/${cat.id}`)}
                          className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-all active:scale-95"
                        >
                          {CatIcon && <CatIcon size={14} weight="regular" className="text-primary-foreground" />}
                          {cat.label}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Matching services */}
            {filteredServices.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Services
                </h3>
                <div className="flex flex-col gap-2">
                  {filteredServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => navigate(`/services/${service.id}`)}
                      className="flex items-center gap-3 rounded-2xl bg-card p-3 card-shadow transition-all active:scale-[0.98]"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          service.type === "quick" ? "bg-accent" : "bg-secondary"
                        }`}
                      >
                        {(() => {
                          const iconName = serviceIconMap[service.id] || "wrench";
                          const SvcIcon = iconMap[iconName];
                          const colors = getServiceColors(service.id);
                          return <SvcIcon size={20} weight="regular" className={colors.color} />;
                        })()}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-foreground">{service.name}</h4>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              service.type === "quick"
                                ? "bg-accent text-accent-foreground"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {service.type === "quick" ? "Quick" : "Project"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{service.description}</p>
                        <span className="mt-0.5 text-sm font-bold text-primary">
                          {service.price ? `£${service.price}` : service.priceLabel}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {!hasResults && (
              <div className="flex flex-col items-center py-16 text-center">
                <SearchIcon className="mb-3 h-12 w-12 text-muted-foreground/30" />
                <p className="font-bold text-foreground">No results found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term or browse categories
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                  }}
                  className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MobileLayout>
  );
};

export default SearchPage;
