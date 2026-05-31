import { Router } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { db, piecesTable, wishlistItemsTable, remindersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.delete("/account", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  await db.transaction(async (tx) => {
    await tx.delete(piecesTable).where(eq(piecesTable.userId, userId));
    await tx.delete(wishlistItemsTable).where(eq(wishlistItemsTable.userId, userId));
    await tx.delete(remindersTable).where(eq(remindersTable.userId, userId));
  });

  await clerkClient.users.deleteUser(userId);

  res.status(204).send();
});

export default router;
