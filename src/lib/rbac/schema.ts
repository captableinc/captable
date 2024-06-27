import { ACTIONS, SUBJECTS } from "@/constants/rbac";
import { z } from "zod";

const PermissionSchema = z.object({
  actions: z.array(z.enum(ACTIONS)),
  subject: z.enum(SUBJECTS),
});

export type TPermission = z.infer<typeof PermissionSchema>;
