import { Audit } from "@/server/audit";
import { withAuth } from "@/trpc/api/trpc";
import {
  companies,
  db,
  eq,
  members,
  users,
  verificationTokens,
} from "@captable/db";
import { ZodAcceptMemberMutationSchema } from "../schema";

export const acceptMemberProcedure = withAuth
  .input(ZodAcceptMemberMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;
    const { userAgent, requestIp } = ctx;

    const { publicId } = await db.transaction(async (trx) => {
      await trx
        .delete(verificationTokens)
        .where(eq(verificationTokens.token, input.token));

      await trx
        .update(users)
        .set({
          name: input.name,
        })
        .where(eq(users.id, user.id));

      const [updatedMember] = await trx
        .update(members)
        .set({
          status: "ACTIVE",
          lastAccessed: new Date(),
          isOnboarded: true,
          userId: user.id,
          workEmail: input.workEmail,
        })
        .where(eq(members.id, input.memberId))
        .returning();

      if (!updatedMember) {
        throw new Error("Failed to update member");
      }

      // Get company details
      const [company] = await trx
        .select({
          publicId: companies.publicId,
          name: companies.name,
          id: companies.id,
        })
        .from(companies)
        .where(eq(companies.id, updatedMember.companyId))
        .limit(1);

      if (!company) {
        throw new Error("Company not found");
      }

      // Get user details
      const [memberUser] = await trx
        .select({
          name: users.name,
        })
        .from(users)
        .where(eq(users.id, updatedMember.userId))
        .limit(1);

      await Audit.create(
        {
          action: "member.accepted",
          companyId: company.id,
          actor: { type: "user", id: user.id },
          context: {
            requestIp: requestIp || "",
            userAgent,
          },
          target: [{ type: "user", id: updatedMember.userId }],
          summary: `${memberUser?.name} joined ${company.name}`,
        },
        trx,
      );

      return { publicId: company.publicId };
    });

    return { success: true, publicId };
  });
