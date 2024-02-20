import { withAuth } from "@/trpc/api/trpc";
import { ZodAddFieldMutationSchema } from "../schema";

export const addFieldProcedure = withAuth
  .input(ZodAddFieldMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;

    await ctx.db.$transaction(async (tx) => {
      const template = await tx.template.findFirstOrThrow({
        where: {
          publicId: input.templatePublicId,
          companyId: user.companyId,
        },
        select: {
          id: true,
        },
      });
      await tx.templateField.deleteMany({
        where: {
          templateId: template.id,
        },
      });

      const data = input.data.map((item) => ({
        ...item,
        templateId: template.id,
      }));

      await tx.templateField.createMany({ data });
    });

    return {};
  });
