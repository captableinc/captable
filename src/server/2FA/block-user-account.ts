import { SendUserAccountBlockedEmail } from "@/jobs/user-account-blocked-email";
import { db } from "@/server/db";
import type { User } from "@prisma/client";

type BlockUser = {
  user: User;
  companyName: string;
  cause: string;
};

export const BlockUserAccount = async ({
  user,
  companyName,
  cause,
}: BlockUser) => {
  const blockedUser = await db.blockedUser.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      cause,
    },
  });

  //@TODO( Audit for userAccount.blocked)

  await SendUserAccountBlockedEmail({
    email: user.email as string,
    userName: user.name as string,
    companyName,
  });

  return blockedUser;
};
