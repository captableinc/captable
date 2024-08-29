import { generatePublicId } from "@/common/id";
import type { TPrismaOrTransaction } from "@/server/db";
import type { Context } from "hono";

interface TCreateDocumentHandlerOptions {
  c: Context;
  db: TPrismaOrTransaction;
  input: {
    name: string;
    bucketId: string;
    convertibleNoteId?: string;
  };
}

export async function createDocumentHandler({
  c,
  db,
  input,
}: TCreateDocumentHandlerOptions) {
  const { audit, client } = c.get("services");
  const { membership } = c.get("session");

  const publicId = generatePublicId();

  const document = await db.document.create({
    data: {
      companyId: membership.companyId,
      uploaderId: membership.memberId,
      publicId,
      ...input,
    },
  });

  await audit.create(
    {
      companyId: membership.companyId,
      action: "document.created",
      actor: { type: "user", id: membership.userId },
      context: client,
      target: [{ type: "document", id: document.id }],
      summary: `${membership.user.name} uploaded a document: ${document.name}`,
    },
    db,
  );

  return document;
}
