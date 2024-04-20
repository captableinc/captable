import { nanoid } from "nanoid";

import { db } from "@/server/db";
import { getVerificationTokenByEmail } from "@/server/verification-token";
import { getPasswordResetokenByEmail } from "@/server/password-reset-token";

export const generateVerificationToken = async (email: string) => {
  const token = nanoid(32);
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = nanoid(32);
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
