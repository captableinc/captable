import { createTRPCRouter, protectedProcedure } from "@/trpc/api/trpc";
import { ZodOnboardingMutationSchema } from "./schema";
import { generatePublicId } from "@/common/id";

import { Audit } from "@/server/audit";

export const onboardingRouter = createTRPCRouter({
  onboard: protectedProcedure
    .input(ZodOnboardingMutationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { publicId } = await ctx.db.$transaction(async (tx) => {
          const publicId = generatePublicId();

          const company = await tx.company.create({
            data: {
              ...input.company,
              incorporationDate: new Date(input.company.incorporationDate),
              publicId,
            },
          });

          const user = await tx.user.update({
            where: {
              id: ctx.session.user.id,
            },
            data: {
              name: `${input.user.name}`,
              email: `${input.user.email}`,
            },
            select: {
              id: true,
              name: true,
            },
          });

          await tx.membership.create({
            data: {
              access: "admin",
              active: true,
              isOnboarded: true,
              status: "accepted",
              title: input.user.title,
              userId: user.id,
              companyId: company.id,
              lastAccessed: new Date(),
            },
          });

          await Audit.create(
            {
              action: "user.onboarded",
              companyId: company.id,
              actor: { type: "user", id: user.id },
              context: {},
              target: [{ type: "company", id: company.id }],
              summary: `${user.name} onboarded ${company.name}`,
            },
            tx,
          );

          await Audit.create(
            {
              action: "company.created",
              companyId: company.id,
              actor: { type: "user", id: user.id },
              context: {},
              target: [{ type: "company", id: company.id }],
              summary: `${user.name} created company ${company.name}`,
            },
            tx,
          );

          return { publicId };
        });

        return { success: true, message: "successfully onboarded", publicId };
      } catch (error) {
        return { success: false, message: "failed to onboard" };
      }
    }),
});
