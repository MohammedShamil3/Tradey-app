import MobileLayout from "@/components/layout/MobileLayout";
import { useNavigate } from "react-router-dom";
import { serviceCategories, getServicesByCategory, getTradersByCategory } from "@/data/services";
import { categoryImages } from "@/data/categoryImages";
import { Star, Users, ChevronRight } from "lucide-react";

const Categories = () => {
  const navigate = useNavigate();
  const categories = serviceCategories.filter(c => c.id !== "all");

  return (
    <MobileLayout>
      <div className="px-4 pt-6 pb-6">
        <h1 className="mb-1 text-2xl font-extrabold text-foreground font-heading">Categories</h1>
        <p className="mb-8 text-sm text-muted-foreground">Browse services by trade category</p>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, index) => {
            const services = getServicesByCategory(cat.id);
            const traders = getTradersByCategory(cat.id);
            const image = categoryImages[cat.id];
            const avgRating = traders.length
              ? (traders.reduce((sum, t) => sum + t.rating, 0) / traders.length).toFixed(1)
              : "4.8";

            // First item spans full width
            if (index === 0) {
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/categories/${cat.id}`)}
                  className="col-span-2 group relative overflow-hidden rounded-2xl bg-card card-shadow transition-all active:scale-[0.98] text-left"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    {image && (
                      <img
                        src={image}
                        alt={cat.label}
                        className="h-full w-full object-cover transition-transform duration-500 group-active:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

                    {/* Rating badge */}
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card/80 px-2.5 py-1 backdrop-blur-md">
                      <Star className="h-3 w-3 fill-star text-star" />
                      <span className="text-[11px] font-bold text-foreground">{avgRating}</span>
                    </div>

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-extrabold text-card font-heading">{cat.label}</h3>
                      <p className="mt-0.5 text-[11px] text-card/70 line-clamp-1">{cat.description}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="rounded-full bg-card/20 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold text-card">
                          {services.length} services
                        </span>
                        <span className="flex items-center gap-1 rounded-full bg-card/20 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold text-card">
                          <Users className="h-2.5 w-2.5" />
                          {traders.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            }

            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/categories/${cat.id}`)}
                className="group relative overflow-hidden rounded-2xl bg-card card-shadow transition-all active:scale-[0.97] text-left"
              >
                <div className="relative h-32 w-full overflow-hidden">
                  {image && (
                    <img
                      src={image}
                      alt={cat.label}
                      className="h-full w-full object-cover transition-transform duration-500 group-active:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />

                  {/* Rating */}
                  <div className="absolute right-2 top-2 flex items-center gap-0.5 rounded-full bg-card/80 px-2 py-0.5 backdrop-blur-md">
                    <Star className="h-2.5 w-2.5 fill-star text-star" />
                    <span className="text-[10px] font-bold text-foreground">{avgRating}</span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-sm font-extrabold text-card font-heading leading-tight">{cat.label}</h3>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-card/70">
                        {services.length} services
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-card/50" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Categories;
