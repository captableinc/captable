import type { TActions, TSubjects } from "@/lib/rbac/constants";
import type { TPermission } from "@/lib/rbac/schema";
import { withAccessControl } from "@/trpc/api/trpc";
import {
  type TypeZodCreateRoleMutationSchema,
  ZodCreateRoleMutationSchema,
} from "../schema";

export const createRolesProcedure = withAccessControl
  .input(ZodCreateRoleMutationSchema)
  .meta({
    policies: {
      roles: { allow: ["create"] },
    },
  })
  .mutation(async ({ input, ctx: { db, membership } }) => {
    const permissions = extractPermission(input.permissions);

    await db.customRole.create({
      data: {
        companyId: membership.companyId,
        name: input.name,
        permissions,
      },
    });

    return { message: "role created successfully" };
  });

export function extractPermission(
  permissionInput: TypeZodCreateRoleMutationSchema["permissions"],
) {
  const permissions: TPermission[] = [];

  for (const subject of Object.keys(permissionInput)) {
    const policy = permissionInput[subject as TSubjects];
    const data: TPermission = { actions: [], subject: subject as TSubjects };

    if (policy) {
      if (policy["*"]) {
        data.actions.push("*");
      }

      for (const action of Object.keys(policy)) {
        if (policy[action as TActions] && action !== "*") {
          data.actions.push(action as TActions);
        }
      }

      permissions.push(data);
    }
  }
  return permissions;
}
