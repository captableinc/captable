import { withAuth } from "@/trpc/api/trpc";

export const getProfileProcedure = withAuth.query(async ({ ctx }) => {
  const {
    db,
    session: { user },
  } = ctx;

  const memberData = await db.member.findUnique({
    where: {
      id: user.memberId,
    },
    select: {
      title: true,
      workEmail: true,
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  const { name = "", email = "", image = "" } = memberData?.user ?? {};

  const { title = "", workEmail = "" } = memberData ?? {};

  const payload = {
    fullName: name,
    jobTitle: title,
    loginEmail: email,
    workEmail: workEmail,
    avatarUrl: image,
  };

  return payload;
});
