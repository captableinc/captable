import { withoutAuth } from "@/trpc/api/trpc";
import { z } from "zod";

export const getSigningFieldProcedure = withoutAuth
  .input(z.object({ token: z.string() }))
  .query(async ({ ctx, input }) => {
    const token = await ctx.db.safeSigningToken.findFirstOrThrow({
      where: {
        token: input.token,
      },
      select: {
        signerMember: {
          select: {
            fields: true,
            safe: {
              select: {
                id: true,
              },
            },
          },
        },
        signerStakeholder: {
          select: {
            fields: true,
            safe: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (token.signerMember?.fields && token.signerMember?.safe) {
      return {
        fields: token.signerMember.fields,
        safeId: token.signerMember.safe.id,
      };
    }

    if (token.signerStakeholder?.fields && token.signerStakeholder?.safe) {
      return {
        fields: token.signerStakeholder.fields,
        safeId: token.signerStakeholder.safe.id,
      };
    }

    throw new Error("Fields not found");
  });
