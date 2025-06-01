import { createId } from "@paralleldrive/cuid2";
import {
  bigint,
  index,
  integer,
  real,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { ConversionRightsEnum, SharePrefixEnum, ShareTypeEnum } from "./enums";
import { createTable } from "./index";

export const shareClasses = createTable(
  "share_classes",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    idx: integer("idx").notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    classType: ShareTypeEnum("class_type").notNull().default("COMMON"),
    prefix: SharePrefixEnum("prefix").notNull().default("CS"),
    initialSharesAuthorized: bigint("initial_shares_authorized", {
      mode: "number",
    }).notNull(),
    boardApprovalDate: timestamp("board_approval_date", {
      withTimezone: true,
    }).notNull(),
    stockholderApprovalDate: timestamp("stockholder_approval_date", {
      withTimezone: true,
    }).notNull(),
    votesPerShare: integer("votes_per_share").notNull(),
    parValue: real("par_value").notNull(),
    pricePerShare: real("price_per_share").notNull(),
    seniority: integer("seniority").notNull(),

    // Conversion Rights
    conversionRights: ConversionRightsEnum("conversion_rights")
      .notNull()
      .default("CONVERTS_TO_FUTURE_ROUND"),
    convertsToShareClassId: varchar("converts_to_share_class_id", {
      length: 191,
    }),

    // Liquidation and participation
    liquidationPreferenceMultiple: real(
      "liquidation_preference_multiple",
    ).notNull(),
    participationCapMultiple: real("participation_cap_multiple").notNull(),

    // Foreign key reference
    companyId: varchar("company_id", { length: 191 }).notNull(),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [
      // Mirroring the indexes from Prisma schema
      index("share_classes_company_id_idx").on(table.companyId),
      uniqueIndex("share_classes_company_id_idx_unique").on(
        table.companyId,
        table.idx,
      ),
    ];
  },
);

export const ShareClassSchema = createSelectSchema(shareClasses);
export type ShareClass = typeof shareClasses.$inferSelect;
