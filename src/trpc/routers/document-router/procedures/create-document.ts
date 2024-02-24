import { withAuth, type withAuthTrpcContextType } from "@/trpc/api/trpc";
import {
  type TypeZodCreateDocumentMutationSchema,
  ZodCreateDocumentMutationSchema,
} from "../schema";
import { generatePublicId } from "@/common/id";

interface createDocumentHandlerOptions {
  input: TypeZodCreateDocumentMutationSchema;
  ctx: withAuthTrpcContextType;
}

export const createDocumentHandler = async ({
  ctx,
  input,
}: createDocumentHandlerOptions) => {
  const user = ctx.session.user;
  const publicId = generatePublicId();

  const document = await ctx.db.document.create({
    data: {
      companyId: user.companyId,
      uploaderId: user.memberId,
      publicId,
      ...input,
    },
  });

  return document;
};

export const createDocumentProcedure = withAuth
  .input(ZodCreateDocumentMutationSchema)
  .mutation(async (opts) => {
    return createDocumentHandler(opts);
  });
