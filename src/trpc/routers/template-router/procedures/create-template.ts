import { generatePublicId } from "@/common/id";
import { withAuth } from "@/trpc/api/trpc";
import { ZodCreateTemplateMutationSchema } from "../schema";

export const createTemplateProcedure = withAuth
  .input(ZodCreateTemplateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const publicId = generatePublicId();
    const user = ctx.session.user;

    const { recipients, ...rest } = input;

    const data = await ctx.db.$transaction(async (tx) => {
      const { companyId, id: uploaderId } = await tx.member.findFirstOrThrow({
        where: {
          id: user.memberId,
        },
        select: {
          companyId: true,
          id: true,
        },
      });

      const template = await tx.template.create({
        data: {
          status: "DRAFT",
          publicId,
          companyId,
          uploaderId,
          ...rest,
        },
        select: {
          id: true,
          publicId: true,
          name: true,
        },
      });

      await tx.esignRecipient.createMany({
        data: recipients.map((recipient) => ({
          ...recipient,
          templateId: template.id,
        })),
      });

      return template;
    });

    return data;
  });
