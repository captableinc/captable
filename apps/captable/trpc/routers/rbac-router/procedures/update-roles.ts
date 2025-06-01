import { Audit } from "@/server/audit";
import { getRoleById } from "@/server/member";
import { withAccessControl } from "@/trpc/api/trpc";
import { and, customRoles, db, eq } from "@captable/db";
import { TRPCError } from "@trpc/server";
import { ZodUpdateRoleMutationSchema } from "../schema";
import { extractPermission } from "./create-role";

export const updateRolesProcedure = withAccessControl
  .input(ZodUpdateRoleMutationSchema)
  .meta({
    policies: {
      roles: { allow: ["update"] },
    },
  })
  .mutation(
    async ({ input, ctx: { membership, userAgent, requestIp, session } }) => {
      const permissions = extractPermission(input.permissions);
      const { user } = session;
      await db.transaction(async (tx) => {
        const id = await getRoleById({ id: input.roleId, tx });

        if (!id.customRoleId) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "role id not found",
          });
        }

        const [role] = await tx
          .update(customRoles)
          .set({
            permissions: permissions.map((permission) =>
              JSON.stringify(permission),
            ),
            name: input.name,
          })
          .where(
            and(
              eq(customRoles.companyId, membership.companyId),
              eq(customRoles.id, id.customRoleId),
            ),
          )
          .returning({
            id: customRoles.id,
            name: customRoles.name,
          });

        if (!role) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Role not found",
          });
        }

        await Audit.create(
          {
            action: "role.updated",
            companyId: user.companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp: requestIp || "",
            },
            target: [{ type: "role", id: role.id }],
            summary: `${user.name} updated the role ${role.name}`,
          },
          tx,
        );
      });

      return { message: "Role successfully updated." };
    },
  );
