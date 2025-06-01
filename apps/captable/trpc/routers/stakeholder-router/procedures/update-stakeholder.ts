import { Audit } from "@/server/audit";
import { withAccessControl } from "@/trpc/api/trpc";
import { and, db, eq, stakeholders } from "@captable/db";
import { TRPCError } from "@trpc/server";
import { ZodUpdateStakeholderMutationSchema } from "./../schema";

export const updateStakeholderProcedure = withAccessControl
  .meta({ policies: { stakeholder: { allow: ["update"] } } })
  .input(ZodUpdateStakeholderMutationSchema)
  .mutation(
    async ({
      ctx: {
        session,
        requestIp,
        userAgent,
        membership: { companyId },
      },
      input,
    }) => {
      try {
        const { id: stakeholderId, ...rest } = input;
        const user = session.user;

        if (!stakeholderId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Stakeholder ID is required for update",
          });
        }

        await db.transaction(async (tx) => {
          const { stakeholderType, currentRelationship, ...otherFields } = rest;

          const updateData = {
            ...otherFields,
            updatedAt: new Date(),
            ...(stakeholderType && {
              stakeholderType: stakeholderType as "INDIVIDUAL" | "INSTITUTION",
            }),
            ...(currentRelationship && {
              currentRelationship: currentRelationship as
                | "ADVISOR"
                | "BOARD_MEMBER"
                | "CONSULTANT"
                | "EMPLOYEE"
                | "EX_ADVISOR"
                | "EX_CONSULTANT"
                | "EX_EMPLOYEE"
                | "FOUNDER"
                | "INVESTOR"
                | "OTHER",
            }),
          };

          const [updated] = await tx
            .update(stakeholders)
            .set(updateData)
            .where(
              and(
                eq(stakeholders.id, stakeholderId),
                eq(stakeholders.companyId, companyId),
              ),
            )
            .returning({
              id: stakeholders.id,
              name: stakeholders.name,
            });

          if (!updated) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Stakeholder not found or update failed",
            });
          }

          await Audit.create(
            {
              action: "stakeholder.updated",
              companyId: user.companyId,
              actor: { type: "user", id: user.id },
              context: {
                requestIp: requestIp || "",
                userAgent,
              },
              target: [{ type: "stakeholder", id: updated.id }],
              summary: `${user.name} updated details of stakeholder : ${updated.name}`,
            },
            tx,
          );
        });

        return {
          success: true,
          message: "Successfully updated the stakeholder",
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          message: "Something went wrong. Please try again later",
        };
      }
    },
  );
