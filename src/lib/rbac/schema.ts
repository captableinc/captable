import { ACTIONS, SUBJECTS, type TActions } from "@/constants/rbac";
import { z } from "zod";

export const permissionSchema = z.object({
  actions: z.array(z.enum(ACTIONS)),
  subject: z.enum(SUBJECTS),
});

export const permissionInputSchema = z.record(
  z.enum(SUBJECTS),
  z.record(z.enum(ACTIONS), z.boolean()),
);

export type TPermission = z.infer<typeof permissionSchema>;
export type TPermissionInputSchema = z.infer<typeof permissionInputSchema>;

export const defaultInputPermissionInputs =
  SUBJECTS.reduce<TPermissionInputSchema>((prev, curr) => {
    const actions = ACTIONS.reduce<Partial<Record<TActions, boolean>>>(
      (prev, curr) => {
        prev[curr] = false;

        return prev;
      },
      {},
    );

    prev[curr] = actions;

    return prev;
  }, {});
