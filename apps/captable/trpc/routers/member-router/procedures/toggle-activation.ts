import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import { and, companies, db, eq, members, users } from "@captable/db";
import { TRPCError } from "@trpc/server";
import { ZodToggleActivationMutationSchema } from "../schema";

export const toggleActivation = withAuth
  .input(ZodToggleActivationMutationSchema)
  .mutation(async ({ ctx: { session, requestIp, userAgent }, input }) => {
    const user = session.user;
    const { memberId, status } = input;

    await db.transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      const [updatedMember] = await tx
        .update(members)
        .set({
          status,
        })
        .where(and(eq(members.id, memberId), eq(members.companyId, companyId)))
        .returning({
          userId: members.userId,
        });

      if (!updatedMember) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Member not found",
        });
      }

      // Get member details for audit
      const memberDetailResult = await tx
        .select({
          userId: members.userId,
          userName: users.name,
          companyName: companies.name,
        })
        .from(members)
        .leftJoin(users, eq(members.userId, users.id))
        .leftJoin(companies, eq(members.companyId, companies.id))
        .where(eq(members.id, memberId))
        .limit(1);

      const memberDetail = memberDetailResult[0];

      await Audit.create(
        {
          action: status ? "member.activated" : "member.deactivated",
          companyId,
          actor: { type: "user", id: user.id },
          context: {
            requestIp: requestIp || "",
            userAgent,
          },
          target: [{ type: "user", id: updatedMember.userId }],
          summary: `${user.name} ${status ? "activated" : "deactivated"} ${
            memberDetail?.userName
          } from ${memberDetail?.companyName}`,
        },
        tx,
      );
    });

    return { success: true };
  });
