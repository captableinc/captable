import { Audit } from "@/server/audit";
import { withAuth } from "@/trpc/api/trpc";
import { ZodCreateDocumentMutationSchema } from "../schema";
import { generatePublicId } from "@/common/id";

export const createDocumentProcedure = withAuth
  .input(ZodCreateDocumentMutationSchema)
  .mutation(async ({ ctx, input }) => {
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
  });
