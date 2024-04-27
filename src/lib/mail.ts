import { render } from "jsx-email";
import AccountVerificationEmail from "@/emails/AccountVerificationEmail";
import PasswordResetEmail from "@/emails/PasswordResetEmail";
import { sendMail } from "@/server/mailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  const baseUrl = process.env.NEXTAUTH_URL;
  const confirmLink = `${baseUrl}/verify-email/${token}`;

  const html = await render(
    AccountVerificationEmail({
      verifyLink: confirmLink,
    }),
  );

  await sendMail({
    to: email,
    subject: "Confirm your email",
    html,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const baseUrl = process.env.NEXTAUTH_URL;
  const confirmLink = `${baseUrl}/reset-password/${token}`;

  const html = await render(
    PasswordResetEmail({
      resetLink: confirmLink,
    }),
  );

  await sendMail({
    to: email,
    subject: "Reset your password",
    html,
  });
};
