import type { TActions } from "@/lib/rbac/actions";
import type { TPermission } from "@/lib/rbac/schema";
import type { TSubjects } from "@/lib/rbac/subjects";
import { Audit } from "@/server/audit";
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
  .mutation(
    async ({
      input,
      ctx: { db, membership, requestIp, userAgent, session },
    }) => {
      const { user } = session;
      const permissions = extractPermission(input.permissions);
      const role = await db.customRole.create({
        data: {
          companyId: membership.companyId,
          name: input.name,
          permissions,
        },
      });
      await Audit.create(
        {
          action: "role.created",
          companyId: user.companyId,
          actor: { type: "user", id: user.id },
          context: {
            userAgent,
            requestIp,
          },
          target: [{ type: "role", id: role.id }],
          summary: `${user.name} created a role ${role.name}`,
        },
        db,
      );

      return { message: "Role successfully created." };
    },
  );

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
