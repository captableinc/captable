import { Audit } from "@/server/audit";
import { getRoleById } from "@/server/member";
import { withAccessControl } from "@/trpc/api/trpc";
import { and, customRoles, db, eq } from "@captable/db";
import { TRPCError } from "@trpc/server";
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
    await db.transaction(async (tx) => {
      const role = await getRoleById({ id: input.roleId, tx });
      const { user } = session;
      if (!role.customRoleId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "default roles cannot be deleted",
        });
      }

      const [existingRole] = await tx
        .delete(customRoles)
        .where(
          and(
            eq(customRoles.id, role.customRoleId),
            eq(customRoles.companyId, companyId),
          ),
        )
        .returning({
          id: customRoles.id,
          name: customRoles.name,
        });

      if (!existingRole) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }

      await Audit.create(
        {
          action: "role.deleted",
          companyId: user.companyId,
          actor: { type: "user", id: user.id },
          context: {
            userAgent,
            requestIp: requestIp || "",
          },
          target: [{ type: "role", id: existingRole.id }],
          summary: `${user.name} deleted the role ${existingRole.name}`,
        },
        tx,
      );
    });
    return {};
  });
