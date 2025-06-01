import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import { UpdateStatusEnum, and, db, eq, updates } from "@captable/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const toggleUpdateVisibilityProcedure = withAuth
  .input(z.object({ updateId: z.string() }))
  .mutation(async ({ ctx: { session, requestIp, userAgent }, input }) => {
    try {
      const authorId = session.user.memberId;
      const memberName = session.user.name;

      const { isPublic } = await db.transaction(async (tx) => {
        const { companyId } = await checkMembership({ session, tx });

        const foundUpdateResult = await tx
          .select({
            id: updates.id,
            title: updates.title,
            public: updates.public,
            status: updates.status,
          })
          .from(updates)
          .where(
            and(
              eq(updates.id, input.updateId),
              eq(updates.companyId, companyId),
            ),
          )
          .limit(1);

        const foundUpdate = foundUpdateResult[0];
        if (!foundUpdate) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No updates found",
          });
        }
        if (foundUpdate.status === "DRAFT") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "You must share this update first to change visibility mode.",
          });
        }

        const newPublicStatus = !foundUpdate.public;
        const newStatus = foundUpdate.public ? "PRIVATE" : "PUBLIC";

        const [updated] = await tx
          .update(updates)
          .set({
            public: newPublicStatus,
            status: newStatus as "DRAFT" | "PUBLIC" | "PRIVATE",
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(updates.id, input.updateId),
              eq(updates.companyId, companyId),
            ),
          )
          .returning({
            id: updates.id,
            title: updates.title,
            public: updates.public,
            status: updates.status,
          });

        if (!updated) {
          throw new Error("Failed to update visibility");
        }

        await Audit.create(
          {
            action: "update.updated",
            companyId,
            actor: { type: "user", id: authorId },
            context: {
              userAgent,
              requestIp: requestIp || "",
            },
            target: [{ type: "update", id: updated.id }],
            summary: `${memberName} changed the visibility to ${
              updated.public ? "public" : "private"
            } : ${updated.title}`,
          },
          tx,
        );

        return {
          isPublic: updated.public && updated.status === "PUBLIC",
        };
      });
      return {
        success: true,
        message: isPublic ? "PUBLIC" : "PRIVATE",
      };
    } catch (error) {
      console.error("Error toggling the update visibility :", error);
      if (error instanceof TRPCError) {
        return {
          success: false,
          message: error.message,
        };
      }
      return {
        success: false,
        message: "Oops, something went wrong. Please try again later.",
      };
    }
  });
