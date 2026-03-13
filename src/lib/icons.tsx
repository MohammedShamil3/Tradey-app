import {
  Wrench,
  Lightbulb,
  Drop,
  Plug,
  Door,
  PaintBrush,
  BookmarkSimple,
  Toilet,
  Broom,
  Fire,
  Bathtub,
  CookingPot,
  Lightning,
  HouseLine,
  Flame,
  PaintRoller,
  Sparkle,
  Snowflake,
  Hammer,
  ThermometerHot,
  Key,
  ShieldCheck,
  CheckCircle,
  Star,
  Clock,
  Users,
  Package,
  House,
  Fan,
  Shower,
  Wall,
  Ruler,
  type Icon,
} from "@phosphor-icons/react";

// Map of icon names to Phosphor components
export const iconMap: Record<string, Icon> = {
  // Plumbing
  wrench: Wrench,
  shower: Shower,
  drop: Drop,
  toilet: Toilet,
  bathtub: Bathtub,
  
  // Electrical
  lightbulb: Lightbulb,
  plug: Plug,
  lightning: Lightning,
  
  // Carpentry
  door: Door,
  hammer: Hammer,
  ruler: Ruler,
  house: House,
  houseLine: HouseLine,
  cookingPot: CookingPot,
  
  // Painting
  paintBrush: PaintBrush,
  paintRoller: PaintRoller,
  wall: Wall,
  
  // Cleaning
  broom: Broom,
  sparkle: Sparkle,
  
  // HVAC
  fire: Fire,
  flame: Flame,
  thermometer: ThermometerHot,
  snowflake: Snowflake,
  fan: Fan,
  
  // General
  key: Key,
  shieldCheck: ShieldCheck,
  checkCircle: CheckCircle,
  star: Star,
  clock: Clock,
  users: Users,
  package: Package,
  bookmark: BookmarkSimple,
};

// Pastel color scheme for icons (background + icon color)
export const iconColorMap: Record<string, { bg: string; color: string }> = {
  // Plumbing - Blue pastels
  wrench: { bg: "bg-blue-100", color: "text-blue-600" },
  shower: { bg: "bg-sky-100", color: "text-sky-600" },
  drop: { bg: "bg-cyan-100", color: "text-cyan-600" },
  toilet: { bg: "bg-blue-100", color: "text-blue-500" },
  bathtub: { bg: "bg-sky-100", color: "text-sky-600" },
  
  // Electrical - Yellow/Amber pastels
  lightbulb: { bg: "bg-amber-100", color: "text-amber-600" },
  plug: { bg: "bg-yellow-100", color: "text-yellow-600" },
  lightning: { bg: "bg-amber-100", color: "text-amber-500" },
  
  // Carpentry - Brown/Orange pastels
  door: { bg: "bg-orange-100", color: "text-orange-600" },
  hammer: { bg: "bg-amber-100", color: "text-amber-700" },
  ruler: { bg: "bg-orange-100", color: "text-orange-500" },
  house: { bg: "bg-stone-100", color: "text-stone-600" },
  houseLine: { bg: "bg-orange-100", color: "text-orange-600" },
  cookingPot: { bg: "bg-rose-100", color: "text-rose-500" },
  
  // Painting - Purple/Pink pastels
  paintBrush: { bg: "bg-violet-100", color: "text-violet-600" },
  paintRoller: { bg: "bg-purple-100", color: "text-purple-600" },
  wall: { bg: "bg-fuchsia-100", color: "text-fuchsia-500" },
  
  // Cleaning - Green/Teal pastels
  broom: { bg: "bg-emerald-100", color: "text-emerald-600" },
  sparkle: { bg: "bg-teal-100", color: "text-teal-500" },
  
  // HVAC - Red/Blue pastels
  fire: { bg: "bg-red-100", color: "text-red-500" },
  flame: { bg: "bg-orange-100", color: "text-orange-600" },
  thermometer: { bg: "bg-rose-100", color: "text-rose-600" },
  snowflake: { bg: "bg-cyan-100", color: "text-cyan-500" },
  fan: { bg: "bg-sky-100", color: "text-sky-500" },
  
  // General
  key: { bg: "bg-amber-100", color: "text-amber-600" },
  shieldCheck: { bg: "bg-green-100", color: "text-green-600" },
  checkCircle: { bg: "bg-emerald-100", color: "text-emerald-600" },
  star: { bg: "bg-yellow-100", color: "text-yellow-500" },
  clock: { bg: "bg-slate-100", color: "text-slate-600" },
  users: { bg: "bg-indigo-100", color: "text-indigo-600" },
  package: { bg: "bg-violet-100", color: "text-violet-600" },
  bookmark: { bg: "bg-pink-100", color: "text-pink-500" },
};

// Category colors - muted bg with pastel icon strokes
export const categoryColorMap: Record<string, { bg: string; color: string }> = {
  all: { bg: "bg-muted", color: "text-rose-400" },
  plumbing: { bg: "bg-muted", color: "text-blue-400" },
  electrical: { bg: "bg-muted", color: "text-amber-400" },
  painting: { bg: "bg-muted", color: "text-violet-400" },
  carpentry: { bg: "bg-muted", color: "text-orange-400" },
  cleaning: { bg: "bg-muted", color: "text-emerald-400" },
  hvac: { bg: "bg-muted", color: "text-cyan-400" },
  bathroom: { bg: "bg-muted", color: "text-sky-400" },
  roofing: { bg: "bg-muted", color: "text-stone-400" },
};

// Service icon mapping (service ID to icon name)
export const serviceIconMap: Record<string, string> = {
  // Cat A Services
  "tap-repair": "wrench",
  "light-install": "lightbulb",
  "drain-unblock": "shower",
  "socket-install": "plug",
  "door-repair": "door",
  "wall-painting": "paintBrush",
  "shelf-mounting": "ruler",
  "toilet-repair": "toilet",
  "deep-clean": "broom",
  "boiler-service": "flame",
  
  // Cat B Services
  "bathroom-reno": "bathtub",
  "kitchen-reno": "cookingPot",
  "full-rewiring": "lightning",
  "extension": "houseLine",
  "central-heating": "thermometer",
  "roof-repair": "house",
  "full-paint": "paintRoller",
  "end-tenancy-clean": "sparkle",
};

// Category icon mapping
export const categoryIconMap: Record<string, string> = {
  all: "fire",
  plumbing: "wrench",
  electrical: "lightning",
  painting: "paintBrush",
  carpentry: "hammer",
  cleaning: "broom",
  hvac: "snowflake",
  bathroom: "bathtub",
  roofing: "house",
};

// Get colors for an icon name
export const getIconColors = (iconName: string) => {
  return iconColorMap[iconName] || { bg: "bg-slate-100", color: "text-slate-600" };
};

// Get colors for a service ID
export const getServiceColors = (serviceId: string) => {
  const iconName = serviceIconMap[serviceId] || "wrench";
  return getIconColors(iconName);
};

// Get colors for a category
export const getCategoryColors = (categoryId: string) => {
  return categoryColorMap[categoryId] || { bg: "bg-slate-100", color: "text-slate-600" };
};

// Helper component to render an icon by name
interface ServiceIconProps {
  iconName: string;
  size?: number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  className?: string;
}

export const ServiceIcon = ({ iconName, size = 24, weight = "regular", className }: ServiceIconProps) => {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    return <Wrench size={size} weight={weight} className={className} />;
  }
  return <IconComponent size={size} weight={weight} className={className} />;
};

// Emoji → icon name mapping for replacing emojis with Phosphor icons
export const emojiToIconName: Record<string, string> = {
  "🔧": "wrench",
  "💡": "lightbulb",
  "🚿": "shower",
  "🔌": "plug",
  "🚪": "door",
  "🎨": "paintBrush",
  "📐": "ruler",
  "🚽": "toilet",
  "🧹": "broom",
  "🔥": "flame",
  "🛁": "bathtub",
  "🍳": "cookingPot",
  "⚡": "lightning",
  "🏗️": "houseLine",
  "🏠": "house",
  "🖌️": "paintRoller",
  "✨": "sparkle",
  "❄️": "snowflake",
  "🪚": "hammer",
  "🛠️": "wrench",
  "📋": "package",
  "👷": "wrench",
  "👩‍🔧": "wrench",
  "🧑‍🔧": "wrench",
};

// Render a Phosphor icon from an emoji string
interface EmojiIconProps {
  emoji: string;
  size?: number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  className?: string;
  colorize?: boolean; // whether to apply pastel colors
}

export const EmojiIcon = ({ emoji, size = 20, weight = "regular", className, colorize = false }: EmojiIconProps) => {
  const iconName = emojiToIconName[emoji] || "wrench";
  const IconComponent = iconMap[iconName] || Wrench;
  const colors = colorize ? getIconColors(iconName) : null;
  return <IconComponent size={size} weight={weight} className={colors ? colors.color : className} />;
};

// Get icon colors for an emoji
export const getEmojiIconColors = (emoji: string) => {
  const iconName = emojiToIconName[emoji] || "wrench";
  return getIconColors(iconName);
};

// Get icon component for a service ID
export const getServiceIcon = (serviceId: string): Icon => {
  const iconName = serviceIconMap[serviceId] || "wrench";
  return iconMap[iconName] || Wrench;
};

// Get icon component for a category ID
export const getCategoryIcon = (categoryId: string): Icon => {
  const iconName = categoryIconMap[categoryId] || "wrench";
  return iconMap[iconName] || Wrench;
};
