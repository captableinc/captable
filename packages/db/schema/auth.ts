import { createId } from "@paralleldrive/cuid2";
import { boolean, text, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { createTable } from "./index";

export const betterAuthUsers = createTable("better_auth_users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const betterAuthSessions = createTable("better_auth_sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => betterAuthUsers.id, { onDelete: "cascade" }),
});

export const betterAuthAccounts = createTable("better_auth_accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => betterAuthUsers.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const betterAuthVerifications = createTable(
  "better_auth_verifications",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").$defaultFn(
      () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: timestamp("updated_at").$defaultFn(
      () => /* @__PURE__ */ new Date(),
    ),
  },
);

// Zod schemas for validation
export const BetterAuthUserSchema = createSelectSchema(betterAuthUsers);
export const BetterAuthSessionSchema = createSelectSchema(betterAuthSessions);
export const BetterAuthAccountSchema = createSelectSchema(betterAuthAccounts);
export const BetterAuthVerificationSchema = createSelectSchema(
  betterAuthVerifications,
);

// TypeScript types
export type BetterAuthUser = typeof betterAuthUsers.$inferSelect;
export type BetterAuthSession = typeof betterAuthSessions.$inferSelect;
export type BetterAuthAccount = typeof betterAuthAccounts.$inferSelect;
export type BetterAuthVerification =
  typeof betterAuthVerifications.$inferSelect;

// Insert types
export type BetterAuthUserInsert = typeof betterAuthUsers.$inferInsert;
export type BetterAuthSessionInsert = typeof betterAuthSessions.$inferInsert;
export type BetterAuthAccountInsert = typeof betterAuthAccounts.$inferInsert;
export type BetterAuthVerificationInsert =
  typeof betterAuthVerifications.$inferInsert;
