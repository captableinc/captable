import { Audit } from "@/server/audit";
import { SafeMutationSchema } from "./schema";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";

export const safeRouter = createTRPCRouter({
  create: withAuth
    .input(SafeMutationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { userAgent, requestIp } = ctx;
        const companyId = ctx.session.user.companyId;

        await ctx.db.$transaction(async (tx) => {
          const data = {
            publicId: input.publicId,
            type: input.type,
            status: input.status,
            capital: input.capital,
            valuationCap: input.valuationCap,
            discountRate: input.discountRate,
            mfn: input.mfn,
            proRata: input.proRata,
            additionalTerms: input.additionalTerms,
            shareholderId: input.shareholderId,
            issueDate: input.issueDate,
            boardApprovalDate: input.boardApprovalDate,
          };
          // await tx.safe.create({ data });

          await Audit.create(
            {
              action: "safe.created",
              companyId,
              actor: { type: "user", id: ctx.session.user.id },
              context: { requestIp, userAgent },
              target: [{ type: "company", id: companyId }],
              summary: `${ctx.session.user.name} created a new SAFE agreement.`,
            },
            tx,
          );
        });

        return {
          success: true,
          message: "Successfully created a new SAFE agreement.",
        };
      } catch (error) {
        console.error("Error creating an SAFE:", error);
        return {
          success: false,
          message: "Oops, something went wrong. Please try again later.",
        };
      }
    }),

  // import: withAuth
  //   .input(SafeMutationSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       try {
  //         const { userAgent, requestIp } = ctx;
  //         const companyId = ctx.session.user.companyId;

  //         await ctx.db.$transaction(async (tx) => {
  //           const data = {};

  //           await tx.safe.create({ data });
  //           await Audit.create(
  //             {
  //               action: "safe.imported",
  //               companyId,
  //               actor: { type: "user", id: ctx.session.user.id },
  //               context: {
  //                 requestIp,
  //                 userAgent,
  //               },
  //               target: [{ type: "company", id: companyId }],
  //               summary: `${ctx.session.user.name} imported an existing SAFE agreement.`,
  //             },
  //             tx,
  //           );
  //         });

  //         return { success: true, message: "Successfully imported an existing SAFE agreement." };
  //     } catch (error) {
  //       console.error("Error importing an existing SAFE.", error);
  //       return {
  //         success: false,
  //         message: "Oops, something went wrong. Please try again later.",
  //       };
  //     }
  //   }),
});
