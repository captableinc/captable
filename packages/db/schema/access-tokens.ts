import { createId } from "@paralleldrive/cuid2";
import { boolean, index, timestamp, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { AccessTokenTypeEnum } from "./enums";
import { createTable } from "./index";

export const accessTokens = createTable(
  "access_tokens",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    active: boolean("active").notNull().default(true),
    clientId: varchar("client_id", { length: 191 }).notNull(),
    clientSecret: varchar("client_secret", { length: 191 }).notNull(),
    typeEnum: AccessTokenTypeEnum("type_enum").notNull().default("api"),

    // Foreign key reference
    userId: varchar("user_id", { length: 191 }).notNull(),

    // Timestamps
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    lastUsed: timestamp("last_used", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [
      // Mirroring indexes from Prisma schema
      index("access_tokens_user_id_idx").on(table.userId),
      index("access_tokens_type_enum_client_id_idx").on(
        table.typeEnum,
        table.clientId,
      ),
    ];
  },
);

export const AccessTokenSchema = createSelectSchema(accessTokens);
export type AccessToken = typeof accessTokens.$inferSelect;
