import { createId } from "@paralleldrive/cuid2";
import { boolean, index, timestamp, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { BankAccountTypeEnum } from "./enums";
import { createTable } from "./index";

export const bankAccounts = createTable(
  "bank_accounts",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    beneficiaryName: varchar("beneficiary_name", { length: 191 }).notNull(),
    beneficiaryAddress: varchar("beneficiary_address", {
      length: 191,
    }).notNull(),
    bankName: varchar("bank_name", { length: 191 }).notNull(),
    bankAddress: varchar("bank_address", { length: 191 }).notNull(),
    accountNumber: varchar("account_number", { length: 191 }).notNull(),
    routingNumber: varchar("routing_number", { length: 191 }).notNull(),
    accountType: BankAccountTypeEnum("account_type")
      .notNull()
      .default("CHECKING"),

    // International bank information
    swiftCode: varchar("swift_code", { length: 191 }),

    primary: boolean("primary").notNull().default(false),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),

    // Foreign key reference
    companyId: varchar("company_id", { length: 191 }).notNull(),
  },
  (table) => {
    return [
      // Mirroring index from Prisma schema
      index("bank_accounts_company_id_idx").on(table.companyId),
    ];
  },
);

export const BankAccountSchema = createSelectSchema(bankAccounts);
export type BankAccount = typeof bankAccounts.$inferSelect;
