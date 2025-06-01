import { createId } from "@paralleldrive/cuid2";
import { index, timestamp, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { StakeholderRelationshipEnum, StakeholderTypeEnum } from "./enums";
import { createTable } from "./index";

export const stakeholders = createTable(
  "stakeholders",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull().unique(),
    institutionName: varchar("institution_name", { length: 191 }),
    stakeholderType: StakeholderTypeEnum("stakeholder_type")
      .notNull()
      .default("INDIVIDUAL"),
    currentRelationship: StakeholderRelationshipEnum("current_relationship")
      .notNull()
      .default("EMPLOYEE"),
    taxId: varchar("tax_id", { length: 191 }),

    // Address fields
    streetAddress: varchar("street_address", { length: 191 }),
    city: varchar("city", { length: 191 }),
    state: varchar("state", { length: 191 }),
    zipcode: varchar("zipcode", { length: 191 }),
    country: varchar("country", { length: 191 }).notNull().default("US"),

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
      // Mirroring the index from Prisma schema
      index("stakeholders_company_id_idx").on(table.companyId),
    ];
  },
);

export const StakeholderSchema = createSelectSchema(stakeholders);
export type Stakeholder = typeof stakeholders.$inferSelect;
