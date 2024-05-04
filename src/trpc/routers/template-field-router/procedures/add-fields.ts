/* eslint-disable @typescript-eslint/prefer-for-of */
import { withAuth } from "@/trpc/api/trpc";
import { ZodAddFieldMutationSchema } from "../schema";

import { sendEsignEmail } from "@/jobs";
import { decode, encode } from "@/lib/jwt";
import { checkMembership } from "@/server/auth";
import { getTriggerClient } from "@/trigger";
import { z } from "zod";

const emailTokenPayloadSchema = z.object({
  id: z.string(),
  rec: z.string(),
});

type TEmailTokenPayloadSchema = z.infer<typeof emailTokenPayloadSchema>;

interface EncodeEmailTokenOption {
  templateId: string;
  recipientId: string;
}

export function EncodeEmailToken({
  recipientId,
  templateId,
}: EncodeEmailTokenOption) {
  const encodeToken: TEmailTokenPayloadSchema = {
    rec: recipientId,
    id: templateId,
  };

  return encode(encodeToken);
}

export async function DecodeEmailToken(jwt: string) {
  const { payload } = await decode(jwt);
  return emailTokenPayloadSchema.parse(payload);
}

export const addFieldProcedure = withAuth
  .input(ZodAddFieldMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const triggerClient = getTriggerClient();

    const mails: { token: string; email: string }[] = [];

    await ctx.db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({
        tx,
        session: ctx.session,
      });

      const template = await tx.template.findFirstOrThrow({
        where: {
          publicId: input.templatePublicId,
          companyId,
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

          mails.push({ token, email });

          if (template.orderedDelivery) {
            break;
          }
        }
      }
    });

    if (mails.length) {
      if (triggerClient) {
        await triggerClient.sendEvents(
          mails.map((payload) => ({
            name: "email.esign",
            payload,
          })),
        );
      } else {
        await Promise.all(mails.map((payload) => sendEsignEmail(payload)));
      }
    }

    return {};
  });
