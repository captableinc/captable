import { generatePublicId } from "@/common/id";
import { checkMembership } from "@/server/auth";
import type { PrismaTransactionalClient } from "@/server/db";
import { withAuth } from "@/trpc/api/trpc";
import {
  type TypeZodCreateTemplateMutationSchema,
  ZodCreateTemplateMutationSchema,
} from "../schema";

interface CreateTemplateHandlerProps {
  ctx: {
    db: PrismaTransactionalClient;
  };

  input: TypeZodCreateTemplateMutationSchema & {
    companyId: string;
    uploaderId: string;
  };
}

export async function createTemplateHandler({
  ctx: { db },
  input: { recipients, ...rest },
}: CreateTemplateHandlerProps) {
  const publicId = generatePublicId();
  const template = await db.template.create({
    data: {
      status: "DRAFT",
      publicId,
      ...rest,
    },
    select: {
      id: true,
      publicId: true,
      name: true,
    },
  });

  await db.esignRecipient.createMany({
    data: recipients.map((recipient) => ({
      ...recipient,
      templateId: template.id,
    })),
  });

  return template;
}

export const createTemplateProcedure = withAuth
  .input(ZodCreateTemplateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const data = await ctx.db.$transaction(async (tx) => {
      const { companyId, memberId: uploaderId } = await checkMembership({
        tx,
        session: ctx.session,
      });

      return createTemplateHandler({
        input: {
          ...input,
          companyId,
          uploaderId,
        },
        ctx: { db: tx },
      });
    });

    return data;
  });
