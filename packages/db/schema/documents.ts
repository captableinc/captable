import { createId } from "@paralleldrive/cuid2";
import { boolean, index, timestamp, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { createTable } from "./index";

export const documents = createTable(
  "documents",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    publicId: varchar("public_id", { length: 191 }).notNull().unique(),
    name: varchar("name", { length: 191 }).notNull(),

    // Foreign key references
    bucketId: varchar("bucket_id", { length: 191 }).notNull(),
    uploaderId: varchar("uploader_id", { length: 191 }),
    companyId: varchar("company_id", { length: 191 }).notNull(),

    // Optional references
    shareId: varchar("share_id", { length: 191 }),
    optionId: varchar("option_id", { length: 191 }),
    safeId: varchar("safe_id", { length: 191 }),
    convertibleNoteId: varchar("convertible_note_id", { length: 191 }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [
      // Mirroring the indexes from Prisma schema
      index("documents_bucket_id_idx").on(table.bucketId),
      index("documents_uploader_id_idx").on(table.uploaderId),
      index("documents_company_id_idx").on(table.companyId),
      index("documents_share_id_idx").on(table.shareId),
      index("documents_option_id_idx").on(table.optionId),
      index("documents_safe_id_idx").on(table.safeId),
      index("documents_convertible_note_id_idx").on(table.convertibleNoteId),
    ];
  },
);

export const DocumentSchema = createSelectSchema(documents);
export type Document = typeof documents.$inferSelect;

export const documentShares = createTable(
  "document_shares",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    link: varchar("link", { length: 191 }).notNull(),
    publicId: varchar("public_id", { length: 191 }).notNull(),
    linkExpiresAt: timestamp("link_expires_at", {
      withTimezone: true,
    }).notNull(),
    recipients: varchar("recipients", { length: 191 })
      .array()
      .notNull()
      .default([]),
    emailProtected: boolean("email_protected").notNull().default(false),

    // Foreign key reference
    documentId: varchar("document_id", { length: 191 }).notNull(),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [
      // Mirroring the index from Prisma schema
      index("document_shares_document_id_idx").on(table.documentId),
    ];
  },
);

export const DocumentShareSchema = createSelectSchema(documentShares);
export type DocumentShare = typeof documentShares.$inferSelect;
