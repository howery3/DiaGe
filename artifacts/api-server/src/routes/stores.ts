import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, storeSharesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { DEMO_STORES } from "../lib/storeData.js";

const router = Router();

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
