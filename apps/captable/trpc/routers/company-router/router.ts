import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { createTRPCRouter, withAccessControl, withAuth } from "@/trpc/api/trpc";
import { and, companies, db, eq, members } from "@captable/db";
import { TRPCError } from "@trpc/server";
import { ZodOnboardingMutationSchema } from "../onboarding-router/schema";
import { ZodSwitchCompanyMutationSchema } from "./schema";

export const companyRouter = createTRPCRouter({
  getCompany: withAuth.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const companyId = user.companyId;

    const companyResult = await db
      .select({
        id: members.id,
        title: members.title,
        companyId: companies.id,
        companyPublicId: companies.publicId,
        companyName: companies.name,
        companyWebsite: companies.website,
        companyIncorporationDate: companies.incorporationDate,
        companyIncorporationType: companies.incorporationType,
        companyIncorporationState: companies.incorporationState,
        companyIncorporationCountry: companies.incorporationCountry,
        companyState: companies.state,
        companyCity: companies.city,
        companyZipcode: companies.zipcode,
        companyStreetAddress: companies.streetAddress,
        companyCountry: companies.country,
        companyLogo: companies.logo,
      })
      .from(members)
      .innerJoin(companies, eq(members.companyId, companies.id))
      .where(
        and(eq(members.id, user.memberId), eq(members.companyId, companyId)),
      )
      .limit(1);

    const rawCompany = companyResult[0];
    if (!rawCompany) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Company not found",
      });
    }

    const company = {
      id: rawCompany.id,
      title: rawCompany.title,
      company: {
        id: rawCompany.companyId,
        publicId: rawCompany.companyPublicId,
        name: rawCompany.companyName,
        website: rawCompany.companyWebsite,
        incorporationDate: rawCompany.companyIncorporationDate,
        incorporationType: rawCompany.companyIncorporationType,
        incorporationState: rawCompany.companyIncorporationState,
        incorporationCountry: rawCompany.companyIncorporationCountry,
        state: rawCompany.companyState,
        city: rawCompany.companyCity,
        zipcode: rawCompany.companyZipcode,
        streetAddress: rawCompany.companyStreetAddress,
        country: rawCompany.companyCountry,
        logo: rawCompany.companyLogo,
      },
    };

    return company;
  }),
  switchCompany: withAuth
    .input(ZodSwitchCompanyMutationSchema)
    .mutation(async ({ ctx: _ctx, input }) => {
      await db.transaction(async (tx) => {
        const memberResult = await tx
          .select({
            id: members.id,
          })
          .from(members)
          .where(and(eq(members.id, input.id), eq(members.isOnboarded, true)))
          .limit(1);

        const member = memberResult[0];
        if (!member) {
          return { success: true };
        }

        await tx
          .update(members)
          .set({
            lastAccessed: new Date(),
          })
          .where(eq(members.id, member.id));
      });

      return { success: true };
    }),
  updateCompany: withAccessControl
    .meta({ policies: { company: { allow: ["update"] } } })
    .input(ZodOnboardingMutationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { company } = input;
        const { incorporationDate, ...rest } = company;
        const { requestIp, userAgent, session } = ctx;
        const { user } = session;
        const { companyId } = ctx.membership;

        await db
          .update(companies)
          .set({
            incorporationDate: new Date(incorporationDate),
            ...rest,
          })
          .where(eq(companies.id, companyId));

        await Audit.create(
          {
            action: "company.updated",
            companyId: user.companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp: requestIp || "",
            },
            target: [{ type: "company", id: user.companyId }],
            summary: `${user.name} updated the company ${company.name}`,
          },
          db,
        );

        return {
          success: true,
          message: "successfully updated company",
        };
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
