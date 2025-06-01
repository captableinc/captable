import { createId } from "@paralleldrive/cuid2";
import { index, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { createTable } from "./index";

export const accounts = createTable(
  "accounts",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    userId: varchar("user_id", { length: 191 }).notNull(),
    type: varchar("type", { length: 191 }).notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 191,
    }).notNull(),
    refreshToken: varchar("refresh_token", { length: 191 }),
    accessToken: varchar("access_token", { length: 191 }),
    expiresAt: varchar("expires_at", { length: 191 }),
    tokenType: varchar("token_type", { length: 191 }),
    scope: varchar("scope", { length: 191 }),
    idToken: varchar("id_token", { length: 191 }),
    sessionState: varchar("session_state", { length: 191 }),
  },
  (table) => {
    return [
      // Mirroring the indexes from Prisma schema
      index("accounts_user_id_idx").on(table.userId),
      uniqueIndex("accounts_provider_provider_account_id_idx").on(
        table.provider,
        table.providerAccountId,
      ),
    ];
  },
);

export const UaccountsSchema = createSelectSchema(accounts);
export type Uaccounts = typeof accounts.$inferSelect;
export type Account = typeof accounts.$inferSelect;
