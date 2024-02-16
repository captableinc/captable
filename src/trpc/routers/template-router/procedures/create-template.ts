import { protectedProcedure } from "@/trpc/api/trpc";
import { ZodCreateTemplateMutationSchema } from "../schema";
import { generatePublicId } from "@/common/id";

export const createTemplateProcedure = protectedProcedure
  .input(ZodCreateTemplateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const publicId = generatePublicId();
    const user = ctx.session.user;

    return ctx.db.template.create({
      data: {
        status: "draft",
        publicId,
        companyId: user.companyId,
        uploaderId: user.membershipId,
        ...input,
      },
      select: {
        publicId: true,
        name: true,
      },
    });
  });
