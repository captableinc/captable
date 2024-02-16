import { protectedProcedure } from "@/trpc/api/trpc";
import { ZodGetDocumentQuerySchema } from "../schema";
import { getPresignedGetUrl } from "@/server/file-uploads";

export const getDocumentProcedure = protectedProcedure
  .input(ZodGetDocumentQuerySchema)
  .query(async ({ ctx, input }) => {
    const user = ctx.session.user;

    const data = await ctx.db.document.findFirstOrThrow({
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
