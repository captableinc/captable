import { withAuth } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";

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
      company: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
  });

  if (!memberData?.user.name || !memberData.user.email) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Something went wrong.",
    });
  }

  const { name, email, image } = memberData.user ?? {};

  const { title, workEmail } = memberData ?? {};

  const payload = {
    fullName: name ?? "",
    jobTitle: title ?? "",
    loginEmail: email ?? "",
    workEmail: workEmail ?? "",
    avatarUrl: image ?? "",
    companyName: memberData.company.name,
    companyLogo: memberData.company.logo,
  };

  return payload;
});
