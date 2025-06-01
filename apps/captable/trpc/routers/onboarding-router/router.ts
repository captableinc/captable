import { generatePublicId } from "@/lib/common/id";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { companies, db, eq, members, users } from "@captable/db";
import { TRPCError } from "@trpc/server";
import { ZodOnboardingMutationSchema } from "./schema";

import { Audit } from "@/server/audit";

// HERE: Reusing this same router for new company, onboarding and edit company.
export const onboardingRouter = createTRPCRouter({
  onboard: withAuth
    .input(ZodOnboardingMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { userAgent, requestIp } = ctx;
      try {
        const { publicId } = await db.transaction(async (tx) => {
          const publicId = generatePublicId();

          const [company] = await tx
            .insert(companies)
            .values({
              ...input.company,
              incorporationDate: new Date(input.company.incorporationDate),
              publicId,
              updatedAt: new Date(),
            })
            .returning({
              id: companies.id,
              name: companies.name,
            });

          if (!company) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create company",
            });
          }

          const [user] = await tx
            .update(users)
            .set({
              name: `${input.user.name}`,
              email: `${input.user.email}`,
            })
            .where(eq(users.id, ctx.session.user.id))
            .returning({
              id: users.id,
              name: users.name,
            });

          if (!user) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to update user",
            });
          }

          await tx.insert(members).values({
            isOnboarded: true,
            status: "ACTIVE",
            title: input.user.title,
            userId: user.id,
            companyId: company.id,
            lastAccessed: new Date(),
            updatedAt: new Date(),
          });

          await Audit.create(
            {
              action: "user.onboarded",
              companyId: company.id,
              actor: { type: "user", id: user.id },
              context: {
                userAgent,
                requestIp: requestIp || "",
              },
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
              context: {
                userAgent,
                requestIp: requestIp || "",
              },
              target: [{ type: "company", id: company.id }],
              summary: `${user.name} created company ${company.name}`,
            },
            tx,
          );

          return { publicId };
        });

        return { success: true, message: "successfully onboarded", publicId };
      } catch (error) {
        console.error("Error onboarding:", error);
        return {
          success: false,
          message:
            "Oops, something went wrong while onboarding. Please try again.",
        };
      }
    }),
});
