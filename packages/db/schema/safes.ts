import { createId } from "@paralleldrive/cuid2";
import { boolean, index, real, timestamp, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { SafeStatusEnum, SafeTemplateEnum, SafeTypeEnum } from "./enums";
import { createTable } from "./index";

export const safes = createTable(
  "safes",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    publicId: varchar("public_id", { length: 191 }).notNull(),
    type: SafeTypeEnum("type").notNull().default("POST_MONEY"),
    status: SafeStatusEnum("status").notNull().default("DRAFT"),
    capital: real("capital").notNull(),
    safeTemplate: SafeTemplateEnum("safe_template"),
    safeId: varchar("safe_id", { length: 191 }),

    valuationCap: real("valuation_cap"),
    discountRate: real("discount_rate"),
    mfn: boolean("mfn").notNull().default(false),
    proRata: boolean("pro_rata").notNull().default(false),
    additionalTerms: varchar("additional_terms", { length: 191 }),

    // Foreign key references
    stakeholderId: varchar("stakeholder_id", { length: 191 }).notNull(),
    companyId: varchar("company_id", { length: 191 }).notNull(),

    // Dates
    issueDate: timestamp("issue_date", { withTimezone: true }).notNull(),
    boardApprovalDate: timestamp("board_approval_date", {
      withTimezone: true,
    }).notNull(),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [
      // Mirroring indexes from Prisma schema
      index("safes_company_id_idx").on(table.companyId),
      index("safes_stakeholder_id_idx").on(table.stakeholderId),
    ];
  },
);

export const SafeSchema = createSelectSchema(safes);
export type Safe = typeof safes.$inferSelect;
