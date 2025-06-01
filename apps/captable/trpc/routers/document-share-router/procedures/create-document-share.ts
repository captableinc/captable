import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { withAuth, type withAuthTrpcContextType } from "@/trpc/api/trpc";
import { db, documentShares } from "@captable/db";
import {
  DocumentShareMutationSchema,
  type TypeDocumentShareMutation,
} from "../schema";

interface CreateDocumentShareHandlerOptions {
  input: TypeDocumentShareMutation;
  ctx: withAuthTrpcContextType;
}

export const createDocumentShareHandler = async ({
  ctx,
  input,
}: CreateDocumentShareHandlerOptions) => {
  const user = ctx.session.user;
  const { userAgent, requestIp, session } = ctx;

  const { recipients, ...rest } = input;

  try {
    await db.transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      const [documentShare] = await tx
        .insert(documentShares)
        .values({
          ...rest,
          recipients: recipients ? [recipients] : [],
          updatedAt: new Date(),
        })
        .returning();

      if (!documentShare) {
        throw new Error("Failed to create document share");
      }

      await Audit.create(
        {
          companyId,
          action: "documentShare.created",
          actor: { type: "user", id: user.id },
          context: {
            requestIp: requestIp || "",
            userAgent,
          },
          target: [{ type: "documentShare", id: documentShare.id }],
          summary: `${user.name} created a document share: ${documentShare.link}`,
        },
        tx,
      );
    });

    return { success: true, message: "Document share created successfully." };
  } catch (_err) {
    return {
      success: false,
      message: "Oops, something went wrong. Please try again later.",
    };
  }
};

export const createDocumentShareProcedure = withAuth
  .input(DocumentShareMutationSchema)
  .mutation((opts) => {
    return createDocumentShareHandler(opts);
  });
