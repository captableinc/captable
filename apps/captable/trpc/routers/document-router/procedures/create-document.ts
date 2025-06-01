import { generatePublicId } from "@/lib/common/id";
import { Audit } from "@/server/audit";
import {
  withAccessControl,
  type withAuthTrpcContextType,
} from "@/trpc/api/trpc";
import { type DB, type DBTransaction, db, documents } from "@captable/db";
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
  db: DB | DBTransaction;
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
  const publicId = generatePublicId();

  const [document] = await db
    .insert(documents)
    .values({
      companyId,
      uploaderId,
      publicId,
      updatedAt: new Date(),
      ...input,
    })
    .returning();

  if (!document) {
    throw new Error("Failed to create document");
  }

  await Audit.create(
    {
      companyId,
      action: "document.created",
      actor: { type: "user", id: "" },
      context: {
        requestIp: requestIp || "",
        userAgent,
      },
      target: [{ type: "document", id: document.id }],
      summary: `${uploaderName} uploaded a document: ${document.name}`,
    },
    db,
  );

  return document;
};

export const createDocumentProcedure = withAccessControl
  .input(ZodCreateDocumentMutationSchema)
  .meta({ policies: { documents: { allow: ["create"] } } })
  .mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;
    const {
      userAgent,
      requestIp,
      db,
      membership: { companyId, memberId },
    } = ctx;

    const data = await db.transaction(async (tx) => {
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
