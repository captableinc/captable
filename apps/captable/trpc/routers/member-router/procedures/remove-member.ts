import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { withAuth, type withAuthTrpcContextType } from "@/trpc/api/trpc";
import {
  type TypeZodRemoveMemberMutationSchema,
  ZodRemoveMemberMutationSchema,
} from "@/trpc/routers/member-router/schema";
import {
  type DB,
  type DBTransaction,
  and,
  companies,
  eq,
  members,
  users,
} from "@captable/db";

export const removeMemberProcedure = withAuth
  .input(ZodRemoveMemberMutationSchema)
  .mutation(async (args) => {
    const data = await args.ctx.db.transaction(async (tx) => {
      const data = await removeMemberHandler({
        ...args,
        ctx: { ...args.ctx, db: tx },
      });

      return data;
    });

    return data;
  });

interface removeMemberHandlerOptions {
  input: TypeZodRemoveMemberMutationSchema;
  ctx: Omit<withAuthTrpcContextType, "db"> & {
    db: DB | DBTransaction;
  };
}

export async function removeMemberHandler({
  ctx: { db, session, requestIp, userAgent },
  input,
}: removeMemberHandlerOptions) {
  const user = session.user;
  const { memberId } = input;

  const { companyId } = await checkMembership({ session, tx: db });

  // First, get the member data with joins before deleting
  const [memberData] = await db
    .select({
      userId: members.userId,
      user: {
        name: users.name,
      },
      company: {
        name: companies.name,
      },
    })
    .from(members)
    .innerJoin(users, eq(members.userId, users.id))
    .innerJoin(companies, eq(members.companyId, companies.id))
    .where(and(eq(members.id, memberId), eq(members.companyId, companyId)))
    .limit(1);

  if (!memberData) {
    throw new Error("Member not found");
  }

  // Then delete the member
  await db
    .delete(members)
    .where(and(eq(members.id, memberId), eq(members.companyId, companyId)));

  const member = memberData;

  await Audit.create(
    {
      action: "member.removed",
      companyId,
      actor: { type: "user", id: user.id },
      context: {
        requestIp: requestIp || "",
        userAgent,
      },
      target: [{ type: "user", id: member.userId }],
      summary: `${user.name} removed ${member.user?.name} from ${member?.company?.name}`,
    },
    db,
  );

  return { success: true };
}
