import { createId } from "@paralleldrive/cuid2";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { createTable } from "./index";

export const buckets = createTable("buckets", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 191 }).notNull(),
  key: varchar("key", { length: 191 }).notNull(),
  mimeType: varchar("mime_type", { length: 191 }).notNull(),
  size: integer("size").notNull(),
  tags: varchar("tags", { length: 191 }).array().notNull(),

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const BucketSchema = createSelectSchema(buckets);
export type Bucket = typeof buckets.$inferSelect;
