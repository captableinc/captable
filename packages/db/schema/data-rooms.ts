import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  index,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { createTable } from "./index";

export const dataRooms = createTable(
  "data_rooms",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }).notNull(),
    publicId: varchar("public_id", { length: 191 }).notNull().unique(),
    public: boolean("public").notNull().default(false),

    // Foreign key reference
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
      index("data_rooms_public_id_idx").on(table.publicId),
      index("data_rooms_company_id_idx").on(table.companyId),
      uniqueIndex("data_rooms_company_id_name_unique").on(
        table.companyId,
        table.name,
      ),
    ];
  },
);

export const DataRoomSchema = createSelectSchema(dataRooms);
export type DataRoom = typeof dataRooms.$inferSelect;

export const dataRoomDocuments = createTable(
  "data_room_documents",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),

    // Foreign key references
    dataRoomId: varchar("data_room_id", { length: 191 }).notNull(),
    documentId: varchar("document_id", { length: 191 }).notNull(),

    // Timestamp
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return [
      // Mirroring the indexes from Prisma schema
      index("data_room_documents_data_room_id_idx").on(table.dataRoomId),
      index("data_room_documents_document_id_idx").on(table.documentId),
      uniqueIndex("data_room_documents_data_room_id_document_id_unique").on(
        table.dataRoomId,
        table.documentId,
      ),
    ];
  },
);

export const DataRoomDocumentSchema = createSelectSchema(dataRoomDocuments);
export type DataRoomDocument = typeof dataRoomDocuments.$inferSelect;

export const dataRoomRecipients = createTable(
  "data_room_recipients",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }).notNull(),

    // Foreign key references
    dataRoomId: varchar("data_room_id", { length: 191 }).notNull(),
    memberId: varchar("member_id", { length: 191 }),
    stakeholderId: varchar("stakeholder_id", { length: 191 }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [
      // Mirroring the indexes from Prisma schema
      index("data_room_recipients_id_data_room_id_idx").on(
        table.id,
        table.dataRoomId,
      ),
      index("data_room_recipients_member_id_idx").on(table.memberId),
      index("data_room_recipients_data_room_id_idx").on(table.dataRoomId),
      index("data_room_recipients_stakeholder_id_idx").on(table.stakeholderId),
      uniqueIndex("data_room_recipients_data_room_id_email_unique").on(
        table.dataRoomId,
        table.email,
      ),
    ];
  },
);

export const DataRoomRecipientSchema = createSelectSchema(dataRoomRecipients);
export type DataRoomRecipient = typeof dataRoomRecipients.$inferSelect;

export const updateRecipients = createTable(
  "update_recipients",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }).notNull(),

    // Foreign key references
    updateId: varchar("update_id", { length: 191 }).notNull(),
    memberId: varchar("member_id", { length: 191 }),
    stakeholderId: varchar("stakeholder_id", { length: 191 }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => {
    return [
      // Mirroring the indexes from Prisma schema
      index("update_recipients_id_update_id_idx").on(table.id, table.updateId),
      index("update_recipients_member_id_idx").on(table.memberId),
      index("update_recipients_update_id_idx").on(table.updateId),
      index("update_recipients_stakeholder_id_idx").on(table.stakeholderId),
      uniqueIndex("update_recipients_update_id_email_unique").on(
        table.updateId,
        table.email,
      ),
    ];
  },
);

export const UpdateRecipientSchema = createSelectSchema(updateRecipients);
export type UpdateRecipient = typeof updateRecipients.$inferSelect;
