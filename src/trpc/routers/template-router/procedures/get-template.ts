import { getPresignedGetUrl } from "@/server/file-uploads";
import { withAuth } from "@/trpc/api/trpc";
import { ZodGetTemplateQuerySchema } from "../schema";

export const getTemplateProcedure = withAuth
  .input(ZodGetTemplateQuerySchema)
  .query(async ({ ctx, input }) => {
    const user = ctx.session.user;

    const template = await ctx.db.template.findFirstOrThrow({
      where: {
        publicId: input.publicId,
        companyId: user.companyId,
        status: "DRAFT",
      },
      select: {
        name: true,
        status: true,
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
            group: true,
          },
          orderBy: {
            top: "asc",
          },
        },
        eSignRecipient: {
          select: {
            email: true,
            id: true,
          },
        },
      },
    });

    const { key, url } = await getPresignedGetUrl(template.bucket.key);

    return {
      fields: template.fields,
      key,
      url,
      name: template.name,
      status: template.status,
      recipients: template.eSignRecipient,
    };
  });
