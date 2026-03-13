import heroImage from "@/assets/hero-tradesman.png";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Star, Gift, Fire, Tag, Sparkle, House, Percent } from "@phosphor-icons/react";

const slides = [
  {
    id: "promo",
    badgeIcon: Star,
    badgeText: "Popular",
    title: "Find a Tradesman",
    subtitle: "Verified professionals for every home project.",
    cta: "Book Now",
    ctaLink: "/services",
    gradient: "from-[hsl(var(--primary))] via-[hsl(var(--primary))] to-[hsl(220,60%,35%)]",
    accentColor: "hsl(var(--primary))",
  },
  {
    id: "coupon",
    badgeIcon: Percent,
    badgeText: "Limited Offer",
    title: "20% Off First Booking",
    subtitle: "New users save big on their first service.",
    couponCode: "TRUFINDO20",
    cta: "",
    ctaLink: "/services",
    gradient: "from-[hsl(var(--blaze))] via-[hsl(var(--blaze))] to-[hsl(15,85%,45%)]",
    accentColor: "hsl(var(--blaze))",
  },
  {
    id: "bundle",
    badgeIcon: Fire,
    badgeText: "Best Value",
    title: "Move-In Bundle",
    subtitle: "Cleaning, painting & plumbing — save 15%.",
    cta: "",
    ctaLink: "/bundles/move-in",
    gradient: "from-[hsl(var(--danube))] via-[hsl(var(--danube))] to-[hsl(210,55%,35%)]",
    accentColor: "hsl(var(--danube))",
  },
];

const HeroBanner = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval>>();

  const slideWidth = containerRef.current?.offsetWidth || 0;

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, slides.length - 1));
    setActiveIndex(clamped);
    setTranslateX(0);
  }, []);

  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(autoplayRef.current);
  }, []);

  const resetAutoplay = () => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    clearInterval(autoplayRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setTranslateX(e.touches[0].clientX - startX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const threshold = slideWidth * 0.2;
    if (translateX < -threshold) goTo(activeIndex + 1);
    else if (translateX > threshold) goTo(activeIndex - 1);
    else setTranslateX(0);
    resetAutoplay();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    clearInterval(autoplayRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTranslateX(e.clientX - startX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = slideWidth * 0.2;
    if (translateX < -threshold) goTo(activeIndex + 1);
    else if (translateX > threshold) goTo(activeIndex - 1);
    else setTranslateX(0);
    resetAutoplay();
  };

  const offset = -(activeIndex * 100) + (slideWidth ? (translateX / slideWidth) * 100 : 0);

  return (
    <div className="mx-4">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-3xl select-none shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => isDragging && handleMouseUp()}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(${offset}%)`,
            transition: isDragging ? "none" : "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)",
          }}
        >
          {slides.map((slide) => {
            const BadgeIcon = slide.badgeIcon;
            return (
              <div
                key={slide.id}
                className={`w-full shrink-0 bg-gradient-to-br ${slide.gradient} relative overflow-hidden`}
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-[0.07]">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                  }} />
                </div>
                
                {/* Decorative shapes */}
                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/8 blur-xl" />
                <div className="absolute right-1/4 top-1/4 h-20 w-20 rounded-full bg-white/5 blur-lg" />

                <div className="relative flex flex-col justify-center min-h-[160px] p-4">
                  <div className="relative z-10 flex flex-col gap-2 max-w-[62%]">
                    {/* Badge */}
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold text-white shadow-sm">
                      <BadgeIcon size={12} weight="fill" />
                      {slide.badgeText}
                    </span>
                    
                    {/* Title */}
                    <h2 className="text-xl font-extrabold leading-tight text-white font-heading tracking-tight">
                      {slide.title}
                    </h2>
                    
                    {/* Subtitle */}
                    <p className="text-[12px] text-white/80 leading-relaxed font-medium">
                      {slide.subtitle}
                    </p>

                    {/* Coupon code */}
                    {slide.couponCode && (
                      <div className="flex items-center mt-1">
                        <div className="flex items-center gap-2 rounded-xl border-2 border-dashed border-white/50 bg-white/20 backdrop-blur-sm px-3.5 py-2 shadow-inner">
                          <Tag size={14} weight="bold" className="text-white" />
                          <span className="text-sm font-extrabold tracking-widest text-white font-mono">
                            {slide.couponCode}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    {slide.cta && (
                      <button
                        onClick={() => navigate(slide.ctaLink)}
                        className="mt-2 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold transition-all active:scale-95 shadow-lg hover:shadow-xl"
                        style={{ color: slide.accentColor }}
                      >
                        {slide.cta}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Right side visuals */}
                  {slide.id === "promo" && (
                    <img
                      src={heroImage}
                      alt="Tradesman"
                      className="absolute right-0 -bottom-1 h-[180px] w-auto object-contain object-bottom pointer-events-none drop-shadow-2xl"
                      draggable={false}
                    />
                  )}
                  {slide.id === "coupon" && (
                    <div className="absolute right-2 bottom-2 pointer-events-none">
                      <div className="relative">
                        <Gift size={100} weight="duotone" className="text-white/15" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Gift size={50} weight="fill" className="text-white/25" />
                        </div>
                      </div>
                    </div>
                  )}
                  {slide.id === "bundle" && (
                    <div className="absolute right-2 bottom-2 pointer-events-none">
                      <div className="relative">
                        <House size={100} weight="duotone" className="text-white/15" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <House size={50} weight="fill" className="text-white/25" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); resetAutoplay(); }}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "h-2 w-6 bg-primary shadow-sm"
                : "h-2 w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
