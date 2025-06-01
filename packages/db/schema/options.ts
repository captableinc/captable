import { createId } from "@paralleldrive/cuid2";
import { index, integer, real, timestamp, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { OptionStatusEnum, OptionTypeEnum } from "./enums";
import { createTable } from "./index";

export const options = createTable(
  "options",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    grantId: varchar("grant_id", { length: 191 }).notNull(),
    quantity: integer("quantity").notNull(),
    exercisePrice: real("exercise_price").notNull(),

    type: OptionTypeEnum("type").notNull(),
    status: OptionStatusEnum("status").notNull().default("DRAFT"),
    cliffYears: integer("cliff_years").notNull().default(0),
    vestingYears: integer("vesting_years").notNull().default(0),

    // Dates
    issueDate: timestamp("issue_date", { withTimezone: true }).notNull(),
    expirationDate: timestamp("expiration_date", {
      withTimezone: true,
    }).notNull(),
    vestingStartDate: timestamp("vesting_start_date", {
      withTimezone: true,
    }).notNull(),
    boardApprovalDate: timestamp("board_approval_date", {
      withTimezone: true,
    }).notNull(),
    rule144Date: timestamp("rule_144_date", { withTimezone: true }).notNull(),

    // Foreign key references
    stakeholderId: varchar("stakeholder_id", { length: 191 }).notNull(),
    companyId: varchar("company_id", { length: 191 }).notNull(),
    equityPlanId: varchar("equity_plan_id", { length: 191 }).notNull(),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [
      // Mirroring indexes from Prisma schema
      index("options_company_id_idx").on(table.companyId),
      index("options_equity_plan_id_idx").on(table.equityPlanId),
      index("options_stakeholder_id_idx").on(table.stakeholderId),
    ];
  },
);

export const OptionSchema = createSelectSchema(options);
export type Option = typeof options.$inferSelect;
