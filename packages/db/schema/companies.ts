import { createId } from "@paralleldrive/cuid2";
import { timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { createTable } from "./index";

export const companies = createTable(
  "companies",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }).notNull(),
    logo: varchar("logo", { length: 191 }),
    publicId: varchar("public_id", { length: 191 }).notNull().unique(),
    website: varchar("website", { length: 191 }),
    incorporationType: varchar("incorporation_type", { length: 191 }).notNull(),
    incorporationDate: timestamp("incorporation_date", {
      withTimezone: true,
    }).notNull(),
    incorporationCountry: varchar("incorporation_country", {
      length: 191,
    }).notNull(),
    incorporationState: varchar("incorporation_state", {
      length: 191,
    }).notNull(),

    // Address fields
    streetAddress: varchar("street_address", { length: 191 }).notNull(),
    city: varchar("city", { length: 191 }).notNull(),
    state: varchar("state", { length: 191 }).notNull(),
    zipcode: varchar("zipcode", { length: 191 }).notNull(),
    country: varchar("country", { length: 191 }).notNull(),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [uniqueIndex("companies_public_id_unique").on(table.publicId)];
  },
);

export const CompanySchema = createSelectSchema(companies);
export type Company = typeof companies.$inferSelect;
