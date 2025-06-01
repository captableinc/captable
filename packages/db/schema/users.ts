import { createId } from "@paralleldrive/cuid2";
import { boolean, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { createTable } from "./index";

export const users = createTable(
  "users",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }),
    password: varchar("password", { length: 191 }),
    emailVerified: timestamp("email_verified", { withTimezone: true }),
    image: varchar("image", { length: 191 }),
    lastSignedIn: timestamp("last_signed_in", { withTimezone: true }).notNull(),
    identityProvider: varchar("identity_provider", { length: 191 }),
  },
  (table) => {
    return [uniqueIndex("users_email_idx").on(table.email)];
  },
);

export const UserSchema = createSelectSchema(users);
export type User = typeof users.$inferSelect;
