import { PayloadType } from "@/lib/types";
import { Audit } from "@/server/audit";
import { withAuth } from "@/trpc/api/trpc";
import { and, db, eq, members, users } from "@captable/db";
import { TRPCError } from "@trpc/server";
import { ZodUpdateProfileMutationSchema } from "../schema";

export const updateProfileProcedure = withAuth
  .input(ZodUpdateProfileMutationSchema)
  .mutation(async ({ ctx: { session, requestIp, userAgent }, input }) => {
    const user = session.user;

    if (input.type === PayloadType.PROFILE_DATA) {
      const { fullName, loginEmail, workEmail, jobTitle } = input.payload;

      await db.transaction(async (tx) => {
        // Update member
        const [updatedMember] = await tx
          .update(members)
          .set({
            title: jobTitle,
            workEmail,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(members.status, "ACTIVE"),
              eq(members.id, user.memberId),
              eq(members.companyId, user.companyId),
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

        // Update user
        await tx
          .update(users)
          .set({
            name: fullName,
            email: loginEmail,
          })
          .where(eq(users.id, updatedMember.userId));

        // Get updated user name for audit
        const [_memberUser] = await tx
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
            summary: `${user.name} updated the profile information.`,
          },
          tx,
        );
      });

      return { success: true };
    }

    if (input.type === PayloadType.PROFILE_AVATAR) {
      const { avatarUrl } = input.payload;

      await db.transaction(async (tx) => {
        // Update member to get userId
        const [updatedMember] = await tx
          .select({ userId: members.userId })
          .from(members)
          .where(
            and(
              eq(members.status, "ACTIVE"),
              eq(members.id, user.memberId),
              eq(members.companyId, user.companyId),
            ),
          )
          .limit(1);

        if (!updatedMember) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Member not found",
          });
        }

        // Update user avatar
        await tx
          .update(users)
          .set({
            image: avatarUrl,
          })
          .where(eq(users.id, updatedMember.userId));

        // Get user name for audit
        const [_memberUser] = await tx
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
            summary: `${user.name} uploaded new profile image.`,
          },
          tx,
        );
      });

      return { success: true };
    }
  });
