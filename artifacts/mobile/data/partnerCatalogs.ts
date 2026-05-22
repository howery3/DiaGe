export interface CatalogItem {
  id: string;
  name: string;
  type: string;
  material: string;
  sku: string;
  price: string;
  description: string;
  tags: string[];
}

export interface PartnerCatalog {
  id: string;
  retailerName: string;
  tagline: string;
  accentColor: string;
  accentLight: string;
  catalogUrl: string;
  syncCode: string;
  items: CatalogItem[];
  contact?: {
    bookingUrl?: string;
    phone?: string;
    email?: string;
  };
}

export const PARTNER_CATALOGS: PartnerCatalog[] = [
  {
    id: "kay",
    retailerName: "Kay Jewelers",
    tagline: "Every kiss begins with Kay",
    accentColor: "#1A3C6E",
    accentLight: "#EDF1F9",
    catalogUrl: "https://www.kay.com",
    syncCode: "KAY2025",
    contact: {
      bookingUrl: "https://www.kay.com/store-finder",
      phone: "(800) 529-5478",
    },
    items: [
      {
        id: "kay-001",
        name: "Diamond Solitaire Engagement Ring",
        type: "ring",
        material: "14k White Gold, 1ct Round Diamond",
        sku: "KAY-DSE-001",
        price: "2999",
        description: "A timeless round brilliant solitaire in 14k white gold. The most popular engagement ring in America.",
        tags: ["Engagement", "Solitaire", "Diamond"],
      },
      {
        id: "kay-002",
        name: "Open Hearts Diamond Necklace",
        type: "necklace",
        material: "Sterling Silver, Diamond",
        sku: "KAY-OHN-002",
        price: "349",
        description: "Jane Seymour's iconic Open Hearts design — a symbol of a heart open to give and receive love.",
        tags: ["Open Hearts", "Diamond", "Sterling Silver"],
      },
      {
        id: "kay-003",
        name: "Diamond Stud Earrings",
        type: "earrings",
        material: "14k White Gold, 0.5ct Diamond",
        sku: "KAY-DSE-003",
        price: "599",
        description: "Classic four-prong diamond studs set in 14k white gold. An everyday essential for any jewelry lover.",
        tags: ["Studs", "Diamond", "Classic"],
      },
      {
        id: "kay-004",
        name: "Diamond Anniversary Band",
        type: "ring",
        material: "14k White Gold, 1ct Diamond",
        sku: "KAY-DAB-004",
        price: "1799",
        description: "A brilliant channel-set diamond band in 14k white gold. Perfect for anniversaries or as a wedding band.",
        tags: ["Anniversary", "Band", "Channel Set"],
      },
    ],
  },
  {
    id: "zales",
    retailerName: "Zales",
    tagline: "America's diamond store since 1924",
    accentColor: "#1B4F8A",
    accentLight: "#EDF2FA",
    catalogUrl: "https://www.zales.com",
    syncCode: "ZL2025",
    contact: {
      bookingUrl: "https://www.zales.com/stores",
      phone: "(800) 311-5393",
    },
    items: [
      {
        id: "zl-001",
        name: "Diamond Solitaire Engagement Ring",
        type: "ring",
        material: "14k White Gold, 1ct Diamond",
        sku: "ZL-DSE-001",
        price: "3299",
        description: "A classic round brilliant solitaire in 14k white gold. Timeless elegance for your most important moment.",
        tags: ["Engagement", "Solitaire", "White Gold"],
      },
      {
        id: "zl-002",
        name: "Diamond Heart Pendant",
        type: "necklace",
        material: "Sterling Silver, Diamond",
        sku: "ZL-DHP-002",
        price: "299",
        description: "A sparkling diamond heart pendant in polished sterling silver. Perfect for everyday wear or gifting.",
        tags: ["Heart", "Diamond", "Sterling Silver"],
      },
      {
        id: "zl-003",
        name: "Diamond Stud Earrings",
        type: "earrings",
        material: "14k White Gold, 0.5ct Diamond",
        sku: "ZL-DSE-003",
        price: "699",
        description: "Classic four-prong diamond studs in 14k white gold. A wardrobe essential that goes with everything.",
        tags: ["Studs", "Diamond", "Classic"],
      },
      {
        id: "zl-004",
        name: "Diamond Tennis Bracelet",
        type: "bracelet",
        material: "14k White Gold, 2ct Diamond",
        sku: "ZL-DTB-004",
        price: "2499",
        description: "A brilliant row of round diamonds in 14k white gold. The ultimate statement bracelet.",
        tags: ["Tennis", "Diamond", "Statement"],
      },
    ],
  },
  {
    id: "jared",
    retailerName: "Jared",
    tagline: "The Galleria of Jewelry",
    accentColor: "#7B1F2B",
    accentLight: "#FAF0F1",
    catalogUrl: "https://www.jared.com",
    syncCode: "JRD2025",
    contact: {
      bookingUrl: "https://www.jared.com/stores",
      phone: "(800) 527-8065",
    },
    items: [
      {
        id: "jrd-001",
        name: "Leo Diamond Engagement Ring",
        type: "ring",
        material: "18k White Gold, 1ct Leo Diamond",
        sku: "JRD-LDE-001",
        price: "4999",
        description: "The Leo Diamond — the first independently certified ideal cut diamond, with unmatched brilliance.",
        tags: ["Engagement", "Leo Diamond", "Ideal Cut"],
      },
      {
        id: "jrd-002",
        name: "Vera Wang Love Collection Ring",
        type: "ring",
        material: "14k White Gold, Diamond",
        sku: "JRD-VWR-002",
        price: "2599",
        description: "Vera Wang's signature Love collection — flowing curves and delicate diamond details for the modern bride.",
        tags: ["Vera Wang", "Bridal", "White Gold"],
      },
      {
        id: "jrd-003",
        name: "Diamond Halo Pendant",
        type: "necklace",
        material: "14k White Gold, 0.5ct Diamond",
        sku: "JRD-DHP-003",
        price: "899",
        description: "A brilliant diamond center stone surrounded by a sparkling halo of round diamonds. Pure luxury.",
        tags: ["Halo", "Diamond", "Pendant"],
      },
      {
        id: "jrd-004",
        name: "Diamond Hoop Earrings",
        type: "earrings",
        material: "14k White Gold, 1ct Diamond",
        sku: "JRD-DHE-004",
        price: "1299",
        description: "Inside-out diamond hoops with a full carat of round brilliants. Elegant day-to-night versatility.",
        tags: ["Hoops", "Diamond", "Elegant"],
      },
    ],
  },
  {
    id: "banter",
    retailerName: "Banter by Piercing Pagoda",
    tagline: "Fashion jewelry & piercing",
    accentColor: "#C2185B",
    accentLight: "#FDE8F2",
    catalogUrl: "https://www.banterbypiercingpagoda.com",
    syncCode: "BNTR2025",
    contact: {
      bookingUrl: "https://www.banterbypiercingpagoda.com/stores",
      phone: "(800) 243-2628",
    },
    items: [
      {
        id: "bntr-001",
        name: "Cubic Zirconia Stud Pack",
        type: "earrings",
        material: "Sterling Silver, Cubic Zirconia",
        sku: "BNTR-CZS-001",
        price: "49",
        description: "A curated set of sparkly CZ studs in multiple sizes. Mix, match, and stack for any vibe.",
        tags: ["CZ", "Studs", "Pack"],
      },
      {
        id: "bntr-002",
        name: "Dainty Layering Necklace Set",
        type: "necklace",
        material: "Gold-Plated Sterling Silver",
        sku: "BNTR-DLN-002",
        price: "79",
        description: "Three delicate layering necklaces designed to wear together. Stars, hearts, and bar pendants.",
        tags: ["Layering", "Gold Plated", "Set"],
      },
      {
        id: "bntr-003",
        name: "Crystal Huggie Hoops",
        type: "earrings",
        material: "Gold-Plated Brass, Crystal",
        sku: "BNTR-CHH-003",
        price: "35",
        description: "Snug-fitting huggie hoops with a row of sparkling crystals. Perfect for second or third piercings.",
        tags: ["Huggies", "Crystal", "Stackable"],
      },
      {
        id: "bntr-004",
        name: "Beaded Stretch Bracelet Set",
        type: "bracelet",
        material: "Natural Stone Beads, Gold-Plated Accents",
        sku: "BNTR-BSB-004",
        price: "55",
        description: "A set of three natural stone stretch bracelets — amethyst, rose quartz, and tiger's eye — with gold accents.",
        tags: ["Beaded", "Natural Stone", "Set"],
      },
    ],
  },
  {
    id: "blue-nile",
    retailerName: "Blue Nile",
    tagline: "World's largest online diamond jeweler",
    accentColor: "#004085",
    accentLight: "#E8F0FB",
    catalogUrl: "https://www.bluenile.com",
    syncCode: "BN2025",
    contact: {
      bookingUrl: "https://www.bluenile.com/appointment",
      phone: "(888) 565-7641",
    },
    items: [
      {
        id: "bn-001",
        name: "Astor by Blue Nile Solitaire",
        type: "ring",
        material: "Platinum, Astor Ideal Cut Diamond",
        sku: "BN-ABS-001",
        price: "6750",
        description: "Built with Blue Nile's exclusive Astor Ideal Cut diamond — independently certified for maximum brilliance.",
        tags: ["Engagement", "Astor", "Ideal Cut"],
      },
      {
        id: "bn-002",
        name: "Build Your Own Ring",
        type: "ring",
        material: "Platinum or Gold, Choose Your Diamond",
        sku: "BN-BYO-002",
        price: "varies",
        description: "Start with a setting, choose your diamond. Blue Nile's custom ring builder lets you design exactly what you want.",
        tags: ["Custom", "Engagement", "Build Your Own"],
      },
      {
        id: "bn-003",
        name: "Diamond Station Necklace",
        type: "necklace",
        material: "14k White Gold, 0.25ct Diamond",
        sku: "BN-DSN-003",
        price: "425",
        description: "Floating diamonds set at even intervals along a delicate 14k white gold chain. Effortless everyday luxury.",
        tags: ["Station", "Diamond", "Layering"],
      },
      {
        id: "bn-004",
        name: "Classic Diamond Tennis Bracelet",
        type: "bracelet",
        material: "14k White Gold, 3ct Diamond",
        sku: "BN-CTB-004",
        price: "3950",
        description: "Three carats of round brilliant diamonds in a classic prong-set tennis bracelet. Timeless and iconic.",
        tags: ["Tennis", "Diamond", "Classic"],
      },
    ],
  },
  {
    id: "james-allen",
    retailerName: "James Allen",
    tagline: "See every detail, build your dream ring",
    accentColor: "#2D2D2D",
    accentLight: "#F5F5F5",
    catalogUrl: "https://www.jamesallen.com",
    syncCode: "JA2025",
    contact: {
      bookingUrl: "https://www.jamesallen.com/virtual-appointment/",
      phone: "(877) 826-9866",
    },
    items: [
      {
        id: "ja-001",
        name: "True Hearts Diamond Solitaire",
        type: "ring",
        material: "14k White Gold, True Hearts Diamond",
        sku: "JA-THS-001",
        price: "3850",
        description: "James Allen's True Hearts diamonds display a perfect hearts-and-arrows pattern — the most precise ideal cut available.",
        tags: ["Engagement", "True Hearts", "Ideal Cut"],
      },
      {
        id: "ja-002",
        name: "Pavé Halo Engagement Ring",
        type: "ring",
        material: "18k Rose Gold, Diamond",
        sku: "JA-PHR-002",
        price: "2250",
        description: "A dreamy double halo setting with micro-pavé diamonds cascading down the shank. Modern romance in rose gold.",
        tags: ["Halo", "Pavé", "Rose Gold"],
      },
      {
        id: "ja-003",
        name: "Diamond Bezel Necklace",
        type: "necklace",
        material: "14k Yellow Gold, 0.3ct Diamond",
        sku: "JA-DBN-003",
        price: "545",
        description: "A round brilliant diamond in a sleek bezel setting on a fine yellow gold chain. Minimal and modern.",
        tags: ["Bezel", "Diamond", "Minimalist"],
      },
      {
        id: "ja-004",
        name: "Eternity Band",
        type: "ring",
        material: "Platinum, 1ct Diamond",
        sku: "JA-ETB-004",
        price: "2950",
        description: "A full eternity band with one carat of perfectly matched round brilliant diamonds set in polished platinum.",
        tags: ["Eternity", "Band", "Platinum"],
      },
    ],
  },
];

export function getCatalogById(id: string): PartnerCatalog | undefined {
  return PARTNER_CATALOGS.find((c) => c.id === id);
}

export function getCatalogBySyncCode(code: string): PartnerCatalog | undefined {
  return PARTNER_CATALOGS.find(
    (c) => c.syncCode.toLowerCase() === code.trim().toUpperCase()
  );
}
