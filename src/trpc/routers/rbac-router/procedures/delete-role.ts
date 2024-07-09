import { getRoleById } from "@/lib/rbac/access-control";
import { withAccessControl } from "@/trpc/api/trpc";
import { ZodDeleteRoleMutationSchema } from "../schema";

export const deleteRoleProcedure = withAccessControl
  .meta({
    policies: {
      roles: { allow: ["delete"] },
    },
  })
  .input(ZodDeleteRoleMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const {
      membership: { companyId },
    } = ctx;
    await ctx.db.$transaction(async (tx) => {
      const role = await getRoleById({ id: input.roleId, tx });

      if (!role.customRoleId) {
        throw new Error("default roles cannot be deleted");
      }

      await tx.customRole.delete({
        where: { id: role.customRoleId, companyId },
      });
    });
    return {};
  });
