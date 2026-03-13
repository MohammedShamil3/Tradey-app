export interface Service {
  id: string;
  name: string;
  category: "catA" | "catB";
  categoryId: string;
  icon: string;
  description: string;
  price?: number;
  priceLabel?: string;
  duration?: string;
  popular?: boolean;
  details?: string[];
}

export interface ServiceCategory {
  id: string;
  label: string;
  emoji: string;
  description?: string;
  image?: string;
}

export interface Trader {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  experience: string;
  specialties: string[];
  location: string;
  verified: boolean;
}

export const serviceCategories: ServiceCategory[] = [
  { id: "all", label: "All", emoji: "🔥" },
  { id: "plumbing", label: "Plumbing", emoji: "🔧", description: "From leaking taps to full bathroom installations, our verified plumbers handle every water and drainage job with precision. All work guaranteed and compliant with building regulations." },
  { id: "electrical", label: "Electrical", emoji: "⚡", description: "Certified electricians for everything from socket installations to complete rewiring. All work meets BS 7671 standards and comes with safety certificates." },
  { id: "painting", label: "Painting", emoji: "🎨", description: "Professional painters and decorators for interior and exterior work. Expert colour matching, surface preparation, and flawless finishes every time." },
  { id: "carpentry", label: "Carpentry", emoji: "🪚", description: "Skilled carpenters for bespoke furniture, fitted wardrobes, door hanging, and structural timber work. Quality craftsmanship with attention to detail." },
  { id: "cleaning", label: "Cleaning", emoji: "🧹", description: "Deep cleaning, end-of-tenancy, and regular domestic cleaning services. Eco-friendly products available. Fully insured and background-checked professionals." },
  { id: "hvac", label: "HVAC", emoji: "❄️", description: "Heating, ventilation, and air conditioning experts. Gas Safe registered engineers for boiler installations, servicing, and climate control solutions." },
];

// Category A: Small jobs, fixed price, <4 hours
export const catAServices: Service[] = [
  { id: "tap-repair", name: "Tap Repair", category: "catA", categoryId: "plumbing", icon: "🔧", description: "Fix leaking or broken taps", price: 65, duration: "1-2 hrs", popular: true, details: ["Washer replacement", "Cartridge repair", "Mixer tap fixes", "Outdoor tap repair", "Stop tap servicing"] },
  { id: "light-install", name: "Light Installation", category: "catA", categoryId: "electrical", icon: "💡", description: "Install ceiling lights or fixtures", price: 55, duration: "1-2 hrs", details: ["Pendant lights", "Spotlights & downlights", "Dimmer switches", "Outdoor lighting", "LED strip installation"] },
  { id: "drain-unblock", name: "Drain Unblocking", category: "catA", categoryId: "plumbing", icon: "🚿", description: "Clear blocked drains and pipes", price: 75, duration: "1-3 hrs", popular: true, details: ["Kitchen sink unblocking", "Bathroom drain clearing", "External drain jetting", "Waste pipe repair", "Drain camera inspection"] },
  { id: "socket-install", name: "Socket Installation", category: "catA", categoryId: "electrical", icon: "🔌", description: "Add or replace electrical sockets", price: 60, duration: "1-2 hrs", details: ["Single/double socket fitting", "USB socket upgrades", "Outdoor sockets", "Socket relocation", "Fused spur installation"] },
  { id: "door-repair", name: "Door Repair", category: "catA", categoryId: "carpentry", icon: "🚪", description: "Fix squeaky or stuck doors", price: 50, duration: "1-2 hrs", details: ["Hinge replacement", "Door planing", "Lock fitting", "Handle replacement", "Draught proofing"] },
  { id: "wall-painting", name: "Wall Painting (1 room)", category: "catA", categoryId: "painting", icon: "🎨", description: "Paint a single room up to 20m²", price: 120, duration: "3-4 hrs", popular: true, details: ["Surface preparation", "Primer application", "Two coats emulsion", "Cutting in & edging", "Furniture protection"] },
  { id: "shelf-mounting", name: "Shelf Mounting", category: "catA", categoryId: "carpentry", icon: "📐", description: "Mount shelves and wall fixtures", price: 45, duration: "1 hr", details: ["Floating shelves", "Bracket shelves", "TV mounting", "Mirror hanging", "Picture rail installation"] },
  { id: "toilet-repair", name: "Toilet Repair", category: "catA", categoryId: "plumbing", icon: "🚽", description: "Fix running or clogged toilets", price: 70, duration: "1-2 hrs", details: ["Cistern repair", "Fill valve replacement", "Flush mechanism fix", "Toilet seat replacement", "Wax ring seal"] },
  { id: "deep-clean", name: "Deep Cleaning", category: "catA", categoryId: "cleaning", icon: "🧹", description: "Thorough deep clean of your home", price: 95, duration: "3-4 hrs", popular: true, details: ["Kitchen deep clean", "Bathroom sanitisation", "Oven cleaning", "Window cleaning", "Carpet shampooing"] },
  { id: "boiler-service", name: "Boiler Service", category: "catA", categoryId: "hvac", icon: "🔥", description: "Annual boiler service and safety check", price: 85, duration: "1-2 hrs", details: ["Gas safety check", "Flue analysis", "Pressure test", "Component inspection", "Safety certificate"] },
];

// Category B: Large jobs, custom quotes, on-site inspection
export const catBServices: Service[] = [
  { id: "bathroom-reno", name: "Bathroom Renovation", category: "catB", categoryId: "plumbing", icon: "🛁", description: "Full bathroom redesign and renovation", priceLabel: "Custom quote", popular: true, details: ["Design consultation", "Tiling & waterproofing", "Plumbing & drainage", "Electrical work", "Fixtures & fittings"] },
  { id: "kitchen-reno", name: "Kitchen Renovation", category: "catB", categoryId: "carpentry", icon: "🍳", description: "Complete kitchen remodel and fitting", priceLabel: "Custom quote", details: ["Layout planning", "Cabinet installation", "Worktop fitting", "Appliance connection", "Tiling & splashbacks"] },
  { id: "full-rewiring", name: "Full House Rewiring", category: "catB", categoryId: "electrical", icon: "⚡", description: "Complete electrical rewiring of your home", priceLabel: "Custom quote", popular: true, details: ["Consumer unit upgrade", "Full circuit rewire", "Socket & switch fitting", "Safety testing", "Certification"] },
  { id: "extension", name: "Home Extension", category: "catB", categoryId: "carpentry", icon: "🏗️", description: "Build an extension to your property", priceLabel: "Custom quote", details: ["Architectural plans", "Foundation work", "Structural build", "Roofing", "Interior finishing"] },
  { id: "central-heating", name: "Central Heating System", category: "catB", categoryId: "hvac", icon: "🔥", description: "Install or replace central heating", priceLabel: "Custom quote", details: ["System design", "Boiler installation", "Radiator fitting", "Pipework", "Smart thermostat setup"] },
  { id: "roof-repair", name: "Roof Repair & Replacement", category: "catB", categoryId: "carpentry", icon: "🏠", description: "Major roof repairs or full replacement", priceLabel: "Custom quote", popular: true, details: ["Structural inspection", "Tile/slate replacement", "Felt & battening", "Flashing & leadwork", "Gutter renewal"] },
  { id: "full-paint", name: "Full House Painting", category: "catB", categoryId: "painting", icon: "🖌️", description: "Interior and exterior painting for your entire home", priceLabel: "Custom quote", details: ["Colour consultation", "Surface preparation", "Interior painting", "Exterior painting", "Woodwork & trim"] },
  { id: "end-tenancy-clean", name: "End of Tenancy Clean", category: "catB", categoryId: "cleaning", icon: "✨", description: "Professional deep clean for moving out", priceLabel: "Custom quote", details: ["Full property clean", "Oven & appliances", "Carpet cleaning", "Window cleaning", "Inventory standard"] },
];

// Mock traders data
export const traders: Trader[] = [
  { id: "t1", name: "John Smith", avatar: "👷", rating: 4.9, reviews: 200, experience: "8 years", specialties: ["plumbing", "hvac"], location: "London", verified: true },
  { id: "t2", name: "Sophie Baker", avatar: "👩‍🔧", rating: 4.8, reviews: 156, experience: "10 years", specialties: ["electrical"], location: "Manchester", verified: true },
  { id: "t3", name: "Peter Jensen", avatar: "🧑‍🔧", rating: 4.7, reviews: 98, experience: "5 years", specialties: ["carpentry", "painting"], location: "Birmingham", verified: true },
  { id: "t4", name: "Emma Wilson", avatar: "👩‍🔧", rating: 4.9, reviews: 312, experience: "12 years", specialties: ["plumbing"], location: "Leeds", verified: true },
  { id: "t5", name: "James Taylor", avatar: "👷", rating: 4.6, reviews: 87, experience: "6 years", specialties: ["electrical", "hvac"], location: "Bristol", verified: true },
  { id: "t6", name: "Sarah Chen", avatar: "👩‍🔧", rating: 4.8, reviews: 143, experience: "9 years", specialties: ["painting", "cleaning"], location: "London", verified: true },
  { id: "t7", name: "Michael Brown", avatar: "🧑‍🔧", rating: 4.5, reviews: 64, experience: "4 years", specialties: ["carpentry"], location: "Edinburgh", verified: true },
  { id: "t8", name: "Lisa Martinez", avatar: "👩‍🔧", rating: 4.7, reviews: 189, experience: "7 years", specialties: ["cleaning"], location: "Cardiff", verified: true },
  { id: "t9", name: "David Clark", avatar: "👷", rating: 4.9, reviews: 276, experience: "15 years", specialties: ["hvac", "plumbing"], location: "Glasgow", verified: true },
  { id: "t10", name: "Rachel Green", avatar: "👩‍🔧", rating: 4.8, reviews: 201, experience: "11 years", specialties: ["electrical", "hvac"], location: "Liverpool", verified: true },
];

export const getAllServices = () => [...catAServices, ...catBServices];

export const getServiceById = (id: string) => getAllServices().find(s => s.id === id);

export const getServicesByCategory = (categoryId: string) =>
  getAllServices().filter(s => s.categoryId === categoryId);

export const getTradersByCategory = (categoryId: string) =>
  traders.filter(t => t.specialties.includes(categoryId));

export const getTopTraders = (limit = 5) =>
  [...traders].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, limit);
