import { withAuth } from "@/trpc/api/trpc";
import { ZodCreateDocumentMutationSchema } from "../schema";
import { generatePublicId } from "@/common/id";

export const createDocumentProcedure = withAuth
  .input(ZodCreateDocumentMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;
    const publicId = generatePublicId();

    const document = await ctx.db.document.create({
      data: {
        companyId: user.companyId,
        uploaderId: user.memberId,
        publicId,
        ...input,
      },
    });

    return document;
  });
