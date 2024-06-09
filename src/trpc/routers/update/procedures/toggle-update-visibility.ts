import { UpdateStatusEnum } from "@/prisma/enums";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const toggleUpdateVisibilityProcedure = withAuth
  .input(z.object({ updateId: z.string() }))
  .mutation(async ({ ctx: { db, session, requestIp, userAgent }, input }) => {
    try {
      const authorId = session.user.memberId;
      const memberName = session.user.name;

      const { isPublic } = await db.$transaction(async (tx) => {
        const { companyId } = await checkMembership({ session, tx });

        const foundUpdate = await tx.update.findUnique({
          where: {
            id: input.updateId,
            companyId,
          },
        });
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
        const updated = await tx.update.update({
          where: {
            id: input.updateId,
            companyId,
          },
          data: {
            public: !foundUpdate.public,
            status: foundUpdate.public
              ? UpdateStatusEnum.PRIVATE
              : UpdateStatusEnum.PUBLIC,
          },
        });
        await Audit.create(
          {
            action: updated.public
              ? "update.public-status"
              : "update.private-status",
            companyId,
            actor: { type: "user", id: authorId },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "update", id: updated.id }],
            summary: `${memberName} changed the visibility to ${
              updated.public ? "public" : "private"
            } : ${updated.title}`,
          },
          tx,
        );

        return {
          isPublic:
            updated.public && updated.status === UpdateStatusEnum.PUBLIC,
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
