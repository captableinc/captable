import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  index,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { MemberStatusEnum, RolesEnum } from "./enums";
import { createTable } from "./index";

export const members = createTable(
  "members",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    title: varchar("title", { length: 191 }),
    status: MemberStatusEnum("status").notNull().default("PENDING"),
    isOnboarded: boolean("is_onboarded").notNull().default(false),
    role: RolesEnum("role").default("ADMIN"),
    workEmail: varchar("work_email", { length: 191 }),
    lastAccessed: timestamp("last_accessed", { withTimezone: true })
      .notNull()
      .defaultNow(),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),

    // Foreign key references
    userId: varchar("user_id", { length: 191 }).notNull(),
    companyId: varchar("company_id", { length: 191 }).notNull(),
    customRoleId: varchar("custom_role_id", { length: 191 }),
  },
  (table) => {
    return [
      // Mirroring the indexes from Prisma schema
      index("members_company_id_idx").on(table.companyId),
      index("members_status_idx").on(table.status),
      index("members_user_id_idx").on(table.userId),
      index("members_custom_role_id_idx").on(table.customRoleId),
      uniqueIndex("members_company_id_user_id_unique").on(
        table.companyId,
        table.userId,
      ),
    ];
  },
);

export const MemberSchema = createSelectSchema(members);
export type Member = typeof members.$inferSelect;

export const customRoles = createTable(
  "custom_roles",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }).notNull(),

    // Foreign key reference
    companyId: varchar("company_id", { length: 191 }).notNull(),

    // JSON array field
    permissions: varchar("permissions", { length: 191 }).array(),
  },
  (table) => {
    return [
      // Mirroring the index from Prisma schema
      index("custom_roles_company_id_idx").on(table.companyId),
    ];
  },
);

export const CustomRoleSchema = createSelectSchema(customRoles);
export type CustomRole = typeof customRoles.$inferSelect;
