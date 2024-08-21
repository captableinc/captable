import MemberInviteEmail from "@/emails/MemberInviteEmail";
import { env } from "@/env";
import { constants } from "@/lib/constants";
import { sendMail } from "@/server/mailer";
import { renderAsync } from "@react-email/components";
import { z } from "zod";
import { defineJob, defineWorker, defineWorkerConfig } from "../lib/queue";

const config = defineWorkerConfig({
  name: "email.member-invite",
  schema: z.object({
    email: z.string(),
    passwordResetToken: z.string(),
    user: z.object({
      email: z.string().email().nullish(),
      name: z.string().nullish(),
    }),
    verificationToken: z.string(),
    company: z.object({
      name: z.string(),
      id: z.string(),
    }),
  }),
});

export const sendMemberInviteEmailJob = defineJob(config);
export const sendMemberInviteEmailWorker = defineWorker(config, async (job) => {
  const { email, passwordResetToken, verificationToken, company, user } =
    job.data;

  const baseUrl = env.NEXT_PUBLIC_BASE_URL;

  const params = new URLSearchParams({
    passwordResetToken,
    email,
  });

  const inviteLink = `${baseUrl}/verify-member/${verificationToken}?${params.toString()}`;
  console.log("sending invite email to", email, ": ", inviteLink);

  await sendMail({
    to: email,
    subject: `Join ${company.name} on ${constants.title}`,
    html: await renderAsync(
      MemberInviteEmail({
        inviteLink,
        companyName: company.name,
        invitedBy: `${user.name || user.email}`,
      }),
    ),
  });
});
