import { createId } from "@paralleldrive/cuid2";
import { boolean, index, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { UpdateStatusEnum } from "./enums";
import { createTable } from "./index";

export const updates = createTable(
  "updates",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    publicId: varchar("public_id", { length: 191 }).notNull().unique(),
    title: varchar("title", { length: 191 }).notNull(),
    content: jsonb("content").notNull(),
    html: varchar("html", { length: 191 }).notNull(),
    public: boolean("public").notNull().default(false),
    status: UpdateStatusEnum("status").notNull().default("DRAFT"),

    // Foreign key references
    authorId: varchar("author_id", { length: 191 }).notNull(),
    companyId: varchar("company_id", { length: 191 }).notNull(),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [
      // Mirroring the indexes from Prisma schema
      index("updates_public_id_idx").on(table.publicId),
      index("updates_author_id_idx").on(table.authorId),
      index("updates_company_id_idx").on(table.companyId),
    ];
  },
);

export const UpdateSchema = createSelectSchema(updates);
export type Update = typeof updates.$inferSelect;

export const esignAudits = createTable(
  "esign_audits",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),

    // Foreign key references
    companyId: varchar("company_id", { length: 191 }).notNull(),
    templateId: varchar("template_id", { length: 191 }).notNull(),
    recipientId: varchar("recipient_id", { length: 191 }),

    action: varchar("action", { length: 191 }).notNull(),
    ip: varchar("ip", { length: 191 }).notNull(),
    userAgent: varchar("user_agent", { length: 191 }).notNull(),
    location: varchar("location", { length: 191 }).notNull(),
    summary: varchar("summary", { length: 191 }).notNull(),

    // Timestamps
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [
      // Mirroring the indexes from Prisma schema
      index("esign_audits_company_id_idx").on(table.companyId),
      index("esign_audits_template_id_idx").on(table.templateId),
      index("esign_audits_recipient_id_idx").on(table.recipientId),
    ];
  },
);

export const EsignAuditSchema = createSelectSchema(esignAudits);
export type EsignAudit = typeof esignAudits.$inferSelect;
