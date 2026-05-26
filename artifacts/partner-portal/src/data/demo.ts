export const RETAILER_NAME = "Kay Jewelers";

export const KPI = {
  customersReached: 127,
  activeWishlists: 89,
  totalWishlistValue: 284500,
  avgItemsPerCustomer: 3.2,
  quoteRequests: 23,
  itemsSharedToStore: 312,
};

export const MONTHLY_ACTIVITY = [
  { month: "Dec", wishlists: 38, shares: 91, quoteRequests: 8 },
  { month: "Jan", wishlists: 52, shares: 124, quoteRequests: 11 },
  { month: "Feb", wishlists: 61, shares: 143, quoteRequests: 14 },
  { month: "Mar", wishlists: 74, shares: 178, quoteRequests: 16 },
  { month: "Apr", wishlists: 83, shares: 219, quoteRequests: 20 },
  { month: "May", wishlists: 89, shares: 312, quoteRequests: 23 },
];

export const TYPE_BREAKDOWN = [
  { type: "Ring", count: 124, value: 112800 },
  { type: "Bracelet", count: 78, value: 68400 },
  { type: "Necklace", count: 62, value: 54200 },
  { type: "Earrings", count: 31, value: 22100 },
  { type: "Watch", count: 11, value: 19800 },
  { type: "Pendant", count: 6, value: 7200 },
];

export const PRICE_RANGE_DATA = [
  { range: "Under $500", count: 24, pct: 8 },
  { range: "$500–$1K", count: 68, pct: 22 },
  { range: "$1K–$5K", count: 140, pct: 45 },
  { range: "$5K–$10K", count: 56, pct: 18 },
  { range: "$10K+", count: 24, pct: 7 },
];

export const TOP_SKUS = [
  { sku: "19026965", name: "Diamond Solitaire Ring", saves: 34, avgPrice: 2199 },
  { sku: "LE-LDR-001", name: "Leo Diamond Engagement Ring", saves: 28, avgPrice: 4499 },
  { sku: "19098421", name: "White Gold Tennis Bracelet", saves: 22, avgPrice: 1299 },
  { sku: "V-CLN-004", name: "Neil Lane Halo Ring", saves: 19, avgPrice: 3199 },
  { sku: "19044712", name: "Diamond Drop Earrings", saves: 17, avgPrice: 799 },
  { sku: "19011893", name: "Open Hearts Necklace", saves: 14, avgPrice: 499 },
  { sku: "EM-SOL-007", name: "Emerald Solitaire Pendant", saves: 12, avgPrice: 1599 },
  { sku: "19067234", name: "Sapphire Three-Stone Ring", saves: 11, avgPrice: 2799 },
];

export const TOP_BRANDS = [
  { brand: "Neil Lane", saves: 87 },
  { brand: "Leo Diamond", saves: 72 },
  { brand: "Open Hearts", saves: 54 },
  { brand: "Vera Wang LOVE", saves: 38 },
  { brand: "Le Vian", saves: 31 },
  { brand: "Disney", saves: 18 },
  { brand: "Enchanted Disney", saves: 12 },
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
    name: "Megan Torres",
    phone: "(404) 555-0192",
    email: "megan.t@gmail.com",
    itemCount: 5,
    topItem: "Leo Diamond Engagement Ring",
    topSku: "LE-LDR-001",
    estimatedValue: 6800,
    priority: "high",
    sharedDate: "May 24, 2026",
    location: "Atlanta, GA",
  },
  {
    id: "2",
    name: "James Whitfield",
    phone: "(312) 555-0847",
    email: "jwhitfield@outlook.com",
    itemCount: 3,
    topItem: "Diamond Solitaire Ring",
    topSku: "19026965",
    estimatedValue: 4200,
    priority: "high",
    sharedDate: "May 23, 2026",
    location: "Chicago, IL",
  },
  {
    id: "3",
    name: "Priya Nair",
    phone: "(415) 555-0374",
    email: "priya.nair@icloud.com",
    itemCount: 4,
    topItem: "Neil Lane Halo Ring",
    topSku: "V-CLN-004",
    estimatedValue: 5100,
    priority: "high",
    sharedDate: "May 22, 2026",
    location: "San Francisco, CA",
  },
  {
    id: "4",
    name: "Derek Johnson",
    phone: "(713) 555-0251",
    email: "djohnson22@gmail.com",
    itemCount: 2,
    topItem: "White Gold Tennis Bracelet",
    topSku: "19098421",
    estimatedValue: 2100,
    priority: "medium",
    sharedDate: "May 21, 2026",
    location: "Houston, TX",
  },
  {
    id: "5",
    name: "Sophia Kim",
    phone: "(206) 555-0689",
    email: "s.kim@gmail.com",
    itemCount: 6,
    topItem: "Sapphire Three-Stone Ring",
    topSku: "19067234",
    estimatedValue: 7400,
    priority: "high",
    sharedDate: "May 20, 2026",
    location: "Seattle, WA",
  },
  {
    id: "6",
    name: "Marcus Webb",
    phone: "(305) 555-0912",
    email: "marcuswebb@yahoo.com",
    itemCount: 2,
    topItem: "Open Hearts Necklace",
    topSku: "19011893",
    estimatedValue: 900,
    priority: "low",
    sharedDate: "May 19, 2026",
    location: "Miami, FL",
  },
  {
    id: "7",
    name: "Aisha Coleman",
    phone: "(202) 555-0143",
    email: "aisha.c@gmail.com",
    itemCount: 3,
    topItem: "Diamond Drop Earrings",
    topSku: "19044712",
    estimatedValue: 2400,
    priority: "medium",
    sharedDate: "May 18, 2026",
    location: "Washington, DC",
  },
  {
    id: "8",
    name: "Ryan Castillo",
    phone: "(602) 555-0378",
    email: "rcastillo@icloud.com",
    itemCount: 1,
    topItem: "Emerald Solitaire Pendant",
    topSku: "EM-SOL-007",
    estimatedValue: 1600,
    priority: "low",
    sharedDate: "May 17, 2026",
    location: "Phoenix, AZ",
  },
  {
    id: "9",
    name: "Lauren Park",
    phone: "(617) 555-0524",
    email: "lpark@gmail.com",
    itemCount: 4,
    topItem: "Vera Wang LOVE Ring",
    topSku: "VW-LVE-002",
    estimatedValue: 3900,
    priority: "medium",
    sharedDate: "May 16, 2026",
    location: "Boston, MA",
  },
  {
    id: "10",
    name: "Brandon Ellis",
    phone: "(503) 555-0761",
    email: "bellis@outlook.com",
    itemCount: 2,
    topItem: "Le Vian Chocolate Diamond Ring",
    topSku: "LV-CHC-009",
    estimatedValue: 2800,
    priority: "medium",
    sharedDate: "May 15, 2026",
    location: "Portland, OR",
  },
];
