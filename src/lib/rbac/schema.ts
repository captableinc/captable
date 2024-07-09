import { ACTIONS, SUBJECTS, type TActions } from "@/lib/rbac/constants";
import { z } from "zod";

export const permissionSchema = z.object({
  actions: z.array(z.enum(ACTIONS)),
  subject: z.enum(SUBJECTS),
});

export type TPermission = z.infer<typeof permissionSchema>;
