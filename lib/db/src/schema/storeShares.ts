import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const storeSharesTable = pgTable("store_shares", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  storeId: text("store_id").notNull(),
  type: text("type").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
