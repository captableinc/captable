import { generatePublicId } from "@/common/id";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import type { TPrismaOrTransaction } from "@/server/db";
import { withAuth, type withAuthTrpcContextType } from "@/trpc/api/trpc";
import {
  type TypeZodCreateDocumentMutationSchema,
  ZodCreateDocumentMutationSchema,
} from "../schema";

interface createDocumentHandlerOptions
  extends Pick<withAuthTrpcContextType, "requestIp" | "userAgent"> {
  input: TypeZodCreateDocumentMutationSchema;
  companyId: string;
  uploaderName?: string | null | undefined;
  uploaderId?: string;
  db: TPrismaOrTransaction;
}

export const createDocumentHandler = async ({
  db,
  requestIp,
  userAgent,
  input,
  companyId,
  uploaderName,
  uploaderId,
}: createDocumentHandlerOptions) => {
  const bulkDocuments = input.map((doc) => ({
    ...doc,
    companyId,
    uploaderId,
    publicId: generatePublicId(),
  }));

  const returnedDocuments = await db.document.createManyAndReturn({
    data: bulkDocuments,
    select: { id: true },
  });

  const allDocIds = returnedDocuments.map(({ id }) => id);
  let finalAuditId: string;

  if (allDocIds.length > 1) {
    finalAuditId = allDocIds.join("-");
  } else {
    finalAuditId = allDocIds[0] as string;
  }

  await Audit.create(
    {
      companyId,
      action: "document.created",
      actor: { type: "user", id: "" },
      context: {
        requestIp,
        userAgent,
      },
      target: [{ type: "document", id: finalAuditId }],
      summary: `${uploaderName} uploaded ${bulkDocuments.length} document(s).`,
    },
    db,
  );

  return returnedDocuments;
};

export const createDocumentProcedure = withAuth
  .input(ZodCreateDocumentMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;
    const { userAgent, requestIp, db, session } = ctx;

    const data = await db.$transaction(async (tx) => {
      const { companyId, memberId } = await checkMembership({ session, tx });

      const data = await createDocumentHandler({
        input,
        userAgent,
        requestIp,
        db: tx,
        companyId,
        uploaderName: user?.name,
        uploaderId: memberId,
      });

      return data;
    });

    return data;
  });
