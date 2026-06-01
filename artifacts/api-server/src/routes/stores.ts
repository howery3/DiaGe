import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, storeSharesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

const DEMO_STORES = [
  // ── New York / New Jersey ──────────────────────────────────────────────────
  { id: "banter-times-sq",  banner: "Banter by Piercing Pagoda", name: "Banter — Times Square",            address: "1540 Broadway, New York, NY 10036",                distanceMi: 0.5,  phone: "(212) 354-0987" },
  { id: "kay-fifth-ave",    banner: "Kay Jewelers",               name: "Kay Jewelers — Fifth Avenue",      address: "630 Fifth Avenue, New York, NY 10111",             distanceMi: 1.2,  phone: "(212) 315-2888" },
  { id: "zales-herald-sq",  banner: "Zales",                      name: "Zales — Herald Square",            address: "1 Herald Square, New York, NY 10001",              distanceMi: 1.8,  phone: "(212) 239-1722" },
  { id: "kay-bay-plaza",    banner: "Kay Jewelers",               name: "Kay Jewelers — Bay Plaza",         address: "2100 Bartow Ave, Bronx, NY 10475",                 distanceMi: 9.3,  phone: "(718) 671-2000" },
  { id: "kay-kings-plaza",  banner: "Kay Jewelers",               name: "Kay Jewelers — Kings Plaza",       address: "5100 Kings Plaza, Brooklyn, NY 11234",             distanceMi: 8.4,  phone: "(718) 252-1500" },
  { id: "zales-staten-isl", banner: "Zales",                      name: "Zales — Staten Island Mall",       address: "2655 Richmond Ave, Staten Island, NY 10314",       distanceMi: 14.7, phone: "(718) 761-0400" },
  { id: "jared-paramus",    banner: "Jared",                      name: "Jared — Paramus Park",             address: "700 Paramus Park, Paramus, NJ 07652",              distanceMi: 18.2, phone: "(201) 368-0822" },
  { id: "jared-garden-st",  banner: "Jared",                      name: "Jared — Garden State Plaza",       address: "1 Garden State Plaza, Paramus, NJ 07652",          distanceMi: 16.8, phone: "(201) 291-1230" },
  { id: "zales-cross-cty",  banner: "Zales",                      name: "Zales — Cross County Center",      address: "800 Central Park Ave, Yonkers, NY 10704",          distanceMi: 22.1, phone: "(914) 965-1711" },
  { id: "jared-white-plns", banner: "Jared",                      name: "Jared — White Plains",             address: "100 Main St, White Plains, NY 10601",              distanceMi: 28.4, phone: "(914) 328-5100" },
  { id: "banter-kings-plz", banner: "Banter by Piercing Pagoda", name: "Banter — Kings Plaza",             address: "5100 Kings Plaza, Brooklyn, NY 11234",             distanceMi: 8.4,  phone: "(718) 252-8822" },

  // ── Florida — Tampa Bay ───────────────────────────────────────────────────
  { id: "kay-international-plaza",  banner: "Kay Jewelers",               name: "Kay Jewelers — International Plaza",   address: "2223 N Westshore Blvd, Tampa, FL 33607",           distanceMi: 2.1,  phone: "(813) 282-0022" },
  { id: "jared-tampa",              banner: "Jared",                      name: "Jared — Tampa",                        address: "3802 Britton Plaza, Tampa, FL 33611",              distanceMi: 3.4,  phone: "(813) 837-8220" },
  { id: "zales-westshore",          banner: "Zales",                      name: "Zales — Westshore Plaza",              address: "250 Westshore Plaza, Tampa, FL 33609",             distanceMi: 2.8,  phone: "(813) 282-8960" },
  { id: "kay-brandon-tc",           banner: "Kay Jewelers",               name: "Kay Jewelers — Brandon Town Center",   address: "459 Brandon Town Center Dr, Brandon, FL 33511",   distanceMi: 11.7, phone: "(813) 651-3710" },
  { id: "banter-citrus-park",       banner: "Banter by Piercing Pagoda", name: "Banter — Citrus Park Town Center",     address: "7999 Citrus Park Town Center, Tampa, FL 33625",   distanceMi: 8.9,  phone: "(813) 926-1710" },
  { id: "kay-clearwater-mall",      banner: "Kay Jewelers",               name: "Kay Jewelers — Clearwater Mall",       address: "2643 Gulf to Bay Blvd, Clearwater, FL 33759",     distanceMi: 19.2, phone: "(727) 796-6660" },
  { id: "jared-st-pete",            banner: "Jared",                      name: "Jared — St. Petersburg",               address: "2200 Tyrone Blvd N, St. Petersburg, FL 33710",    distanceMi: 22.5, phone: "(727) 344-0288" },
  { id: "zales-sarasota",           banner: "Zales",                      name: "Zales — Sarasota",                     address: "8201 S Tamiami Trail, Sarasota, FL 34238",         distanceMi: 54.0, phone: "(941) 929-1410" },

  // ── Florida — Orlando ─────────────────────────────────────────────────────
  { id: "kay-florida-mall",         banner: "Kay Jewelers",               name: "Kay Jewelers — Florida Mall",          address: "8001 S Orange Blossom Trail, Orlando, FL 32809",  distanceMi: 3.8,  phone: "(407) 855-0044" },
  { id: "jared-orlando",            banner: "Jared",                      name: "Jared — Orlando",                      address: "7550 W Sand Lake Rd, Orlando, FL 32819",           distanceMi: 5.2,  phone: "(407) 354-2112" },
  { id: "zales-mall-millenia",      banner: "Zales",                      name: "Zales — Mall at Millenia",             address: "4200 Conroy Rd, Orlando, FL 32839",                distanceMi: 4.6,  phone: "(407) 226-3610" },
  { id: "kay-lake-buena-vista",     banner: "Kay Jewelers",               name: "Kay Jewelers — Lake Buena Vista",      address: "1526 Buena Vista Dr, Lake Buena Vista, FL 32830", distanceMi: 13.1, phone: "(407) 827-1151" },
  { id: "banter-orlando-intl",      banner: "Banter by Piercing Pagoda", name: "Banter — Orlando International Mall",  address: "8001 S Orange Blossom Trail, Orlando, FL 32809",  distanceMi: 3.9,  phone: "(407) 855-2299" },

  // ── Florida — Miami / South Florida ──────────────────────────────────────
  { id: "kay-dadeland",             banner: "Kay Jewelers",               name: "Kay Jewelers — Dadeland Mall",         address: "7535 N Kendall Dr, Miami, FL 33156",               distanceMi: 8.4,  phone: "(305) 670-9330" },
  { id: "jared-miami",              banner: "Jared",                      name: "Jared — Miami",                        address: "9700 Stirling Rd, Hollywood, FL 33024",            distanceMi: 19.6, phone: "(954) 432-0670" },
  { id: "zales-aventura",           banner: "Zales",                      name: "Zales — Aventura Mall",                address: "19501 Biscayne Blvd, Aventura, FL 33180",          distanceMi: 11.2, phone: "(305) 937-0280" },
  { id: "kay-sawgrass-mills",       banner: "Kay Jewelers",               name: "Kay Jewelers — Sawgrass Mills",        address: "12801 W Sunrise Blvd, Sunrise, FL 33323",          distanceMi: 28.7, phone: "(954) 851-1060" },
  { id: "banter-pembroke-lakes",    banner: "Banter by Piercing Pagoda", name: "Banter — Pembroke Lakes Mall",         address: "11401 Pines Blvd, Pembroke Pines, FL 33026",      distanceMi: 21.3, phone: "(954) 435-2860" },

  // ── Florida — Jacksonville ────────────────────────────────────────────────
  { id: "kay-st-johns-town",        banner: "Kay Jewelers",               name: "Kay Jewelers — St. Johns Town Center", address: "4663 River City Dr, Jacksonville, FL 32246",       distanceMi: 5.3,  phone: "(904) 997-0077" },
  { id: "jared-jacksonville",       banner: "Jared",                      name: "Jared — Jacksonville",                 address: "4567 River City Dr, Jacksonville, FL 32246",       distanceMi: 5.6,  phone: "(904) 997-0044" },
  { id: "zales-regency-sq",         banner: "Zales",                      name: "Zales — Regency Square",               address: "9501 Arlington Expy, Jacksonville, FL 32225",      distanceMi: 9.1,  phone: "(904) 724-1620" },
  { id: "kay-orange-park",          banner: "Kay Jewelers",               name: "Kay Jewelers — Orange Park Mall",      address: "1910 Wells Rd, Orange Park, FL 32073",             distanceMi: 16.4, phone: "(904) 276-6699" },
];

router.get("/stores", (req, res) => {
  const q = (req.query.q as string | undefined)?.trim().toLowerCase();
  const retailer = (req.query.retailer as string | undefined)?.trim().toLowerCase();
  let results = DEMO_STORES;
  if (q) {
    results = results.filter(
      (s) =>
        s.address.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.banner.toLowerCase().includes(q)
    );
  }
  if (retailer) {
    results = results.filter((s) => s.banner.toLowerCase().includes(retailer));
  }
  res.json(results);
});

router.post("/store-share", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { storeId, type, data } = req.body as {
    storeId?: string;
    type?: string;
    data?: Record<string, unknown>;
  };

  if (!storeId || !type || !data) {
    res.status(400).json({ error: "storeId, type, and data are required" });
    return;
  }

  const id = randomUUID();
  await db.insert(storeSharesTable).values({ id, userId, storeId, type, data });
  res.json({ ok: true, id });
});

router.get("/store-shares", async (req, res) => {
  const storeId = req.query.storeId as string | undefined;
  if (!storeId) { res.status(400).json({ error: "storeId query param required" }); return; }

  const shares = await db
    .select()
    .from(storeSharesTable)
    .where(eq(storeSharesTable.storeId, storeId))
    .orderBy(desc(storeSharesTable.createdAt))
    .limit(50);

  res.json(shares);
});

export default router;
