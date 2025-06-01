import { generatePublicId } from "@/lib/common/id";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import {
  type TypeZodCreateTemplateMutationSchema,
  ZodCreateTemplateMutationSchema,
} from "@/trpc/routers/template-router/schema";
import {
  type DB,
  type DBTransaction,
  esignRecipients,
  templates,
} from "@captable/db";

interface CreateTemplateHandlerProps {
  ctx: {
    db: DB | DBTransaction;
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
  const [template] = await db
    .insert(templates)
    .values({
      status: "DRAFT",
      publicId,
      updatedAt: new Date(),
      ...rest,
    })
    .returning({
      id: templates.id,
      publicId: templates.publicId,
      name: templates.name,
    });

  if (!template) {
    throw new Error("Failed to create template");
  }

  await Audit.create(
    {
      action: "template.created",
      companyId: user.companyId,
      actor: { type: "user", id: user.id },
      context: {
        userAgent,
        requestIp: requestIp || "",
      },
      target: [{ type: "template", id: template.id }],
      summary: `${user.name} added templateField for template ID ${template.id}`,
    },
    db,
  );

  await db.insert(esignRecipients).values(
    recipients.map((recipient) => ({
      ...recipient,
      templateId: template.id,
      updatedAt: new Date(),
    })),
  );

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

    const data = await ctx.db.transaction(async (tx) => {
      const { companyId, memberId } = await checkMembership({
        tx,
        session: ctx.session,
      });

      return await createTemplateHandler({
        input: {
          ...input,
          companyId,
          uploaderId: memberId as string,
        },
        ctx: { db: tx, requestIp: requestIp || "", userAgent, user },
      });
    });

    return data;
  });
