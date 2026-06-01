export interface StoreRecord {
  id: string;
  banner: string;
  name: string;
  address: string;
  distanceMi: number;
  phone: string;
  lat: number;
  lng: number;
}

export const DEMO_STORES: StoreRecord[] = [
  // ── New York / New Jersey ─────────────────────────────────────────────────
  { id: "banter-times-sq",  banner: "Banter by Piercing Pagoda", name: "Banter — Times Square",            address: "1540 Broadway, New York, NY 10036",                distanceMi: 0.5,  phone: "(212) 354-0987", lat: 40.7580, lng: -73.9855 },
  { id: "kay-fifth-ave",    banner: "Kay Jewelers",               name: "Kay Jewelers — Fifth Avenue",      address: "630 Fifth Avenue, New York, NY 10111",             distanceMi: 1.2,  phone: "(212) 315-2888", lat: 40.7587, lng: -73.9787 },
  { id: "zales-herald-sq",  banner: "Zales",                      name: "Zales — Herald Square",            address: "1 Herald Square, New York, NY 10001",              distanceMi: 1.8,  phone: "(212) 239-1722", lat: 40.7503, lng: -73.9883 },
  { id: "kay-bay-plaza",    banner: "Kay Jewelers",               name: "Kay Jewelers — Bay Plaza",         address: "2100 Bartow Ave, Bronx, NY 10475",                 distanceMi: 9.3,  phone: "(718) 671-2000", lat: 40.8698, lng: -73.8432 },
  { id: "kay-kings-plaza",  banner: "Kay Jewelers",               name: "Kay Jewelers — Kings Plaza",       address: "5100 Kings Plaza, Brooklyn, NY 11234",             distanceMi: 8.4,  phone: "(718) 252-1500", lat: 40.5908, lng: -73.9369 },
  { id: "zales-staten-isl", banner: "Zales",                      name: "Zales — Staten Island Mall",       address: "2655 Richmond Ave, Staten Island, NY 10314",       distanceMi: 14.7, phone: "(718) 761-0400", lat: 40.5832, lng: -74.1566 },
  { id: "jared-paramus",    banner: "Jared",                      name: "Jared — Paramus Park",             address: "700 Paramus Park, Paramus, NJ 07652",              distanceMi: 18.2, phone: "(201) 368-0822", lat: 40.9445, lng: -74.0726 },
  { id: "jared-garden-st",  banner: "Jared",                      name: "Jared — Garden State Plaza",       address: "1 Garden State Plaza, Paramus, NJ 07652",          distanceMi: 16.8, phone: "(201) 291-1230", lat: 40.9069, lng: -74.0594 },
  { id: "zales-cross-cty",  banner: "Zales",                      name: "Zales — Cross County Center",      address: "800 Central Park Ave, Yonkers, NY 10704",          distanceMi: 22.1, phone: "(914) 965-1711", lat: 40.9209, lng: -73.8651 },
  { id: "jared-white-plns", banner: "Jared",                      name: "Jared — White Plains",             address: "100 Main St, White Plains, NY 10601",              distanceMi: 28.4, phone: "(914) 328-5100", lat: 41.0340, lng: -73.7629 },
  { id: "banter-kings-plz", banner: "Banter by Piercing Pagoda", name: "Banter — Kings Plaza",             address: "5100 Kings Plaza, Brooklyn, NY 11234",             distanceMi: 8.4,  phone: "(718) 252-8822", lat: 40.5908, lng: -73.9370 },

  // ── Florida — Tampa Bay ───────────────────────────────────────────────────
  { id: "kay-international-plaza",  banner: "Kay Jewelers",               name: "Kay Jewelers — International Plaza",   address: "2223 N Westshore Blvd, Tampa, FL 33607",              distanceMi: 2.1,  phone: "(813) 282-0022", lat: 27.9536, lng: -82.5248 },
  { id: "jared-tampa",              banner: "Jared",                      name: "Jared — Tampa",                        address: "3802 Britton Plaza, Tampa, FL 33611",                 distanceMi: 3.4,  phone: "(813) 837-8220", lat: 27.9166, lng: -82.5176 },
  { id: "zales-westshore",          banner: "Zales",                      name: "Zales — Westshore Plaza",              address: "250 Westshore Plaza, Tampa, FL 33609",                distanceMi: 2.8,  phone: "(813) 282-8960", lat: 27.9446, lng: -82.5244 },
  { id: "kay-brandon-tc",           banner: "Kay Jewelers",               name: "Kay Jewelers — Brandon Town Center",   address: "459 Brandon Town Center Dr, Brandon, FL 33511",      distanceMi: 11.7, phone: "(813) 651-3710", lat: 27.9227, lng: -82.3200 },
  { id: "banter-citrus-park",       banner: "Banter by Piercing Pagoda", name: "Banter — Citrus Park Town Center",     address: "7999 Citrus Park Town Center, Tampa, FL 33625",      distanceMi: 8.9,  phone: "(813) 926-1710", lat: 28.0660, lng: -82.5771 },
  { id: "kay-clearwater-mall",      banner: "Kay Jewelers",               name: "Kay Jewelers — Clearwater Mall",       address: "2643 Gulf to Bay Blvd, Clearwater, FL 33759",         distanceMi: 19.2, phone: "(727) 796-6660", lat: 27.9789, lng: -82.7272 },
  { id: "jared-st-pete",            banner: "Jared",                      name: "Jared — St. Petersburg",               address: "2200 Tyrone Blvd N, St. Petersburg, FL 33710",        distanceMi: 22.5, phone: "(727) 344-0288", lat: 27.7942, lng: -82.7449 },
  { id: "zales-gulf-view-sq",       banner: "Zales",                      name: "Zales — Gulf View Square",             address: "9409 US Hwy 19 N, Port Richey, FL 34668",             distanceMi: 8.1,  phone: "(727) 848-7900", lat: 28.2706, lng: -82.7193 },
  { id: "kay-gulf-view-sq",         banner: "Kay Jewelers",               name: "Kay Jewelers — Gulf View Square",      address: "9409 US Hwy 19 N, Port Richey, FL 34668",             distanceMi: 8.1,  phone: "(727) 847-3003", lat: 28.2706, lng: -82.7195 },
  { id: "banter-gulf-view-sq",      banner: "Banter by Piercing Pagoda", name: "Banter — Gulf View Square",            address: "9409 US Hwy 19 N, Port Richey, FL 34668",             distanceMi: 8.1,  phone: "(727) 842-1640", lat: 28.2706, lng: -82.7194 },
  { id: "kay-wiregrass",            banner: "Kay Jewelers",               name: "Kay Jewelers — Wiregrass Mall",        address: "28211 Paseo Dr, Wesley Chapel, FL 33543",             distanceMi: 19.4, phone: "(813) 907-9540", lat: 28.1974, lng: -82.3564 },
  { id: "zales-wiregrass",          banner: "Zales",                      name: "Zales — Wiregrass Mall",               address: "28211 Paseo Dr, Wesley Chapel, FL 33543",             distanceMi: 19.4, phone: "(813) 907-9600", lat: 28.1974, lng: -82.3566 },
  { id: "kay-tyrone-sq",            banner: "Kay Jewelers",               name: "Kay Jewelers — Tyrone Square",         address: "6901 22nd Ave N, St. Petersburg, FL 33710",           distanceMi: 26.3, phone: "(727) 344-2050", lat: 27.8122, lng: -82.7390 },
  { id: "zales-sarasota",           banner: "Zales",                      name: "Zales — Sarasota",                     address: "8201 S Tamiami Trail, Sarasota, FL 34238",             distanceMi: 54.0, phone: "(941) 929-1410", lat: 27.2771, lng: -82.4828 },

  // ── Florida — Orlando ─────────────────────────────────────────────────────
  { id: "kay-florida-mall",         banner: "Kay Jewelers",               name: "Kay Jewelers — Florida Mall",          address: "8001 S Orange Blossom Trail, Orlando, FL 32809",  distanceMi: 3.8,  phone: "(407) 855-0044", lat: 28.4560, lng: -81.4358 },
  { id: "jared-orlando",            banner: "Jared",                      name: "Jared — Orlando",                      address: "7550 W Sand Lake Rd, Orlando, FL 32819",           distanceMi: 5.2,  phone: "(407) 354-2112", lat: 28.4389, lng: -81.4701 },
  { id: "zales-mall-millenia",      banner: "Zales",                      name: "Zales — Mall at Millenia",             address: "4200 Conroy Rd, Orlando, FL 32839",                distanceMi: 4.6,  phone: "(407) 226-3610", lat: 28.4730, lng: -81.4613 },
  { id: "kay-lake-buena-vista",     banner: "Kay Jewelers",               name: "Kay Jewelers — Lake Buena Vista",      address: "1526 Buena Vista Dr, Lake Buena Vista, FL 32830", distanceMi: 13.1, phone: "(407) 827-1151", lat: 28.3745, lng: -81.5197 },
  { id: "banter-orlando-intl",      banner: "Banter by Piercing Pagoda", name: "Banter — Orlando International Mall",  address: "8001 S Orange Blossom Trail, Orlando, FL 32809",  distanceMi: 3.9,  phone: "(407) 855-2299", lat: 28.4561, lng: -81.4360 },

  // ── Florida — Miami / South Florida ──────────────────────────────────────
  { id: "kay-dadeland",             banner: "Kay Jewelers",               name: "Kay Jewelers — Dadeland Mall",         address: "7535 N Kendall Dr, Miami, FL 33156",               distanceMi: 8.4,  phone: "(305) 670-9330", lat: 25.6812, lng: -80.3274 },
  { id: "jared-miami",              banner: "Jared",                      name: "Jared — Miami",                        address: "9700 Stirling Rd, Hollywood, FL 33024",            distanceMi: 19.6, phone: "(954) 432-0670", lat: 26.0273, lng: -80.2339 },
  { id: "zales-aventura",           banner: "Zales",                      name: "Zales — Aventura Mall",                address: "19501 Biscayne Blvd, Aventura, FL 33180",          distanceMi: 11.2, phone: "(305) 937-0280", lat: 25.9574, lng: -80.1439 },
  { id: "kay-sawgrass-mills",       banner: "Kay Jewelers",               name: "Kay Jewelers — Sawgrass Mills",        address: "12801 W Sunrise Blvd, Sunrise, FL 33323",          distanceMi: 28.7, phone: "(954) 851-1060", lat: 26.1512, lng: -80.2571 },
  { id: "banter-pembroke-lakes",    banner: "Banter by Piercing Pagoda", name: "Banter — Pembroke Lakes Mall",         address: "11401 Pines Blvd, Pembroke Pines, FL 33026",      distanceMi: 21.3, phone: "(954) 435-2860", lat: 26.0120, lng: -80.2788 },

  // ── Florida — Jacksonville ────────────────────────────────────────────────
  { id: "kay-st-johns-town",        banner: "Kay Jewelers",               name: "Kay Jewelers — St. Johns Town Center", address: "4663 River City Dr, Jacksonville, FL 32246",       distanceMi: 5.3,  phone: "(904) 997-0077", lat: 30.2762, lng: -81.5398 },
  { id: "jared-jacksonville",       banner: "Jared",                      name: "Jared — Jacksonville",                 address: "4567 River City Dr, Jacksonville, FL 32246",       distanceMi: 5.6,  phone: "(904) 997-0044", lat: 30.2760, lng: -81.5390 },
  { id: "zales-regency-sq",         banner: "Zales",                      name: "Zales — Regency Square",               address: "9501 Arlington Expy, Jacksonville, FL 32225",      distanceMi: 9.1,  phone: "(904) 724-1620", lat: 30.3470, lng: -81.5526 },
  { id: "kay-orange-park",          banner: "Kay Jewelers",               name: "Kay Jewelers — Orange Park Mall",      address: "1910 Wells Rd, Orange Park, FL 32073",             distanceMi: 16.4, phone: "(904) 276-6699", lat: 30.1534, lng: -81.7109 },
];

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
