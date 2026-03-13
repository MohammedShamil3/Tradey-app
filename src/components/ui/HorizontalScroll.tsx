import { useRef, useState, useEffect, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  subtitle?: string;
  trailing?: ReactNode;
}

const HorizontalScroll = ({ children, className = "", title, subtitle, trailing }: HorizontalScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      observer.disconnect();
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const hasTitle = !!title;

  return (
    <div>
      {/* Header row with title + arrows (only when title is provided) */}
      {hasTitle && (
        <div className="mb-3 flex items-center justify-between">
          <div className="flex-1">
            {title}
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-1">
            {trailing}
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`flex h-7 w-7 items-center justify-center rounded-full border border-border transition-all ${
                canScrollLeft ? "bg-card shadow-sm text-foreground" : "bg-muted text-muted-foreground/30"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`flex h-7 w-7 items-center justify-center rounded-full border border-border transition-all ${
                canScrollRight ? "bg-card shadow-sm text-foreground" : "bg-muted text-muted-foreground/30"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Scrollable container */}
      <div className="relative">
        {/* Overlay arrows when no title */}
        {!hasTitle && canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-1 top-1/2 z-10 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border shadow-md"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>
        )}

        <div
          ref={scrollRef}
          className={`flex gap-3 overflow-x-auto pb-2 no-scrollbar cursor-grab active:cursor-grabbing ${className}`}
          style={{ scrollSnapType: "x mandatory" }}
        >
          {children}
        </div>

        {!hasTitle && canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-1 top-1/2 z-10 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border shadow-md"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>
        )}
      </div>
    </div>
  );
};

export default HorizontalScroll;
