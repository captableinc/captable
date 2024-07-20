import { generatePublicId } from "@/common/id";
import { Audit } from "@/server/audit";
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
    requestIp: string;
    userAgent: string;
    user: {
      id: string;
      name: string;
      companyId: string;
    };
  };

  input: TypeZodCreateTemplateMutationSchema & {
    companyId: string;
    uploaderId: string;
  };
}

export async function createTemplateHandler({
  ctx: { db, user, userAgent, requestIp },
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

  await Audit.create(
    {
      action: "template.created",
      companyId: user.companyId,
      actor: { type: "user", id: user.id },
      context: {
        userAgent,
        requestIp,
      },
      target: [{ type: "template", id: template.id }],
      summary: `${user.name} added templateField for template ID ${template.id}`,
    },
    db,
  );

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
    const { requestIp, userAgent, session } = ctx;

    const user = {
      name: session.user.name || "",
      id: session.user.id,
      companyId: session.user.companyId,
    };

    const data = await ctx.db.$transaction(async (tx) => {
      const { companyId, memberId: uploaderId } = await checkMembership({
        tx,
        session: ctx.session,
      });

      return await createTemplateHandler({
        input: {
          ...input,
          companyId,
          uploaderId,
        },
        ctx: { db: tx, requestIp, userAgent, user },
      });
    });

    return data;
  });
