import { type withAuthTrpcContextType, withAuth } from "@/trpc/api/trpc";
import { Audit } from "@/server/audit";
import { type Prisma } from "@prisma/client";
import {
  type TypeZodDeleteOptionMutationSchema,
  ZodDeleteOptionMutationSchema,
} from "../schema";

export const deleteOptionProcedure = withAuth
  .input(ZodDeleteOptionMutationSchema)
  .mutation(async (args) => {
    return await deleteOptionHandler(args);
  });

interface deleteOptionHandlerOptions {
  input: TypeZodDeleteOptionMutationSchema;
  ctx: withAuthTrpcContextType;
}

export async function deleteOptionHandler({
  ctx: { db, session, requestIp, userAgent },
  input,
}: deleteOptionHandlerOptions) {
  const user = session.user;
  const { optionId } = input;
  try {
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      const option = await tx.option.delete({
        where: {
          id: optionId,
          companyId: session.user.companyId,
        },
        select: {
          id: true,
          stakeholder: {
            select: {
              id: true,
              name: true,
            },
          },
          company: {
            select: {
              name: true,
            },
          },
        },
      });

      await Audit.create(
        {
          action: "option.deleted",
          companyId: user.companyId,
          actor: { type: "user", id: session.user.id },
          context: {
            requestIp,
            userAgent,
          },
          target: [{ type: "option", id: option.id }],
          summary: `${user.name} deleted stock option of stakholder ${option.stakeholder.name}`,
        },
        tx,
      );
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Oops, something went wrong while deleting option.",
    };
  }
}
