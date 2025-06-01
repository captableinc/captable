import { createId } from "@paralleldrive/cuid2";
import { bigint, index, real, timestamp, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { createTable } from "./index";

export const investments = createTable(
  "investments",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    amount: real("amount").notNull(),
    shares: bigint("shares", { mode: "number" }).notNull(),
    date: timestamp("date", { withTimezone: true }).notNull(),
    comments: varchar("comments", { length: 191 }),

    // Foreign key references
    shareClassId: varchar("share_class_id", { length: 191 }).notNull(),
    companyId: varchar("company_id", { length: 191 }).notNull(),
    stakeholderId: varchar("stakeholder_id", { length: 191 }).notNull(),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [
      // Mirroring indexes from Prisma schema
      index("investments_company_id_idx").on(table.companyId),
      index("investments_share_class_id_idx").on(table.shareClassId),
      index("investments_stakeholder_id_idx").on(table.stakeholderId),
    ];
  },
);

export const InvestmentSchema = createSelectSchema(investments);
export type Investment = typeof investments.$inferSelect;
