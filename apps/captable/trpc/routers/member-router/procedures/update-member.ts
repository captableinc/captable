import { Audit } from "@/server/audit";
import { getRoleById } from "@/server/member";
import { withAccessControl } from "@/trpc/api/trpc";
import { and, db, eq, members, users } from "@captable/db";
import { TRPCError } from "@trpc/server";
import { ZodUpdateMemberMutationSchema } from "../schema";

export const updateMemberProcedure = withAccessControl
  .input(ZodUpdateMemberMutationSchema)
  .meta({
    policies: {
      members: { allow: ["update"] },
    },
  })
  .mutation(
    async ({ ctx: { session, requestIp, userAgent, membership }, input }) => {
      const { memberId, name, roleId, ...rest } = input;
      const { companyId } = membership;
      const user = session.user;

      await db.transaction(async (tx) => {
        const role = await getRoleById({ tx, id: roleId });

        // Update member
        const [updatedMember] = await tx
          .update(members)
          .set({
            ...rest,
            role: role.role as "ADMIN" | "CUSTOM" | null,
            customRoleId: role.customRoleId,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(members.status, "ACTIVE"),
              eq(members.id, memberId),
              eq(members.companyId, companyId),
            ),
          )
          .returning({
            userId: members.userId,
          });

        if (!updatedMember) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Member not found",
          });
        }

        // Update user name
        if (name) {
          await tx
            .update(users)
            .set({ name })
            .where(eq(users.id, updatedMember.userId));
        }

        // Get updated user name for audit
        const [memberUser] = await tx
          .select({ name: users.name })
          .from(users)
          .where(eq(users.id, updatedMember.userId))
          .limit(1);

        await Audit.create(
          {
            action: "member.updated",
            companyId: user.companyId,
            actor: { type: "user", id: user.id },
            context: {
              requestIp: requestIp || "",
              userAgent,
            },
            target: [{ type: "user", id: updatedMember.userId }],
            summary: `${user.name} updated ${memberUser?.name} details`,
          },
          tx,
        );
      });

      return { success: true };
    },
  );
