import { withAuth } from "@/trpc/api/trpc";
import { ZodGetTemplateQuerySchema } from "../schema";
import { getPresignedGetUrl } from "@/server/file-uploads";

export const getTemplateProcedure = withAuth
  .input(ZodGetTemplateQuerySchema)
  .query(async ({ ctx, input }) => {
    const user = ctx.session.user;

    const template = await ctx.db.template.findFirstOrThrow({
      where: {
        publicId: input.publicId,
        companyId: user.companyId,
      },
      select: {
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
            placeholder: true,
            type: true,
          },
        },
      },
    });

    const { key, url } = await getPresignedGetUrl(template.bucket.key);

    return {
      fields: template.fields,
      key,
      url,
    };
  });
