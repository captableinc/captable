import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { companies, count, db, eq, shareClasses } from "@captable/db";
import { TRPCError } from "@trpc/server";
import { ShareClassMutationSchema } from "./schema";

export const shareClassRouter = createTRPCRouter({
  create: withAuth
    .input(ShareClassMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { userAgent, requestIp } = ctx;

      try {
        const prefix = (input.classType === "COMMON" ? "CS" : "PS") as
          | "CS"
          | "PS";

        await db.transaction(async (tx) => {
          const { companyId } = await checkMembership({
            tx,
            session: ctx.session,
          });

          const [maxIdxResult] = await tx
            .select({ count: count() })
            .from(shareClasses)
            .where(eq(shareClasses.companyId, companyId));

          const idx = (maxIdxResult?.count || 0) + 1;
          const data = {
            idx,
            prefix,
            companyId,
            name: input.name,
            classType: input.classType,
            initialSharesAuthorized: input.initialSharesAuthorized,
            boardApprovalDate: new Date(input.boardApprovalDate),
            stockholderApprovalDate: new Date(input.stockholderApprovalDate),
            votesPerShare: input.votesPerShare,
            parValue: input.parValue,
            pricePerShare: input.pricePerShare,
            seniority: input.seniority,
            conversionRights: input.conversionRights,
            convertsToShareClassId: input.convertsToShareClassId,
            liquidationPreferenceMultiple: input.liquidationPreferenceMultiple,
            participationCapMultiple: input.participationCapMultiple,
            updatedAt: new Date(),
          };

          await tx.insert(shareClasses).values(data);

          await Audit.create(
            {
              action: "shareClass.created",
              companyId,
              actor: { type: "user", id: ctx.session.user.id },
              context: {
                userAgent,
                requestIp: requestIp || "",
              },
              target: [{ type: "company", id: companyId }],
              summary: `${ctx.session.user.name} created a share class - ${input.name}`,
            },
            tx,
          );
        });

        return { success: true, message: "Share class created successfully." };
      } catch (error) {
        console.error("Error creating shareClass:", error);
        return {
          success: false,
          message: "Oops, something went wrong. Please try again later.",
        };
      }
    }),

  update: withAuth
    .input(ShareClassMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { userAgent, requestIp } = ctx;

      try {
        const prefix = (input.classType === "COMMON" ? "CS" : "PS") as
          | "CS"
          | "PS";

        await db.transaction(async (tx) => {
          const { companyId } = await checkMembership({
            tx,
            session: ctx.session,
          });

          if (!input.id) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Share class ID is required for update",
            });
          }

          const data = {
            prefix,
            name: input.name,
            classType: input.classType,
            initialSharesAuthorized: input.initialSharesAuthorized,
            boardApprovalDate: new Date(input.boardApprovalDate),
            stockholderApprovalDate: new Date(input.stockholderApprovalDate),
            votesPerShare: input.votesPerShare,
            parValue: input.parValue,
            pricePerShare: input.pricePerShare,
            seniority: input.seniority,
            conversionRights: input.conversionRights,
            convertsToShareClassId: input.convertsToShareClassId,
            liquidationPreferenceMultiple: input.liquidationPreferenceMultiple,
            participationCapMultiple: input.participationCapMultiple,
            updatedAt: new Date(),
          };

          await tx
            .update(shareClasses)
            .set(data)
            .where(eq(shareClasses.id, input.id));

          await Audit.create(
            {
              action: "shareClass.updated",
              companyId,
              actor: { type: "user", id: ctx.session.user.id },
              context: {
                userAgent,
                requestIp: requestIp || "",
              },
              target: [{ type: "company", id: companyId }],
              summary: `${ctx.session.user.name} updated a share class - ${input.name}`,
            },
            tx,
          );
        });

        return { success: true, message: "Share class updated successfully." };
      } catch (error) {
        console.error("Error updating shareClass:", error);
        return {
          success: false,
          message: "Oops, something went wrong. Please try again later.",
        };
      }
    }),

  get: withAuth.query(async ({ ctx: { session } }) => {
    const shareClass = await db.transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      return await tx
        .select({
          id: shareClasses.id,
          name: shareClasses.name,
          company: {
            name: companies.name,
          },
        })
        .from(shareClasses)
        .leftJoin(companies, eq(shareClasses.companyId, companies.id))
        .where(eq(shareClasses.companyId, companyId));
    });
    return shareClass;
  }),
});
