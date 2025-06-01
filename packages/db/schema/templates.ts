import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  index,
  integer,
  jsonb,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import {
  EsignRecipientStatusEnum,
  FieldTypesEnum,
  TemplateStatusEnum,
} from "./enums";
import { createTable } from "./index";

export const templates = createTable(
  "templates",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    publicId: varchar("public_id", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    status: TemplateStatusEnum("status").notNull().default("DRAFT"),
    orderedDelivery: boolean("ordered_delivery").notNull().default(false),
    message: varchar("message", { length: 191 }),

    // Foreign key references
    bucketId: varchar("bucket_id", { length: 191 }).notNull(),
    uploaderId: varchar("uploader_id", { length: 191 }).notNull(),
    companyId: varchar("company_id", { length: 191 }).notNull(),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    completedOn: timestamp("completed_on", { withTimezone: true }),
  },
  (table) => {
    return [
      // Mirroring the indexes from Prisma schema
      index("templates_bucket_id_idx").on(table.bucketId),
      index("templates_uploader_id_idx").on(table.uploaderId),
      index("templates_company_id_idx").on(table.companyId),
    ];
  },
);

export const TemplateSchema = createSelectSchema(templates);
export type Template = typeof templates.$inferSelect;

export const templateFields = createTable(
  "template_fields",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }).notNull(),
    type: FieldTypesEnum("type").notNull().default("TEXT"),
    defaultValue: varchar("default_value", { length: 191 })
      .notNull()
      .default(""),
    readOnly: boolean("read_only").notNull().default(false),
    required: boolean("required").notNull().default(false),
    prefilledValue: varchar("prefilled_value", { length: 191 }),
    top: integer("top").notNull(),
    left: integer("left").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),

    // Foreign key references
    recipientId: varchar("recipient_id", { length: 191 }).notNull(),
    templateId: varchar("template_id", { length: 191 }).notNull(),

    viewportHeight: integer("viewport_height").notNull(),
    viewportWidth: integer("viewport_width").notNull(),
    page: integer("page").notNull(),

    // JSON field
    meta: jsonb("meta").notNull().default("{}"),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [
      // Mirroring the indexes from Prisma schema
      index("template_fields_template_id_idx").on(table.templateId),
      index("template_fields_recipient_id_idx").on(table.recipientId),
    ];
  },
);

export const TemplateFieldSchema = createSelectSchema(templateFields);
export type TemplateField = typeof templateFields.$inferSelect;

export const esignRecipients = createTable(
  "esign_recipients",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    email: varchar("email", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }),

    // Foreign key references
    templateId: varchar("template_id", { length: 191 }).notNull(),
    status: EsignRecipientStatusEnum("status").notNull().default("PENDING"),
    memberId: varchar("member_id", { length: 191 }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [
      // Mirroring the indexes from Prisma schema
      index("esign_recipients_member_id_idx").on(table.memberId),
      index("esign_recipients_template_id_idx").on(table.templateId),
    ];
  },
);

export const EsignRecipientSchema = createSelectSchema(esignRecipients);
export type EsignRecipient = typeof esignRecipients.$inferSelect;
