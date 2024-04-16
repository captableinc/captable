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
      const template = await tx.template.create({
        data: {
          status: "DRAFT",
          publicId,
          companyId: user.companyId,
          uploaderId: user.memberId,
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
          group: "",
        })),
      });

      return template;
    });

    return data;
  });
