import { withAuth } from "@/trpc/api/trpc";
import { and, db, eq, members, users } from "@captable/db";
import { TRPCError } from "@trpc/server";

export const getProfileProcedure = withAuth.query(async ({ ctx }) => {
  const {
    session: { user },
  } = ctx;

  const memberDataResult = await db
    .select({
      title: members.title,
      workEmail: members.workEmail,
      userName: users.name,
      userEmail: users.email,
      userImage: users.image,
    })
    .from(members)
    .innerJoin(users, eq(members.userId, users.id))
    .where(
      and(eq(members.id, user.memberId), eq(members.companyId, user.companyId)),
    )
    .limit(1);

  const memberData = memberDataResult[0];

  if (!memberData?.userName || !memberData.userEmail) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Something went wrong.",
    });
  }

  const { userName: name, userEmail: email, userImage: image } = memberData;
  const { title, workEmail } = memberData;

  const payload = {
    fullName: name ?? "",
    jobTitle: title ?? "",
    loginEmail: email ?? "",
    workEmail: workEmail ?? "",
    avatarUrl: image ?? "",
  };

  return payload;
});
