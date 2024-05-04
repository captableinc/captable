import PasswordResetEmail from "@/emails/PasswordResetEmail";
import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const baseUrl = process.env.BASE_URL;
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
