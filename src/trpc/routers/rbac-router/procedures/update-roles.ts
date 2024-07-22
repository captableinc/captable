import { getRoleById } from "@/lib/rbac/access-control";
import { Audit } from "@/server/audit";
import { withAccessControl } from "@/trpc/api/trpc";
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
    async ({
      input,
      ctx: { db, membership, userAgent, requestIp, session },
    }) => {
      const permissions = extractPermission(input.permissions);
      const { user } = session;
      await db.$transaction(async (tx) => {
        const id = await getRoleById({ id: input.roleId, tx });

        if (!id.customRoleId) {
          throw new Error("role id not found");
        }

        const role = await db.customRole.update({
          where: {
            companyId: membership.companyId,
            id: id.customRoleId,
          },
          data: {
            permissions,
            name: input.name,
          },
        });

        await Audit.create(
          {
            action: "role.updated",
            companyId: user.companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "role", id: role.id }],
            summary: `${user.name} deleted the role ${role.name}`,
          },
          tx,
        );
      });

      return { message: "Role successfully updated." };
    },
  );
