import { UpdateStatusEnum } from "@/prisma-enums";
import { Audit } from "@/server/audit";
import { type withAuthTrpcContextType, withAuth } from "@/trpc/api/trpc";
import { type Prisma } from "@prisma/client";
import {
  type TypeToggleStatusMutationSchema,
  ZodToggleStatusMutationSchema,
} from "../schema";

export const toggleStatusProcedure = withAuth
  .input(ZodToggleStatusMutationSchema)
  .mutation(async (args) => {
    return await toggleStatusHandler(args);
  });

interface toggleStatusHandlerOptions {
  input: TypeToggleStatusMutationSchema;
  ctx: withAuthTrpcContextType;
}

export async function toggleStatusHandler({
  ctx: { db, session, requestIp, userAgent },
  input,
}: toggleStatusHandlerOptions) {
  try {
    console.log({ input });
    const { desireStatus, currentStatus, publicId } = input;
    const user = session.user;
    const companyId = session.user.companyId;
    const toggleToPublic = desireStatus === UpdateStatusEnum.PUBLIC;

    if (desireStatus === currentStatus) {
      return {
        success: false,
        message: "Please toggle the status.",
      };
    }
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.update.update({
        where: {
          publicId,
        },
        data: {
          status: toggleToPublic
            ? UpdateStatusEnum.PUBLIC
            : UpdateStatusEnum.PRIVATE,
        },
      });
      await Audit.create(
        {
          action: "update.updated",
          companyId: user.companyId,
          actor: { type: "user", id: session.user.id },
          context: {
            requestIp,
            userAgent,
          },
          target: [{ type: "company", id: companyId }],
          summary: `${user.name} toggled the update status.`,
        },
        tx,
      );
    });
    return {
      success: true,
      updatedStatus: desireStatus,
      message: `Successfully toggled the status to ${desireStatus.toLowerCase()}`,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: err,
      updatedStatus: "",
      message: "Oops, something went wrong while toggling status.",
    };
  }
}
