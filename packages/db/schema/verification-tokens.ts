import { createId } from "@paralleldrive/cuid2";
import {
  index,
  integer,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { createTable } from "./index";

export const verificationTokens = createTable(
  "verification_tokens",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    secondaryId: varchar("secondary_id", { length: 191 }).notNull().unique(),
    identifier: varchar("identifier", { length: 191 }).notNull(),
    token: varchar("token", { length: 191 }).notNull().unique(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    // Foreign key reference
    userId: varchar("user_id", { length: 191 }),
  },
  (table) => {
    return [
      uniqueIndex("verification_tokens_identifier_token_idx").on(
        table.identifier,
        table.token,
      ),
      index("verification_tokens_user_id_idx").on(table.userId),
    ];
  },
);

export const VerificationTokenSchema = createSelectSchema(verificationTokens);
export type VerificationToken = typeof verificationTokens.$inferSelect;

export const passkeyVerificationTokens = createTable(
  "passkey_verification_tokens",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    token: varchar("token", { length: 191 }).notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
);

export const PasskeyVerificationTokenSchema = createSelectSchema(
  passkeyVerificationTokens,
);
export type PasskeyVerificationToken =
  typeof passkeyVerificationTokens.$inferSelect;

export const passwordResetTokens = createTable(
  "password_reset_tokens",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    email: varchar("email", { length: 191 }).notNull(),
    token: varchar("token", { length: 191 }).notNull().unique(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [
      uniqueIndex("password_reset_tokens_email_token_idx").on(
        table.email,
        table.token,
      ),
    ];
  },
);

export const PasswordResetTokenSchema = createSelectSchema(passwordResetTokens);
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
