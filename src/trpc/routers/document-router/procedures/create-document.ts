import { protectedProcedure } from "@/trpc/api/trpc";
import { ZodCreateDocumentMutationSchema } from "../schema";
import { generatePublicId } from "@/common/id";
import { env } from "@/env";

export const createDocumentProcedure = protectedProcedure
  .input(ZodCreateDocumentMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;
    const publicId = generatePublicId();

    const document = await ctx.db.document.create({
      data: {
        uploadProvider: env.UPLOAD_PROVIDER,
        companyId: user.companyId,
        publicId,
        uploaderId: user.membershipId,
        ...input,
      },
    });

    return document;
  });
