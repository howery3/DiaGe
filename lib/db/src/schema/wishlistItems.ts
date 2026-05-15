import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const wishlistItemsTable = pgTable("wishlist_items", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
