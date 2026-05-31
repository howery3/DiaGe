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

export interface RetailerKPI {
  name: string;
  type: "mass" | "independent";
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
    type: "mass",
    location: "National",
    customers: 843,
    activeWishlists: 612,
    totalWishlistValue: 2184700,
    quoteRequests: 134,
    avgItemsPerCustomer: 4.7,
    conversionRate: 18.4,
  },
  {
    name: "Jared",
    type: "mass",
    location: "National",
    customers: 621,
    activeWishlists: 441,
    totalWishlistValue: 1803200,
    quoteRequests: 98,
    avgItemsPerCustomer: 4.1,
    conversionRate: 16.2,
  },
  {
    name: "Zales",
    type: "mass",
    location: "National",
    customers: 487,
    activeWishlists: 334,
    totalWishlistValue: 1142800,
    quoteRequests: 67,
    avgItemsPerCustomer: 3.8,
    conversionRate: 14.7,
  },
  {
    name: "Helzberg Diamonds",
    type: "mass",
    location: "National",
    customers: 312,
    activeWishlists: 219,
    totalWishlistValue: 784100,
    quoteRequests: 41,
    avgItemsPerCustomer: 3.4,
    conversionRate: 13.1,
  },
  {
    name: "Bella Fine Jewelers",
    type: "independent",
    location: "New York, NY",
    customers: 234,
    activeWishlists: 178,
    totalWishlistValue: 842300,
    quoteRequests: 48,
    avgItemsPerCustomer: 5.1,
    conversionRate: 21.4,
  },
  {
    name: "The Diamond Exchange",
    type: "independent",
    location: "Chicago, IL",
    customers: 189,
    activeWishlists: 143,
    totalWishlistValue: 621700,
    quoteRequests: 39,
    avgItemsPerCustomer: 4.9,
    conversionRate: 20.1,
  },
  {
    name: "Prestige Jewelers",
    type: "independent",
    location: "Miami, FL",
    customers: 156,
    activeWishlists: 112,
    totalWishlistValue: 534400,
    quoteRequests: 31,
    avgItemsPerCustomer: 4.6,
    conversionRate: 19.8,
  },
  {
    name: "Crown Jewels",
    type: "independent",
    location: "Houston, TX",
    customers: 142,
    activeWishlists: 98,
    totalWishlistValue: 412800,
    quoteRequests: 28,
    avgItemsPerCustomer: 4.2,
    conversionRate: 18.9,
  },
  {
    name: "Pacific Gems",
    type: "independent",
    location: "Los Angeles, CA",
    customers: 128,
    activeWishlists: 89,
    totalWishlistValue: 374200,
    quoteRequests: 24,
    avgItemsPerCustomer: 3.9,
    conversionRate: 17.3,
  },
  {
    name: "Sterling & Stone",
    type: "independent",
    location: "Boston, MA",
    customers: 98,
    activeWishlists: 71,
    totalWishlistValue: 287100,
    quoteRequests: 19,
    avgItemsPerCustomer: 3.7,
    conversionRate: 16.8,
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
    sku: "MIK-PN-9MM",
    name: "Mikimoto Pearl Necklace",
    retailer: "Mikimoto",
    avgPrice: 7200,
    totalSaves: 987,
    byMetro: {
      "New York": 187, "Los Angeles": 164, "Chicago": 108, "Houston": 89,
      "Atlanta": 81, "Dallas": 74, "Miami": 71, "Seattle": 64, "Boston": 58, "San Francisco": 54,
    },
  },
];
