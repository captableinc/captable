import { getRoleById } from "@/lib/rbac/access-control";
import { Audit } from "@/server/audit";
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
      userAgent,
      requestIp,
      session,
    } = ctx;
    await ctx.db.$transaction(async (tx) => {
      const role = await getRoleById({ id: input.roleId, tx });
      const { user } = session;
      if (!role.customRoleId) {
        throw new Error("default roles cannot be deleted");
      }

      const existingRole = await tx.customRole.delete({
        where: { id: role.customRoleId, companyId },
      });

      await Audit.create(
        {
          action: "role.deleted",
          companyId: user.companyId,
          actor: { type: "user", id: user.id },
          context: {
            userAgent,
            requestIp,
          },
          target: [{ type: "role", id: existingRole.id }],
          summary: `${user.name} deleted the role ${existingRole.name}`,
        },
        tx,
      );
    });
    return {};
  });
