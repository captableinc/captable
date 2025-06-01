import { createId } from "@paralleldrive/cuid2";
import { index, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { createTable } from "./index";

export const audits = createTable(
  "audits",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    companyId: varchar("company_id", { length: 191 }).notNull(),
    summary: varchar("summary", { length: 191 }),
    action: varchar("action", { length: 191 }).notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    // JSON fields
    actor: jsonb("actor").notNull(),
    target: jsonb("target").array().notNull(),
    context: jsonb("context").notNull(),
  },
  (table) => {
    return [
      // Mirroring index from Prisma schema
      index("audits_company_id_idx").on(table.companyId),
    ];
  },
);

export const AuditSchema = createSelectSchema(audits);
export type Audit = typeof audits.$inferSelect;
