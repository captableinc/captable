import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import { withAuth, type withAuthTrpcContextType } from "@/trpc/api/trpc";
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
    await ctx.db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      const documentShare = await ctx.db.documentShare.create({
        data: {
          ...rest,
          recipients: recipients ? [recipients] : [],
        },
      });

      await Audit.create(
        {
          companyId,
          action: "documentShare.created",
          actor: { type: "user", id: user.id },
          context: {
            requestIp,
            userAgent,
          },
          target: [{ type: "documentShare", id: documentShare.id }],
          summary: `${user.name} created a document share: ${documentShare.link}`,
        },
        tx,
      );
    });

    return { success: true, message: "Document share created successfully." };
  } catch (err) {
    console.log("err here ====>", err);
    return {
      success: false,
      message: "Oops, something went wrong. Please try again later.",
    };
  }
};

export const createDocumentShareProcedure = withAuth
  .input(DocumentShareMutationSchema)
  .mutation(async (opts) => {
    return createDocumentShareHandler(opts);
  });
