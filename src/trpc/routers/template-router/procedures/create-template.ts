import { withAuth } from "@/trpc/api/trpc";
import { ZodCreateTemplateMutationSchema } from "../schema";
import { generatePublicId } from "@/common/id";

export const createTemplateProcedure = withAuth
  .input(ZodCreateTemplateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const publicId = generatePublicId();
    const user = ctx.session.user;

    return ctx.db.template.create({
      data: {
        status: "DRAFT",
        publicId,
        companyId: user.companyId,
        uploaderId: user.memberId,
        ...input,
      },
      select: {
        publicId: true,
        name: true,
      },
    });
  });
