import { getPasswordResetTokenByEmail } from "@/server/password-reset-token";
import { getVerificationTokenByEmail } from "@/server/verification-token";
import { db, eq, passwordResetTokens, verificationTokens } from "@captable/db";
import { createId } from "@paralleldrive/cuid2";
import { nanoid } from "nanoid";

export const generateVerificationToken = async (email: string) => {
  const token = nanoid(32);
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id));
  }

  // [security] - TODO: double check if this is secure, especially the token
  const [verificationToken] = await db
    .insert(verificationTokens)
    .values({
      id: createId(),
      secondaryId: nanoid(32),
      identifier: email,
      token,
      expires,
    })
    .returning();

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = nanoid(32);
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));
  }

  // [security] - TODO: double check if this is secure, especially the token
  const [passwordResetToken] = await db
    .insert(passwordResetTokens)
    .values({
      id: createId(),
      email,
      token,
      expires,
    })
    .returning();

  return passwordResetToken;
};
