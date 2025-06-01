import { createId } from "@paralleldrive/cuid2";
import {
  bigint,
  boolean,
  index,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { CredentialDeviceTypeEnum } from "./enums";
import { createTable } from "./index";

export const passkeys = createTable(
  "passkeys",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    credentialId: varchar("credential_id", { length: 191 }).notNull(), // Using varchar instead of Bytes
    credentialPublicKey: varchar("credential_public_key", {
      length: 191,
    }).notNull(), // Using varchar instead of Bytes
    counter: bigint("counter", { mode: "number" }).notNull(),
    credentialDeviceType: CredentialDeviceTypeEnum(
      "credential_device_type",
    ).notNull(),
    credentialBackedUp: boolean("credential_backed_up").notNull(),
    // String[] is represented as an array of varchar
    transports: varchar("transports", { length: 191 }).array().notNull(),

    // Foreign key reference
    userId: varchar("user_id", { length: 191 }).notNull(),
  },
  (table) => {
    return [
      // Mirroring index from Prisma schema
      index("passkeys_user_id_idx").on(table.userId),
    ];
  },
);

export const PasskeySchema = createSelectSchema(passkeys);
export type Passkey = typeof passkeys.$inferSelect;
