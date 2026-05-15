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
    id: "brilliant-earth",
    retailerName: "Brilliant Earth",
    tagline: "Sustainable fine jewelry",
    accentColor: "#0E6655",
    accentLight: "#E8F5F2",
    catalogUrl: "https://www.brilliantearth.com",
    syncCode: "BE2025",
    contact: {
      bookingUrl: "https://www.brilliantearth.com/appointments/",
    },
    items: [
      {
        id: "be-001",
        name: "Lab Diamond Solitaire Ring",
        type: "ring",
        material: "Recycled 14k Gold, 1ct Lab Diamond",
        sku: "BE-LDR-001",
        price: "2890",
        description: "A classic round brilliant solitaire set in recycled 14k gold. Conflict-free, sustainably sourced.",
        tags: ["Engagement", "Solitaire", "Lab Diamond"],
      },
      {
        id: "be-002",
        name: "Aquamarine Drop Earrings",
        type: "earrings",
        material: "14k Yellow Gold, Natural Aquamarine",
        sku: "BE-ADE-002",
        price: "895",
        description: "Ethereal aquamarine drops in warm 14k yellow gold. Sustainably sourced gemstones.",
        tags: ["Gemstone", "Drops", "Aquamarine"],
      },
      {
        id: "be-003",
        name: "Petite Diamond Tennis Bracelet",
        type: "bracelet",
        material: "14k White Gold, 0.5ct Diamond",
        sku: "BE-DTB-003",
        price: "1490",
        description: "Delicate and stackable. Half-carat of conflict-free round diamonds set in polished 14k white gold.",
        tags: ["Tennis", "Diamond", "Stackable"],
      },
      {
        id: "be-004",
        name: "Pavé Diamond Pendant",
        type: "necklace",
        material: "14k Rose Gold, Diamond Pavé",
        sku: "BE-PDN-004",
        price: "650",
        description: "A subtle diamond pavé disc pendant on a delicate rose gold chain. Everyday elegance.",
        tags: ["Pavé", "Pendant", "Rose Gold"],
      },
    ],
  },
  {
    id: "mejuri",
    retailerName: "Mejuri",
    tagline: "Fine everyday jewelry",
    accentColor: "#1A1A1A",
    accentLight: "#F5F4F0",
    catalogUrl: "https://mejuri.com",
    syncCode: "MJ2025",
    contact: {
      bookingUrl: "https://mejuri.com/pages/stores",
    },
    items: [
      {
        id: "mj-001",
        name: "Gold Dome Ring",
        type: "ring",
        material: "14k Solid Gold",
        sku: "MJ-GDR-001",
        price: "195",
        description: "A bold dome silhouette in solid 14k gold. Wear solo or stacked.",
        tags: ["Dome", "Solid Gold", "Stackable"],
      },
      {
        id: "mj-002",
        name: "Pearl Charm Necklace",
        type: "necklace",
        material: "14k Gold Vermeil, Freshwater Pearl",
        sku: "MJ-PCN-002",
        price: "178",
        description: "A single freshwater pearl charm on a delicate vermeil chain. Modern heirloom energy.",
        tags: ["Pearl", "Charm", "Vermeil"],
      },
      {
        id: "mj-003",
        name: "Diamond Pavé Hoops",
        type: "earrings",
        material: "14k Solid Gold, Diamond Pavé",
        sku: "MJ-PHE-003",
        price: "325",
        description: "Everyday hoops with a full pavé of diamonds. The perfect balance of subtle and sparkly.",
        tags: ["Hoops", "Diamond", "Everyday"],
      },
      {
        id: "mj-004",
        name: "Bold Chain Bracelet",
        type: "bracelet",
        material: "Sterling Silver",
        sku: "MJ-BCB-004",
        price: "128",
        description: "An oversized chain link bracelet in polished sterling silver. Makes a statement.",
        tags: ["Chain", "Silver", "Statement"],
      },
    ],
  },
  {
    id: "tacori",
    retailerName: "Tacori",
    tagline: "Bridal & fine jewelry specialists",
    accentColor: "#7B3FA0",
    accentLight: "#F8F0FF",
    catalogUrl: "https://www.tacori.com",
    syncCode: "TC2025",
    contact: {
      bookingUrl: "https://www.tacori.com/retailer-locator/",
      phone: "(800) 822-6748",
    },
    items: [
      {
        id: "tc-001",
        name: "Dantela Solitaire",
        type: "ring",
        material: "Platinum, Round Brilliant Diamond",
        sku: "TC-DSR-001",
        price: "4200",
        description: "The iconic Dantela collection — intricate lace-inspired detailing surrounds a brilliant center stone.",
        tags: ["Engagement", "Platinum", "Bridal"],
      },
      {
        id: "tc-002",
        name: "Simply Tacori Band",
        type: "ring",
        material: "18k Rose Gold, Diamond",
        sku: "TC-STB-002",
        price: "1950",
        description: "A crescent-set diamond wedding band. The perfect complement to any Tacori engagement ring.",
        tags: ["Wedding Band", "Rose Gold", "Bridal"],
      },
      {
        id: "tc-003",
        name: "Diamond Crescent Earrings",
        type: "earrings",
        material: "18k White Gold, 0.75ct Diamond",
        sku: "TC-DCE-003",
        price: "2850",
        description: "Tacori's signature crescent silhouette in diamond-set white gold. Timeless and wearable.",
        tags: ["Crescent", "Diamond", "White Gold"],
      },
      {
        id: "tc-004",
        name: "Sculpted Crescent Necklace",
        type: "necklace",
        material: "18k White Gold, Diamond",
        sku: "TC-SCN-004",
        price: "3100",
        description: "A flowing sculpted crescent pendant set with diamonds. Part of Tacori's signature collection.",
        tags: ["Crescent", "Pendant", "Diamond"],
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
];

export function getCatalogById(id: string): PartnerCatalog | undefined {
  return PARTNER_CATALOGS.find((c) => c.id === id);
}

export function getCatalogBySyncCode(code: string): PartnerCatalog | undefined {
  return PARTNER_CATALOGS.find(
    (c) => c.syncCode.toLowerCase() === code.trim().toUpperCase()
  );
}
