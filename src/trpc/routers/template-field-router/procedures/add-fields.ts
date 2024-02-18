import { protectedProcedure } from "@/trpc/api/trpc";
import { ZodAddFieldMutationSchema } from "../schema";

export const addFieldProcedure = protectedProcedure
  .input(ZodAddFieldMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;

    await ctx.db.$transaction(async (tx) => {
      const deleteAbleIds = input.data.map((item) => item.id);
      const template = await tx.template.findFirstOrThrow({
        where: {
          publicId: input.templatePublicId,
          companyId: user.companyId,
        },
        select: {
          id: true,
        },
      });

      try {
        await tx.templateField.deleteMany({
          where: {
            templateId: template.id,
            id: {
              in: deleteAbleIds,
            },
          },
        });
      } catch (error) {}

      const data = input.data.map((item) => ({
        ...item,
        templateId: template.id,
      }));

      await tx.templateField.createMany({ data });
    });

    return {};
  });
