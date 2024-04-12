import { generatePublicId } from "@/common/id";
import { withAuth } from "@/trpc/api/trpc";
import { ZodCreateTemplateMutationSchema } from "../schema";

export const createTemplateProcedure = withAuth
  .input(ZodCreateTemplateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const publicId = generatePublicId();
    const user = ctx.session.user;

    const { orderedDelivery, recipients, ...rest } = input;

    return ctx.db.template.create({
      data: {
        status: "DRAFT",
        publicId,
        companyId: user.companyId,
        uploaderId: user.memberId,
        ...rest,
      },
      select: {
        publicId: true,
        name: true,
      },
    });
  });
