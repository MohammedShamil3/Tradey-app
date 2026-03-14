export interface ServiceOption {
  id: string;
  label: string;
}

export interface ServiceType {
  id: string;
  label: string;
  options: ServiceOption[];
}

export interface CategoryServiceTypes {
  categoryId: string;
  label: string;
  emoji: string;
  serviceTypes: ServiceType[];
}

export const categoryServiceTypes: CategoryServiceTypes[] = [
  {
    categoryId: "plumbing",
    label: "Plumbing",
    emoji: "🔧",
    serviceTypes: [
      {
        id: "plumbing-tap",
        label: "Tap",
        options: [
          { id: "tap-repair", label: "Repair" },
          { id: "tap-maintenance", label: "Maintenance" },
          { id: "tap-installation", label: "Installation" },
        ],
      },
      {
        id: "plumbing-pipe",
        label: "Pipe",
        options: [
          { id: "pipe-repair", label: "Repair" },
          { id: "pipe-maintenance", label: "Maintenance" },
          { id: "pipe-installation", label: "Installation" },
        ],
      },
      {
        id: "plumbing-leak",
        label: "Leak Detection",
        options: [
          { id: "leak-detection", label: "Diagnostic & Detection" },
          { id: "leak-repair", label: "Emergency Leak Repair" },
          { id: "leak-prevention", label: "Prevention & Testing" },
        ],
      },
      {
        id: "plumbing-toilet",
        label: "Toilet",
        options: [
          { id: "toilet-repair", label: "Repair" },
          { id: "toilet-cistern", label: "Cistern Fix" },
          { id: "toilet-valve", label: "Valve Replacement" },
          { id: "toilet-installation", label: "Installation" },
        ],
      },
      {
        id: "plumbing-drain",
        label: "Drain",
        options: [
          { id: "drain-cleaning", label: "Cleaning" },
          { id: "drain-unblocking", label: "Unblocking" },
          { id: "drain-emergency", label: "Emergency Unblocking" },
        ],
      },
      {
        id: "plumbing-shower-bath",
        label: "Shower & Bath",
        options: [
          { id: "shower-install", label: "Shower Installation" },
          { id: "bath-install", label: "Bathtub Installation" },
          { id: "sink-fitting", label: "Sink / Basin Fitting" },
        ],
      },
      {
        id: "plumbing-general",
        label: "General & Appliances",
        options: [
          { id: "water-heater", label: "Water Heater Installation" },
          { id: "washing-machine", label: "Washing Machine Connection" },
          { id: "water-pressure", label: "Water Pressure Check" },
          { id: "descaling", label: "Descaling" },
        ],
      },
    ],
  },
  {
    categoryId: "electrical",
    label: "Electrical",
    emoji: "⚡",
    serviceTypes: [
      {
        id: "electrical-repair",
        label: "Repairs",
        options: [
          { id: "er-socket", label: "Socket Repair" },
          { id: "er-switch", label: "Switch Repair" },
          { id: "er-tripping", label: "Tripping Fuse Fix" },
          { id: "er-wiring", label: "Faulty Wiring Repair" },
        ],
      },
      {
        id: "electrical-installation",
        label: "Installation",
        options: [
          { id: "ei-light", label: "Light Fixture Installation" },
          { id: "ei-socket", label: "New Socket Installation" },
          { id: "ei-dimmer", label: "Dimmer Switch Fitting" },
          { id: "ei-outdoor", label: "Outdoor Lighting" },
          { id: "ei-ev", label: "EV Charger Installation" },
          { id: "ei-usb", label: "USB Socket Upgrade" },
        ],
      },
      {
        id: "electrical-maintenance",
        label: "Maintenance & Testing",
        options: [
          { id: "em-eicr", label: "EICR / Safety Inspection" },
          { id: "em-pattest", label: "PAT Testing" },
          { id: "em-fusebox", label: "Consumer Unit Check" },
          { id: "em-smoke", label: "Smoke Detector Testing" },
        ],
      },
      {
        id: "electrical-rewiring",
        label: "Rewiring",
        options: [
          { id: "ew-partial", label: "Partial Rewiring" },
          { id: "ew-full", label: "Full House Rewiring" },
          { id: "ew-fusebox", label: "Consumer Unit Replacement" },
        ],
      },
    ],
  },
  {
    categoryId: "painting",
    label: "Painting & Decorating",
    emoji: "🎨",
    serviceTypes: [
      {
        id: "painting-interior",
        label: "Interior Painting",
        options: [
          { id: "pti-walls", label: "Wall Painting" },
          { id: "pti-ceiling", label: "Ceiling Painting" },
          { id: "pti-woodwork", label: "Woodwork & Trim" },
          { id: "pti-doors", label: "Door Painting" },
          { id: "pti-feature", label: "Feature Wall / Accent Wall" },
        ],
      },
      {
        id: "painting-exterior",
        label: "Exterior Painting",
        options: [
          { id: "pte-facade", label: "Façade Painting" },
          { id: "pte-fence", label: "Fence & Gate Painting" },
          { id: "pte-shed", label: "Shed / Garage Painting" },
          { id: "pte-render", label: "Render Painting" },
        ],
      },
      {
        id: "painting-decorating",
        label: "Decorating",
        options: [
          { id: "ptd-wallpaper", label: "Wallpaper Hanging" },
          { id: "ptd-removal", label: "Wallpaper Removal" },
          { id: "ptd-plaster", label: "Plastering & Skimming" },
          { id: "ptd-colour", label: "Colour Consultation" },
        ],
      },
      {
        id: "painting-prep",
        label: "Surface Preparation",
        options: [
          { id: "ptp-strip", label: "Paint Stripping" },
          { id: "ptp-fill", label: "Crack Filling & Patching" },
          { id: "ptp-sand", label: "Sanding & Priming" },
        ],
      },
    ],
  },
  {
    categoryId: "carpentry",
    label: "Carpentry",
    emoji: "🪚",
    serviceTypes: [
      {
        id: "carpentry-repair",
        label: "Repairs",
        options: [
          { id: "cr-door", label: "Door Repair / Hanging" },
          { id: "cr-window", label: "Window Frame Repair" },
          { id: "cr-floor", label: "Floorboard Repair" },
          { id: "cr-stairs", label: "Staircase Repair" },
          { id: "cr-furniture", label: "Furniture Repair" },
        ],
      },
      {
        id: "carpentry-installation",
        label: "Installation & Fitting",
        options: [
          { id: "ci-shelves", label: "Shelf & Bracket Mounting" },
          { id: "ci-wardrobe", label: "Fitted Wardrobe" },
          { id: "ci-kitchen", label: "Kitchen Cabinet Installation" },
          { id: "ci-deck", label: "Decking Installation" },
          { id: "ci-partition", label: "Partition Wall" },
        ],
      },
      {
        id: "carpentry-bespoke",
        label: "Bespoke & Custom",
        options: [
          { id: "cb-furniture", label: "Custom Furniture" },
          { id: "cb-storage", label: "Built-in Storage" },
          { id: "cb-worktop", label: "Worktop Fitting" },
          { id: "cb-restoration", label: "Timber Restoration" },
        ],
      },
    ],
  },
  {
    categoryId: "cleaning",
    label: "Cleaning",
    emoji: "🧹",
    serviceTypes: [
      {
        id: "cleaning-domestic",
        label: "Domestic Cleaning",
        options: [
          { id: "cd-regular", label: "Regular House Cleaning" },
          { id: "cd-deep", label: "Deep Cleaning" },
          { id: "cd-spring", label: "Spring Cleaning" },
          { id: "cd-laundry", label: "Laundry & Ironing" },
        ],
      },
      {
        id: "cleaning-specialist",
        label: "Specialist Cleaning",
        options: [
          { id: "cs-carpet", label: "Carpet & Upholstery Cleaning" },
          { id: "cs-oven", label: "Oven Cleaning" },
          { id: "cs-windows", label: "Window Cleaning" },
          { id: "cs-pressure", label: "Pressure Washing" },
        ],
      },
      {
        id: "cleaning-moveout",
        label: "Move-out / Tenancy",
        options: [
          { id: "cm-endten", label: "End of Tenancy Cleaning" },
          { id: "cm-movein", label: "Move-in Cleaning" },
          { id: "cm-inventory", label: "Inventory-Standard Clean" },
        ],
      },
      {
        id: "cleaning-commercial",
        label: "Commercial",
        options: [
          { id: "cc-office", label: "Office Cleaning" },
          { id: "cc-retail", label: "Retail / Shop Cleaning" },
          { id: "cc-afterbuild", label: "After-Build Cleaning" },
        ],
      },
    ],
  },
  {
    categoryId: "hvac",
    label: "HVAC",
    emoji: "❄️",
    serviceTypes: [
      {
        id: "hvac-heating",
        label: "Heating",
        options: [
          { id: "hh-boiler-service", label: "Boiler Service" },
          { id: "hh-boiler-install", label: "Boiler Installation" },
          { id: "hh-radiator", label: "Radiator Installation" },
          { id: "hh-underfloor", label: "Underfloor Heating" },
          { id: "hh-thermostat", label: "Smart Thermostat Setup" },
        ],
      },
      {
        id: "hvac-cooling",
        label: "Cooling & Ventilation",
        options: [
          { id: "hc-ac-install", label: "AC Installation" },
          { id: "hc-ac-service", label: "AC Servicing" },
          { id: "hc-extractor", label: "Extractor Fan Fitting" },
          { id: "hc-ventilation", label: "Ventilation System" },
        ],
      },
      {
        id: "hvac-maintenance",
        label: "Maintenance & Safety",
        options: [
          { id: "hm-gas-safety", label: "Gas Safety Check" },
          { id: "hm-boiler-repair", label: "Boiler Repair" },
          { id: "hm-powerflush", label: "Central Heating Powerflush" },
          { id: "hm-leak-detect", label: "Gas Leak Detection" },
        ],
      },
    ],
  },
];
