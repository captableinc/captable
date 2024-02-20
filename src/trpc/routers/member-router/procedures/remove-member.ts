import { type withAuthTrpcContextType, withAuth } from "@/trpc/api/trpc";
import {
  type TypeZodRemoveMemberMutationSchema,
  ZodRemoveMemberMutationSchema,
} from "../schema";
import { Audit } from "@/server/audit";
import { type Prisma } from "@prisma/client";

export const removeMemberProcedure = withAuth
  .input(ZodRemoveMemberMutationSchema)
  .mutation(async (args) => {
    return await removeMemberHandler(args);
  });

interface removeMemberHandlerOptions {
  input: TypeZodRemoveMemberMutationSchema;
  ctx: withAuthTrpcContextType;
}

export async function removeMemberHandler({
  ctx: { db, session, requestIp, userAgent },
  input,
}: removeMemberHandlerOptions) {
  const user = session.user;
  const { memberId } = input;

  await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const member = await tx.member.delete({
      where: {
        id: memberId,
        companyId: session.user.companyId,
      },
      select: {
        userId: true,
        user: {
          select: {
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
        action: "member.removed",
        companyId: user.companyId,
        actor: { type: "user", id: user.id },
        context: {
          requestIp,
          userAgent,
        },
        target: [{ type: "user", id: member.userId }],
        summary: `${user.name} removed ${member.user?.name} from ${member?.company?.name}`,
      },
      tx,
    );
  });

  return { success: true };
}
