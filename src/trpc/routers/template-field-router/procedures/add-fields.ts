/* eslint-disable @typescript-eslint/prefer-for-of */
import { withAuth } from "@/trpc/api/trpc";
import { ZodAddFieldMutationSchema } from "../schema";

import EsignEmail from "@/emails/EsignEmail";
import { env } from "@/env";
import { sendMail } from "@/server/mailer";
import { SignJWT, jwtVerify } from "jose";
import { render } from "jsx-email";
import { z } from "zod";

interface SendEmailOptions {
  email: string;
  token: string;
}

const emailTokenPayloadSchema = z.object({
  id: z.string(),
  rec: z.string(),
});

type TEmailTokenPayloadSchema = z.infer<typeof emailTokenPayloadSchema>;

interface EncodeEmailTokenOption {
  templateId: string;
  recipientId: string;
}

const secret = new TextEncoder().encode(env.NEXTAUTH_SECRET);

export function EncodeEmailToken({
  recipientId,
  templateId,
}: EncodeEmailTokenOption) {
  const encodeToken: TEmailTokenPayloadSchema = {
    rec: recipientId,
    id: templateId,
  };

  return new SignJWT(encodeToken)
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);
}

export async function DecodeEmailToken(jwt: string) {
  const { payload } = await jwtVerify(jwt, secret);

  return emailTokenPayloadSchema.parse(payload);
}

export async function SendEsignEmail({ email, token }: SendEmailOptions) {
  const baseUrl = env.NEXTAUTH_URL;
  const html = await render(
    EsignEmail({
      signingLink: `${baseUrl}/documents/esign/${token}`,
    }),
  );
  await sendMail({
    to: email,
    subject: "esign Link",
    html,
  });
}

export const addFieldProcedure = withAuth
  .input(ZodAddFieldMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;

    const mails: Promise<void>[] = [];

    await ctx.db.$transaction(async (tx) => {
      const template = await tx.template.findFirstOrThrow({
        where: {
          publicId: input.templatePublicId,
          companyId: user.companyId,
          status: "DRAFT",
        },
        select: {
          id: true,
          orderedDelivery: true,
        },
      });
      await tx.templateField.deleteMany({
        where: {
          templateId: template.id,
        },
      });

      const recipientList = await tx.esignRecipient.findMany({
        where: {
          templateId: template.id,
        },
        select: {
          id: true,
          email: true,
        },
      });

      const fieldsList = [];

      for (let index = 0; index < input.data.length; index++) {
        const field = input.data[index];

        if (field) {
          fieldsList.push({ ...field, templateId: template.id });
        }
      }

      await tx.templateField.createMany({
        data: fieldsList,
      });

      await tx.template.update({
        where: {
          id: template.id,
        },
        data: {
          status: input.status,
        },
      });

      if (input.status === "COMPLETE") {
        for (let index = 0; index < recipientList.length; index++) {
          const recipient = recipientList[index];

          if (!recipient) {
            throw new Error("not found");
          }

          const token = await EncodeEmailToken({
            recipientId: recipient.id,
            templateId: template.id,
          });

          const email = recipient.email;

          mails.push(SendEsignEmail({ token, email }));

          if (template.orderedDelivery) {
            break;
          }
        }
      }
    });

    return {};
  });
