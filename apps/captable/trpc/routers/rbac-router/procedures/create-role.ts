import { Audit } from "@/server/audit";
import { withAccessControl } from "@/trpc/api/trpc";
import { withAuth } from "@/trpc/api/trpc";
import { customRoles, db } from "@captable/db";
import type { TActions } from "@captable/rbac/types";
import type { TPermission } from "@captable/rbac/types";
import type { TSubjects } from "@captable/rbac/types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
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
    async ({ input, ctx: { membership, requestIp, userAgent, session } }) => {
      const { user } = session;
      const permissions = extractPermission(input.permissions);

      const [role] = await db
        .insert(customRoles)
        .values({
          companyId: membership.companyId,
          name: input.name,
          permissions: permissions.map((permission) =>
            JSON.stringify(permission),
          ),
        })
        .returning({
          id: customRoles.id,
          name: customRoles.name,
        });

      if (!role) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create role",
        });
      }

      await Audit.create(
        {
          action: "role.created",
          companyId: user.companyId,
          actor: { type: "user", id: user.id },
          context: {
            userAgent,
            requestIp: requestIp || "",
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
