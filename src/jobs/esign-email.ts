import EsignEmail from "@/emails/EsignEmail";
import { env } from "@/env";
import { sendMail } from "@/server/mailer";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { render } from "jsx-email";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  token: z.string(),
});

type TSchema = z.infer<typeof schema>;

export const sendEsignEmail = async (payload: TSchema) => {
  const { email, token } = payload;
  const baseUrl = env.BASE_URL;
  const html = await render(
    EsignEmail({
      signingLink: `${baseUrl}/esign/${token}`,
    }),
  );
  await sendMail({
    to: email,
    subject: "esign Link",
    html,
  });
};

client.defineJob({
  id: "esigning-email",
  name: "send esigning email link",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "email.esign",
    schema,
  }),

  run: async (payload) => {
    await sendEsignEmail(payload);
  },
});
