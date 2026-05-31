export const RETAILER_NAME = "Kay Jewelers";

export const KPI = {
  customersReached: 843,
  activeWishlists: 612,
  totalWishlistValue: 2184700,
  avgItemsPerCustomer: 4.7,
  quoteRequests: 134,
  itemsSharedToStore: 2391,
};

export const MONTHLY_ACTIVITY = [
  { month: "Dec", wishlists: 198, shares: 541, quoteRequests: 22 },
  { month: "Jan", wishlists: 274, shares: 734, quoteRequests: 41 },
  { month: "Feb", wishlists: 361, shares: 968, quoteRequests: 58 },
  { month: "Mar", wishlists: 448, shares: 1274, quoteRequests: 79 },
  { month: "Apr", wishlists: 529, shares: 1812, quoteRequests: 107 },
  { month: "May", wishlists: 612, shares: 2391, quoteRequests: 134 },
];

export const TYPE_BREAKDOWN = [
  { type: "Ring", count: 891, value: 812400 },
  { type: "Bracelet", count: 534, value: 468200 },
  { type: "Necklace", count: 423, value: 371800 },
  { type: "Earrings", count: 312, value: 198400 },
  { type: "Watch", count: 187, value: 248900 },
  { type: "Pendant", count: 44, value: 84900 },
];

export const PRICE_RANGE_DATA = [
  { range: "Under $500", count: 148, pct: 6 },
  { range: "$500–$1K", count: 421, pct: 17 },
  { range: "$1K–$5K", count: 1124, pct: 47 },
  { range: "$5K–$10K", count: 548, pct: 23 },
  { range: "$10K+", count: 150, pct: 7 },
];

export const TOP_SKUS = [
  { sku: "19026965", name: "Diamond Solitaire Ring", saves: 214, avgPrice: 2199 },
  { sku: "LE-LDR-001", name: "Leo Diamond Engagement Ring", saves: 187, avgPrice: 4499 },
  { sku: "19098421", name: "White Gold Tennis Bracelet", saves: 163, avgPrice: 1299 },
  { sku: "V-CLN-004", name: "Neil Lane Halo Ring", saves: 141, avgPrice: 3199 },
  { sku: "19044712", name: "Diamond Drop Earrings", saves: 128, avgPrice: 799 },
  { sku: "19011893", name: "Open Hearts Necklace", saves: 112, avgPrice: 499 },
  { sku: "EM-SOL-007", name: "Emerald Solitaire Pendant", saves: 94, avgPrice: 1599 },
  { sku: "19067234", name: "Sapphire Three-Stone Ring", saves: 87, avgPrice: 2799 },
];

export const TOP_BRANDS = [
  { brand: "Neil Lane", saves: 534 },
  { brand: "Leo Diamond", saves: 487 },
  { brand: "Open Hearts", saves: 341 },
  { brand: "Vera Wang LOVE", saves: 278 },
  { brand: "Le Vian", saves: 231 },
  { brand: "Disney", saves: 148 },
  { brand: "Enchanted Disney", saves: 94 },
];

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  itemCount: number;
  topItem: string;
  topSku: string;
  estimatedValue: number;
  priority: "high" | "medium" | "low";
  sharedDate: string;
  location: string;
}

export const LEADS: Lead[] = [
  {
    id: "1",
    name: "Sophia Kim",
    phone: "(206) 555-0689",
    email: "s.kim@gmail.com",
    itemCount: 8,
    topItem: "Leo Diamond Engagement Ring",
    topSku: "LE-LDR-001",
    estimatedValue: 18400,
    priority: "high",
    sharedDate: "May 30, 2026",
    location: "Seattle, WA",
  },
  {
    id: "2",
    name: "James Whitfield",
    phone: "(312) 555-0847",
    email: "jwhitfield@outlook.com",
    itemCount: 6,
    topItem: "Neil Lane Halo Ring",
    topSku: "V-CLN-004",
    estimatedValue: 14700,
    priority: "high",
    sharedDate: "May 29, 2026",
    location: "Chicago, IL",
  },
  {
    id: "3",
    name: "Megan Torres",
    phone: "(404) 555-0192",
    email: "megan.t@gmail.com",
    itemCount: 5,
    topItem: "Diamond Solitaire Ring",
    topSku: "19026965",
    estimatedValue: 9800,
    priority: "high",
    sharedDate: "May 29, 2026",
    location: "Atlanta, GA",
  },
  {
    id: "4",
    name: "Priya Nair",
    phone: "(415) 555-0374",
    email: "priya.nair@icloud.com",
    itemCount: 7,
    topItem: "Sapphire Three-Stone Ring",
    topSku: "19067234",
    estimatedValue: 12100,
    priority: "high",
    sharedDate: "May 28, 2026",
    location: "San Francisco, CA",
  },
  {
    id: "5",
    name: "Lauren Park",
    phone: "(617) 555-0524",
    email: "lpark@gmail.com",
    itemCount: 4,
    topItem: "Vera Wang LOVE Ring",
    topSku: "VW-LVE-002",
    estimatedValue: 7300,
    priority: "high",
    sharedDate: "May 27, 2026",
    location: "Boston, MA",
  },
  {
    id: "6",
    name: "Derek Johnson",
    phone: "(713) 555-0251",
    email: "djohnson22@gmail.com",
    itemCount: 3,
    topItem: "White Gold Tennis Bracelet",
    topSku: "19098421",
    estimatedValue: 4800,
    priority: "medium",
    sharedDate: "May 26, 2026",
    location: "Houston, TX",
  },
  {
    id: "7",
    name: "Aisha Coleman",
    phone: "(202) 555-0143",
    email: "aisha.c@gmail.com",
    itemCount: 4,
    topItem: "Le Vian Chocolate Diamond Ring",
    topSku: "LV-CHC-009",
    estimatedValue: 6200,
    priority: "medium",
    sharedDate: "May 25, 2026",
    location: "Washington, DC",
  },
  {
    id: "8",
    name: "Brandon Ellis",
    phone: "(503) 555-0761",
    email: "bellis@outlook.com",
    itemCount: 3,
    topItem: "Leo Diamond Engagement Ring",
    topSku: "LE-LDR-001",
    estimatedValue: 5900,
    priority: "medium",
    sharedDate: "May 24, 2026",
    location: "Portland, OR",
  },
  {
    id: "9",
    name: "Marcus Webb",
    phone: "(305) 555-0912",
    email: "marcuswebb@yahoo.com",
    itemCount: 2,
    topItem: "Diamond Drop Earrings",
    topSku: "19044712",
    estimatedValue: 2400,
    priority: "medium",
    sharedDate: "May 23, 2026",
    location: "Miami, FL",
  },
  {
    id: "10",
    name: "Ryan Castillo",
    phone: "(602) 555-0378",
    email: "rcastillo@icloud.com",
    itemCount: 2,
    topItem: "Emerald Solitaire Pendant",
    topSku: "EM-SOL-007",
    estimatedValue: 3200,
    priority: "low",
    sharedDate: "May 22, 2026",
    location: "Phoenix, AZ",
  },
];
