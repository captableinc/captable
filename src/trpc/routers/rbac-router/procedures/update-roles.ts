import { getRoleById } from "@/lib/rbac/access-control";
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
  .mutation(async ({ input, ctx: { db, membership } }) => {
    const permissions = extractPermission(input.permissions);

    await db.$transaction(async (tx) => {
      const id = await getRoleById({ id: input.roleId, tx });

      if (!id.customRoleId) {
        throw new Error("role id not found");
      }

      await db.customRole.update({
        where: {
          companyId: membership.companyId,
          id: id.customRoleId,
        },
        data: {
          permissions,
          name: input.name,
        },
      });
    });

    return { message: "Role successfully updated." };
  });
