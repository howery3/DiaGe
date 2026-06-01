import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, storeSharesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

const DEMO_STORES = [
  { id: "banter-times-sq",  banner: "Banter by Piercing Pagoda", name: "Banter — Times Square",          address: "1540 Broadway, New York, NY 10036",              distanceMi: 0.5,  phone: "(212) 354-0987" },
  { id: "kay-fifth-ave",    banner: "Kay Jewelers",               name: "Kay Jewelers — Fifth Avenue",    address: "630 Fifth Avenue, New York, NY 10111",           distanceMi: 1.2,  phone: "(212) 315-2888" },
  { id: "zales-herald-sq",  banner: "Zales",                      name: "Zales — Herald Square",          address: "1 Herald Square, New York, NY 10001",            distanceMi: 1.8,  phone: "(212) 239-1722" },
  { id: "kay-bay-plaza",    banner: "Kay Jewelers",               name: "Kay Jewelers — Bay Plaza",       address: "2100 Bartow Ave, Bronx, NY 10475",               distanceMi: 9.3,  phone: "(718) 671-2000" },
  { id: "kay-kings-plaza",  banner: "Kay Jewelers",               name: "Kay Jewelers — Kings Plaza",     address: "5100 Kings Plaza, Brooklyn, NY 11234",           distanceMi: 8.4,  phone: "(718) 252-1500" },
  { id: "zales-staten-isl", banner: "Zales",                      name: "Zales — Staten Island Mall",     address: "2655 Richmond Ave, Staten Island, NY 10314",     distanceMi: 14.7, phone: "(718) 761-0400" },
  { id: "jared-paramus",    banner: "Jared",                      name: "Jared — Paramus Park",           address: "700 Paramus Park, Paramus, NJ 07652",            distanceMi: 18.2, phone: "(201) 368-0822" },
  { id: "jared-garden-st",  banner: "Jared",                      name: "Jared — Garden State Plaza",     address: "1 Garden State Plaza, Paramus, NJ 07652",       distanceMi: 16.8, phone: "(201) 291-1230" },
  { id: "zales-cross-cty",  banner: "Zales",                      name: "Zales — Cross County Center",    address: "800 Central Park Ave, Yonkers, NY 10704",        distanceMi: 22.1, phone: "(914) 965-1711" },
  { id: "jared-white-plns", banner: "Jared",                      name: "Jared — White Plains",           address: "100 Main St, White Plains, NY 10601",            distanceMi: 28.4, phone: "(914) 328-5100" },
  { id: "banter-kings-plz", banner: "Banter by Piercing Pagoda", name: "Banter — Kings Plaza",           address: "5100 Kings Plaza, Brooklyn, NY 11234",           distanceMi: 8.4,  phone: "(718) 252-8822" },
];

router.get("/stores", (_req, res) => {
  res.json(DEMO_STORES);
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
