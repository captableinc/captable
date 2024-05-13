import { checkMembership } from "@/server/auth";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { withAuth } from "@/trpc/api/trpc";
import { ZodGetDocumentQuerySchema } from "../schema";

export const getDocumentProcedure = withAuth
  .input(ZodGetDocumentQuerySchema)
  .query(async ({ ctx: { db, session }, input }) => {
    const data = await db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ tx, session });

      const data = await tx.document.findFirstOrThrow({
        where: {
          publicId: input.publicId,
          companyId,
        },
        select: {
          bucket: {
            select: {
              key: true,
            },
          },
        },
      });

      return data;
    });

    return getPresignedGetUrl(data.bucket.key);
  });
