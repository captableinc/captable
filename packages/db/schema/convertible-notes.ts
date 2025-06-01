import { createId } from "@paralleldrive/cuid2";
import { boolean, index, real, timestamp, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import {
  ConvertibleInterestAccrualEnum,
  ConvertibleInterestMethodEnum,
  ConvertibleInterestPaymentScheduleEnum,
  ConvertibleStatusEnum,
  ConvertibleTypeEnum,
} from "./enums";
import { createTable } from "./index";

export const convertibleNotes = createTable(
  "convertible_notes",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    publicId: varchar("public_id", { length: 191 }).notNull(),
    status: ConvertibleStatusEnum("status").notNull().default("DRAFT"),
    type: ConvertibleTypeEnum("type").notNull().default("NOTE"),
    capital: real("capital").notNull(),

    conversionCap: real("conversion_cap"),
    discountRate: real("discount_rate"),
    mfn: boolean("mfn"),
    additionalTerms: varchar("additional_terms", { length: 191 }),

    // Interest details
    interestRate: real("interest_rate"),
    interestMethod: ConvertibleInterestMethodEnum("interest_method"),
    interestAccrual: ConvertibleInterestAccrualEnum("interest_accrual"),
    interestPaymentSchedule: ConvertibleInterestPaymentScheduleEnum(
      "interest_payment_schedule",
    ),

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
      index("convertible_notes_company_id_idx").on(table.companyId),
      index("convertible_notes_stakeholder_id_idx").on(table.stakeholderId),
    ];
  },
);

export const ConvertibleNoteSchema = createSelectSchema(convertibleNotes);
export type ConvertibleNote = typeof convertibleNotes.$inferSelect;
