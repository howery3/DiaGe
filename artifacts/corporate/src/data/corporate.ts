export const PLATFORM_KPIS = {
  totalUsers: 12847,
  mau: 8432,
  dauMauPct: 34.2,
  retention30d: 68,
  totalWishlistValue: 48300000,
  quoteRequests: 2847,
  partnerRetailers: 23,
  totalItemsTracked: 94200,
};

export const MONTHLY_GROWTH = [
  { month: "Jan", users: 4200, mau: 2800, events: 18400, value: 14100000 },
  { month: "Feb", users: 6100, mau: 3900, events: 24700, value: 19800000 },
  { month: "Mar", users: 8400, mau: 5100, events: 31200, value: 27400000 },
  { month: "Apr", users: 10600, mau: 6700, events: 39800, value: 36700000 },
  { month: "May", users: 12847, mau: 8432, events: 47200, value: 48300000 },
];

export const FEATURE_ADOPTION = [
  { feature: "Collection", users: 11940, pct: 93 },
  { feature: "Wishlist", users: 10019, pct: 78 },
  { feature: "Protect / Insurance", users: 7197, pct: 56 },
  { feature: "Reminders", users: 6295, pct: 49 },
  { feature: "Partner Browse", users: 4312, pct: 34 },
  { feature: "Profile Share", users: 2955, pct: 23 },
];

export const RETENTION_COHORT = [
  { label: "Day 1", pct: 100 },
  { label: "Day 7", pct: 81 },
  { label: "Day 14", pct: 74 },
  { label: "Day 30", pct: 68 },
  { label: "Day 60", pct: 59 },
  { label: "Day 90", pct: 53 },
];

export const FUNNEL_STAGES = [
  { stage: "App Installs",         count: 12847, pct: 100,  color: "#5B21B6", note: "Total registered users" },
  { stage: "Wishlist Active",       count: 10019, pct: 78,   color: "#6D28D9", note: "Users with ≥1 saved item" },
  { stage: "Shared with Store",     count: 3210,  pct: 32,   color: "#7C3AED", note: "% of wishlist-active users" },
  { stage: "Lead Contacted",        count: 2183,  pct: 68,   color: "#8B5CF6", note: "% of shared leads" },
  { stage: "In-Store Visit",        count: 1483,  pct: 68,   color: "#A78BFA", note: "% of contacted leads" },
  { stage: "Purchase Attributed",   count: 892,   pct: 60,   color: "#C4B5FD", note: "% of store visits" },
];

export const ATV_COMPARISON = [
  { label: "DiaGe Users",         value: 2847, highlight: true },
  { label: "Signet Avg Customer", value: 1240, highlight: false },
  { label: "Jewelry Retail Avg",  value: 890,  highlight: false },
];

export const ATV_BY_CATEGORY = [
  { category: "Engagement Rings",  atv: 4847 },
  { category: "Bridal Sets",       atv: 6284 },
  { category: "Fine Jewelry",      atv: 2341 },
  { category: "Watches",           atv: 3210 },
  { category: "Fashion Jewelry",   atv: 891  },
  { category: "Accessories",       atv: 412  },
];

export const ATV_BY_BANNER = [
  { banner: "Jared",                    atv: 3847, type: "signet" as const },
  { banner: "Kay Jewelers",             atv: 2592, type: "signet" as const },
  { banner: "Zales",                    atv: 2341, type: "signet" as const },
  { banner: "Banter by Piercing Pagoda",atv: 498,  type: "signet" as const },
];

export const TRAFFIC_SOURCES = [
  { source: "In-App Retailer Browser", pct: 38, users: 4882, color: "#5B21B6" },
  { source: "External Product Link",   pct: 27, users: 3469, color: "#7C3AED" },
  { source: "In-Store QR Scan",        pct: 19, users: 2441, color: "#8B5CF6" },
  { source: "Manual SKU Entry",        pct: 11, users: 1413, color: "#A78BFA" },
  { source: "Organic / Other",         pct: 5,  users: 642,  color: "#C4B5FD" },
];

export const CONVERSION_BENCHMARKS = [
  { metric: "App Install → Purchase",     diage: 6.9,  industry: 1.2,  label: "6.9% vs 1.2% avg" },
  { metric: "Lead → Store Visit",         diage: 68,   industry: 22,   label: "68% vs 22% avg" },
  { metric: "Store Visit → Purchase",     diage: 60.2, industry: 31,   label: "60% vs 31% avg" },
  { metric: "Wishlist → Quote Request",   diage: 88.7, industry: 12,   label: "89% vs 12% avg" },
];

export const SESSION_METRICS = {
  sessionsPerWeek: 3.2,
  avgSessionMinutes: 8.4,
  avgItemsViewed: 6.7,
  wishlistAddRate: 73,
  pushNotifOptIn: 81,
  retailerBrowseRate: 58,
};

export const WEEKLY_SESSIONS = [
  { week: "W1 Jan", sessions: 1.8 },
  { week: "W2 Jan", sessions: 2.1 },
  { week: "W3 Jan", sessions: 2.3 },
  { week: "W4 Jan", sessions: 2.6 },
  { week: "W1 Feb", sessions: 2.8 },
  { week: "W2 Feb", sessions: 2.9 },
  { week: "W3 Feb", sessions: 3.0 },
  { week: "W4 Feb", sessions: 3.1 },
  { week: "W1 Mar", sessions: 3.1 },
  { week: "W2 Mar", sessions: 3.2 },
  { week: "W3 Mar", sessions: 3.2 },
  { week: "W4 Mar", sessions: 3.2 },
];

export const SIGNET_PROJECTION = {
  addressableCustomers: 9300000,
  projectedAdoptionPct: 18,
  projectedUsers: 1674000,
  projectedWishlistValue: 6800000000,
  projectedQuoteRequests: 214000,
  bannerCount: 4,
  locationCount: 2800,
  timeframeYears: 3,
};

export interface RetailerKPI {
  name: string;
  type: "signet" | "partner";
  location: string;
  customers: number;
  activeWishlists: number;
  totalWishlistValue: number;
  quoteRequests: number;
  avgItemsPerCustomer: number;
  conversionRate: number;
}

export const RETAILER_KPIS: RetailerKPI[] = [
  {
    name: "Kay Jewelers",
    type: "signet",
    location: "National · 900+ locations",
    customers: 843,
    activeWishlists: 612,
    totalWishlistValue: 2184700,
    quoteRequests: 134,
    avgItemsPerCustomer: 4.7,
    conversionRate: 18.4,
  },
  {
    name: "Jared",
    type: "signet",
    location: "National · 200+ locations",
    customers: 621,
    activeWishlists: 441,
    totalWishlistValue: 1803200,
    quoteRequests: 98,
    avgItemsPerCustomer: 4.1,
    conversionRate: 16.2,
  },
  {
    name: "Zales",
    type: "signet",
    location: "National · 700+ locations",
    customers: 487,
    activeWishlists: 334,
    totalWishlistValue: 1142800,
    quoteRequests: 67,
    avgItemsPerCustomer: 3.8,
    conversionRate: 14.7,
  },
  {
    name: "Banter by Piercing Pagoda",
    type: "signet",
    location: "National · 800+ kiosk locations",
    customers: 312,
    activeWishlists: 219,
    totalWishlistValue: 622400,
    quoteRequests: 41,
    avgItemsPerCustomer: 3.2,
    conversionRate: 13.1,
  },
  {
    name: "Brilliant Earth",
    type: "partner",
    location: "National + online",
    customers: 234,
    activeWishlists: 178,
    totalWishlistValue: 842300,
    quoteRequests: 48,
    avgItemsPerCustomer: 5.1,
    conversionRate: 21.4,
  },
  {
    name: "Pandora",
    type: "partner",
    location: "National · 350+ locations",
    customers: 189,
    activeWishlists: 143,
    totalWishlistValue: 421700,
    quoteRequests: 39,
    avgItemsPerCustomer: 4.9,
    conversionRate: 20.1,
  },
  {
    name: "Blue Nile",
    type: "partner",
    location: "Online-first + 10 showrooms",
    customers: 156,
    activeWishlists: 112,
    totalWishlistValue: 634400,
    quoteRequests: 31,
    avgItemsPerCustomer: 4.6,
    conversionRate: 19.8,
  },
  {
    name: "Mejuri",
    type: "partner",
    location: "North America · 30+ locations",
    customers: 142,
    activeWishlists: 98,
    totalWishlistValue: 312800,
    quoteRequests: 28,
    avgItemsPerCustomer: 4.2,
    conversionRate: 18.9,
  },
];

export const METROS = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Atlanta",
  "Dallas",
  "Miami",
  "Seattle",
  "Boston",
  "San Francisco",
];

export interface SkuGeoRow {
  sku: string;
  name: string;
  retailer: string;
  avgPrice: number;
  totalSaves: number;
  byMetro: Record<string, number>;
}

export const SKU_GEO_DATA: SkuGeoRow[] = [
  {
    sku: "19026965",
    name: "Diamond Solitaire Ring",
    retailer: "Kay Jewelers",
    avgPrice: 2199,
    totalSaves: 2841,
    byMetro: {
      "New York": 412, "Los Angeles": 387, "Chicago": 298, "Houston": 241,
      "Atlanta": 219, "Dallas": 198, "Miami": 187, "Seattle": 164, "Boston": 143, "San Francisco": 122,
    },
  },
  {
    sku: "LE-LDR-001",
    name: "Leo Diamond Engagement Ring",
    retailer: "Kay Jewelers",
    avgPrice: 4499,
    totalSaves: 2314,
    byMetro: {
      "New York": 378, "Los Angeles": 341, "Chicago": 254, "Houston": 201,
      "Atlanta": 187, "Dallas": 176, "Miami": 158, "Seattle": 143, "Boston": 128, "San Francisco": 108,
    },
  },
  {
    sku: "V-CLN-004",
    name: "Neil Lane Halo Ring",
    retailer: "Kay Jewelers",
    avgPrice: 3199,
    totalSaves: 1987,
    byMetro: {
      "New York": 321, "Los Angeles": 298, "Chicago": 218, "Houston": 178,
      "Atlanta": 164, "Dallas": 154, "Miami": 141, "Seattle": 124, "Boston": 109, "San Francisco": 98,
    },
  },
  {
    sku: "19098421",
    name: "White Gold Tennis Bracelet",
    retailer: "Kay Jewelers",
    avgPrice: 1299,
    totalSaves: 1743,
    byMetro: {
      "New York": 287, "Los Angeles": 261, "Chicago": 189, "Houston": 156,
      "Atlanta": 142, "Dallas": 134, "Miami": 128, "Seattle": 108, "Boston": 97, "San Francisco": 88,
    },
  },
  {
    sku: "LV-CHC-009",
    name: "Le Vian Chocolate Diamond Ring",
    retailer: "Jared",
    avgPrice: 2800,
    totalSaves: 1521,
    byMetro: {
      "New York": 248, "Los Angeles": 231, "Chicago": 167, "Houston": 134,
      "Atlanta": 122, "Dallas": 118, "Miami": 111, "Seattle": 97, "Boston": 86, "San Francisco": 74,
    },
  },
  {
    sku: "JR-NL-8812",
    name: "Neil Lane Bridal Set",
    retailer: "Jared",
    avgPrice: 5200,
    totalSaves: 1387,
    byMetro: {
      "New York": 228, "Los Angeles": 214, "Chicago": 152, "Houston": 121,
      "Atlanta": 112, "Dallas": 107, "Miami": 98, "Seattle": 88, "Boston": 78, "San Francisco": 66,
    },
  },
  {
    sku: "ZL-DTN-441090",
    name: "Diamond Tennis Necklace",
    retailer: "Zales",
    avgPrice: 6400,
    totalSaves: 1198,
    byMetro: {
      "New York": 198, "Los Angeles": 187, "Chicago": 132, "Houston": 107,
      "Atlanta": 97, "Dallas": 91, "Miami": 84, "Seattle": 74, "Boston": 67, "San Francisco": 58,
    },
  },
  {
    sku: "ZL-HSR-220",
    name: "Vera Wang LOVE Ring",
    retailer: "Zales",
    avgPrice: 1899,
    totalSaves: 1041,
    byMetro: {
      "New York": 172, "Los Angeles": 158, "Chicago": 114, "Houston": 91,
      "Atlanta": 84, "Dallas": 78, "Miami": 71, "Seattle": 62, "Boston": 55, "San Francisco": 47,
    },
  },
  {
    sku: "BP-PP-STK-7",
    name: "Stackable Diamond Ring Set",
    retailer: "Banter by Piercing Pagoda",
    avgPrice: 449,
    totalSaves: 892,
    byMetro: {
      "New York": 148, "Los Angeles": 134, "Chicago": 97, "Houston": 78,
      "Atlanta": 71, "Dallas": 68, "Miami": 61, "Seattle": 52, "Boston": 47, "San Francisco": 39,
    },
  },
];
