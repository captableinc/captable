import { z } from "zod";

export enum TAG {
  SAFE = "safe",
  ESIGN = "esign",
  EQUITY = "equity",
  DATA_ROOM = "data-room",
  GENERIC = "generic",
  CONVERTIBLE_NOTE = "convertible-note",
}

const TagSchema = z.nativeEnum(TAG);
export type TagType = z.infer<typeof TagSchema>;
