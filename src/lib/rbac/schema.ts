import { z } from "zod";
import { ACTIONS } from "./actions";
import { SUBJECTS } from "./subjects";

export const permissionSchema = z.object({
  actions: z.array(z.enum(ACTIONS)),
  subject: z.enum(SUBJECTS),
});

export type TPermission = z.infer<typeof permissionSchema>;
