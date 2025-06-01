import { createId } from "@paralleldrive/cuid2";
import { index, integer, real, timestamp, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { SecuritiesStatusEnum, ShareLegendsEnum } from "./enums";
import { createTable } from "./index";

export const shares = createTable(
  "shares",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    status: SecuritiesStatusEnum("status").notNull().default("DRAFT"),

    certificateId: varchar("certificate_id", { length: 191 }).notNull(),
    quantity: integer("quantity").notNull(),
    pricePerShare: real("price_per_share"),
    capitalContribution: real("capital_contribution"),
    ipContribution: real("ip_contribution"),
    debtCancelled: real("debt_cancelled"),
    otherContributions: real("other_contributions"),

    cliffYears: integer("cliff_years").notNull().default(0),
    vestingYears: integer("vesting_years").notNull().default(0),

    companyLegends: ShareLegendsEnum("company_legends")
      .array()
      .notNull()
      .default([]),

    // Dates
    issueDate: timestamp("issue_date", { withTimezone: true }).notNull(),
    rule144Date: timestamp("rule_144_date", { withTimezone: true }),
    vestingStartDate: timestamp("vesting_start_date", { withTimezone: true }),
    boardApprovalDate: timestamp("board_approval_date", {
      withTimezone: true,
    }).notNull(),

    // Foreign key references
    stakeholderId: varchar("stakeholder_id", { length: 191 }).notNull(),
    companyId: varchar("company_id", { length: 191 }).notNull(),
    shareClassId: varchar("share_class_id", { length: 191 }).notNull(),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [
      // Mirroring the indexes from Prisma schema
      index("shares_company_id_idx").on(table.companyId),
      index("shares_stakeholder_id_idx").on(table.stakeholderId),
      index("shares_share_class_id_idx").on(table.shareClassId),
    ];
  },
);

export const ShareSchema = createSelectSchema(shares);
export type Share = typeof shares.$inferSelect;
