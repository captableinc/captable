import { checkMembership } from "@/server/auth";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { withAuth } from "@/trpc/api/trpc";
import { ZodGetTemplateQuerySchema } from "../schema";

export const getTemplateProcedure = withAuth
  .input(ZodGetTemplateQuerySchema)
  .query(async ({ ctx, input }) => {
    const { template } = await ctx.db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ tx, session: ctx.session });

      const template = await tx.template.findFirstOrThrow({
        where: {
          publicId: input.publicId,
          companyId: companyId,
          ...(input.isDraftOnly && { status: "DRAFT" }),
        },
        select: {
          name: true,
          status: true,
          completedOn: true,
          bucket: {
            select: {
              key: true,
            },
          },
          fields: {
            select: {
              id: true,
              name: true,
              width: true,
              height: true,
              top: true,
              left: true,
              required: true,
              defaultValue: true,
              readOnly: true,
              type: true,
              viewportHeight: true,
              viewportWidth: true,
              page: true,
              recipientId: true,
              prefilledValue: true,
            },
            orderBy: {
              top: "asc",
            },
          },
          eSignRecipient: {
            select: {
              email: true,
              id: true,
              name: true,
            },
          },
          company: {
            select: {
              name: true,
              logo: true,
            },
          },
        },
      });

      return { template };
    });

    const { key, url } = await getPresignedGetUrl(template.bucket.key);

    return {
      fields: template.fields,
      key,
      url,
      completedOn: template.completedOn,
      name: template.name,
      status: template.status,
      recipients: template.eSignRecipient,
      company: template.company,
    };
  });
