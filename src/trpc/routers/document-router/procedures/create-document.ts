import { withAuth, type withAuthTrpcContextType } from "@/trpc/api/trpc";
import {
  type TypeZodCreateDocumentMutationSchema,
  ZodCreateDocumentMutationSchema,
} from "../schema";
import { generatePublicId } from "@/common/id";
import { Audit } from "@/server/audit";

interface createDocumentHandlerOptions {
  input: TypeZodCreateDocumentMutationSchema;
  ctx: withAuthTrpcContextType;
}

export const createDocumentHandler = async ({
  ctx,
  input,
}: createDocumentHandlerOptions) => {
  const user = ctx.session.user;
  const { userAgent, requestIp } = ctx;
  const companyId = user.companyId;
  const publicId = generatePublicId();

  const { document } = await ctx.db.$transaction(async (tx) => {
    const document = await ctx.db.document.create({
      data: {
        companyId: user.companyId,
        uploaderId: user.memberId,
        publicId,
        ...input,
      },
    });

    await Audit.create(
      {
        companyId,
        action: "document.created",
        actor: { type: "user", id: user.id },
        context: {
          requestIp,
          userAgent,
        },
        target: [{ type: "document", id: document.id }],
        summary: `${user.name} uploaded a document: ${document.name}`,
      },
      tx,
    );

    return { document };
  });

  return document;
};

export const createDocumentProcedure = withAuth
  .input(ZodCreateDocumentMutationSchema)
  .mutation(async (opts) => {
    return createDocumentHandler(opts);
  });
