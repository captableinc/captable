import { protectedProcedure } from "@/trpc/api/trpc";
import { ZodGetTemplateQuerySchema } from "../schema";
import { getPresignedGetUrl } from "@/server/file-uploads";

export const getTemplateProcedure = protectedProcedure
  .input(ZodGetTemplateQuerySchema)
  .query(async ({ ctx, input }) => {
    const user = ctx.session.user;

    const data = await ctx.db.template.findFirstOrThrow({
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
      },
    });

    return getPresignedGetUrl(data.bucket.key);
  });
