import { checkMembership } from "@/server/member";
import { withAccessControl } from "@/trpc/api/trpc";
import { asc, db, eq, members, users } from "@captable/db";

export const getMembersProcedure = withAccessControl
  .meta({ policies: { members: { allow: ["read"] } } })
  .query(async ({ ctx }) => {
    const {
      membership: { companyId },
    } = ctx;

    const rawData = await db
      .select({
        id: members.id,
        title: members.title,
        status: members.status,
        role: members.role,
        isOnboarded: members.isOnboarded,
        lastAccessed: members.lastAccessed,
        workEmail: members.workEmail,
        companyId: members.companyId,
        userId: members.userId,
        customRoleId: members.customRoleId,
        createdAt: members.createdAt,
        updatedAt: members.updatedAt,
        userName: users.name,
        userEmail: users.email,
        userImage: users.image,
      })
      .from(members)
      .leftJoin(users, eq(members.userId, users.id))
      .where(eq(members.companyId, companyId))
      .orderBy(asc(users.name));

    const data = rawData.map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      role: row.role,
      isOnboarded: row.isOnboarded,
      lastAccessed: row.lastAccessed,
      workEmail: row.workEmail,
      companyId: row.companyId,
      userId: row.userId,
      customRoleId: row.customRoleId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      user: {
        name: row.userName,
        email: row.userEmail,
        image: row.userImage,
      },
    }));

    return { data };
  });
