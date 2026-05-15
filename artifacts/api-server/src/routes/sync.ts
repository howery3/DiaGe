import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, piecesTable, wishlistItemsTable, remindersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/sync", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const [pieces, wishlist, reminders] = await Promise.all([
    db.select().from(piecesTable).where(eq(piecesTable.userId, userId)),
    db.select().from(wishlistItemsTable).where(eq(wishlistItemsTable.userId, userId)),
    db.select().from(remindersTable).where(eq(remindersTable.userId, userId)),
  ]);

  res.json({
    pieces: pieces.map((r) => r.data),
    wishlist: wishlist.map((r) => r.data),
    reminders: reminders.map((r) => r.data),
  });
});

router.post("/sync", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { pieces, wishlist, reminders } = req.body as {
    pieces?: Record<string, unknown>[];
    wishlist?: Record<string, unknown>[];
    reminders?: Record<string, unknown>[];
  };

  await db.transaction(async (tx) => {
    if (pieces !== undefined) {
      await tx.delete(piecesTable).where(eq(piecesTable.userId, userId));
      if (pieces.length > 0) {
        await tx.insert(piecesTable).values(
          pieces.map((p) => ({ id: String(p.id), userId, data: p }))
        );
      }
    }
    if (wishlist !== undefined) {
      await tx.delete(wishlistItemsTable).where(eq(wishlistItemsTable.userId, userId));
      if (wishlist.length > 0) {
        await tx.insert(wishlistItemsTable).values(
          wishlist.map((w) => ({ id: String(w.id), userId, data: w }))
        );
      }
    }
    if (reminders !== undefined) {
      await tx.delete(remindersTable).where(eq(remindersTable.userId, userId));
      if (reminders.length > 0) {
        await tx.insert(remindersTable).values(
          reminders.map((r) => ({ id: String(r.id), userId, data: r }))
        );
      }
    }
  });

  res.json({ ok: true });
});

router.delete("/sync", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  await Promise.all([
    db.delete(piecesTable).where(eq(piecesTable.userId, userId)),
    db.delete(wishlistItemsTable).where(eq(wishlistItemsTable.userId, userId)),
    db.delete(remindersTable).where(eq(remindersTable.userId, userId)),
  ]);

  res.json({ ok: true });
});

export default router;
