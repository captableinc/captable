import { createId } from "@paralleldrive/cuid2";
import { bigint, index, timestamp, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { CancellationBehaviorEnum } from "./enums";
import { createTable } from "./index";

export const equityPlans = createTable(
  "equity_plans",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }).notNull(),
    boardApprovalDate: timestamp("board_approval_date", {
      withTimezone: true,
    }).notNull(),
    planEffectiveDate: timestamp("plan_effective_date", { withTimezone: true }),
    initialSharesReserved: bigint("initial_shares_reserved", {
      mode: "number",
    }).notNull(),
    defaultCancellatonBehavior: CancellationBehaviorEnum(
      "default_cancellaton_behavior",
    ).notNull(),
    comments: varchar("comments", { length: 191 }),

    // Foreign key references
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
      // Mirroring indexes from Prisma schema
      index("equity_plans_share_class_id_idx").on(table.shareClassId),
      index("equity_plans_company_id_idx").on(table.companyId),
    ];
  },
);

export const EquityPlanSchema = createSelectSchema(equityPlans);
export type EquityPlan = typeof equityPlans.$inferSelect;
