import { generatePublicId } from "@/common/id";
import { NEXT_PUBLIC_BASE_URL } from "@/constants/env";
import {
  type DataRoomEmailPayloadType,
  ShareDataRoomEmailJob,
} from "@/jobs/share-data-room-email";
import { encode } from "@/lib/jwt";
import { ShareRecipientSchema } from "@/schema/contacts";
import { checkMembership } from "@/server/auth";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import type { DataRoom } from "@prisma/client";
import { z } from "zod";
import { DataRoomSchema } from "./schema";

export const dataRoomRouter = createTRPCRouter({
  getDataRoom: withAuth
    .input(
      z.object({
        dataRoomPublicId: z.string(),
        include: z.object({
          company: z.boolean().optional().default(false),
          documents: z.boolean().optional().default(false),
          recipients: z.boolean().optional().default(false),
        }),
      }),
    )
    .query(async ({ ctx, input }) => {
      const response = {
        dataRoom: {},
        documents: [],
        recipients: [],
        company: {},
      } as {
        dataRoom: object;
        documents: object[];
        recipients: object[];
        company: object;
      };

      const { db, session } = ctx;
      const { dataRoomPublicId, include } = input;

      const { dataRoom } = await db.$transaction(async (tx) => {
        const { companyId } = await checkMembership({ session, tx });

        const dataRoom = await tx.dataRoom.findUniqueOrThrow({
          where: {
            publicId: dataRoomPublicId,
            companyId,
          },
          include: {
            documents: include.documents,
            company: include.company,
            recipients: include.recipients,
          },
        });

        response.dataRoom = dataRoom;

        if (include.documents) {
          const documentIds = dataRoom.documents.map((doc) => doc.id);

          const dataRoomDocument = await tx.dataRoomDocument.findMany({
            where: {
              id: { in: documentIds },
            },

            include: {
              document: {
                select: {
                  id: true,
                  bucket: true,
                },
              },
            },
          });

          response.documents = dataRoomDocument.map((doc) => ({
            id: doc.document.bucket.id,
            name: doc.document.bucket.name,
            key: doc.document.bucket.key,
            mimeType: doc.document.bucket.mimeType,
            size: doc.document.bucket.size,
            createdAt: doc.document.bucket.createdAt,
            updatedAt: doc.document.bucket.updatedAt,
          }));
        }

        if (include.recipients) {
          response.recipients = await Promise.all(
            dataRoom.recipients.map(async (recipient) => ({
              ...recipient,
              token: await encode({
                companyId,
                dataRoomId: dataRoom.id,
                recipientId: recipient.id,
              }),
            })),
          );
        }

        return { dataRoom };
      });

      if (include.company) {
        response.company = dataRoom.company;
      }

      return response;
    }),

  save: withAuth.input(DataRoomSchema).mutation(async ({ ctx, input }) => {
    try {
      let room = {} as DataRoom;
      const { db, session } = ctx;

      const { publicId } = input;

      await db.$transaction(async (tx) => {
        const { companyId } = await checkMembership({ tx, session });

        if (!publicId) {
          room = await tx.dataRoom.create({
            data: {
              name: input.name,
              companyId,
              publicId: generatePublicId(),
            },
          });
        } else {
          room = await tx.dataRoom.update({
            where: {
              publicId,
            },
            data: {
              name: input.name,
            },
          });

          const { documents, recipients } = input;

          if (documents) {
            await tx.dataRoomDocument.createMany({
              data: documents.map((document) => ({
                dataRoomId: room.id,
                documentId: document.documentId,
              })),
            });
          }

          if (recipients) {
            await tx.dataRoomRecipient.createMany({
              data: recipients.map((recipient) => ({
                dataRoomId: room.id,
                email: recipient.email,
                memberId: recipient.memberId,
                stakeholderId: recipient.stakeholderId,
                expiresAt: recipient.expiresAt,
              })),
            });
          }
        }
      });

      return {
        success: true,
        message: "Successfully updated data room",
        data: room,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message:
          "Oops, something went wrong while saving data room. Please try again.",
      };
    }
  }),

  share: withAuth
    .input(
      z.object({
        dataRoomId: z.string(),
        others: z.array(ShareRecipientSchema),
        selectedContacts: z.array(ShareRecipientSchema),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;
      const { dataRoomId, others, selectedContacts } = input;
      const { name: senderName, email: senderEmail, companyId } = session.user;

      const dataRoom = await db.dataRoom.findUniqueOrThrow({
        where: {
          id: dataRoomId,
          companyId,
        },

        include: {
          company: true,
        },
      });

      if (!dataRoom) {
        throw new Error("Data room not found");
      }

      const company = dataRoom.company;

      const upsertManyRecipients = async () => {
        const baseUrl = NEXT_PUBLIC_BASE_URL();
        const recipients = [...others, ...selectedContacts];

        for (const recipient of recipients) {
          const email = (recipient.email || recipient.value).trim();
          if (!email) {
            throw new Error("Email is required");
          }

          const memberOrStakeholderId =
            recipient.type === "member"
              ? { memberId: recipient.id }
              : recipient.type === "stakeholder"
                ? { stakeholderId: recipient.id }
                : {};

          const recipientRecord = await db.dataRoomRecipient.upsert({
            where: {
              dataRoomId_email: {
                dataRoomId,
                email,
              },
            },
            create: {
              dataRoomId,
              name: recipient.name,
              email,
              ...memberOrStakeholderId,
            },
            update: {
              name: recipient.name,
              ...memberOrStakeholderId,
            },
          });

          const token = await encode({
            companyId,
            dataRoomId,
            recipientId: recipientRecord.id,
          });

          const link = `${baseUrl}/data-rooms/${dataRoom.publicId}?token=${token}`;

          const payload: DataRoomEmailPayloadType = {
            senderName: `${senderName}`,
            recipientName: recipient.name,
            companyName: company.name,
            dataRoom: dataRoom.name,
            link,
            email,
            senderEmail,
          };

          await new ShareDataRoomEmailJob().emit(payload);
        }
      };

      await upsertManyRecipients();

      return {
        success: true,
        message: "Data room successfully shared!",
      };
    }),

  unShare: withAuth
    .input(
      z.object({
        dataRoomId: z.string(),
        recipientId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;
      const { dataRoomId, recipientId } = input;
      const companyId = session.user.companyId;

      const dataRoom = await db.dataRoom.findUniqueOrThrow({
        where: {
          id: dataRoomId,
          companyId,
        },
      });

      if (!dataRoom) {
        throw new Error("Data room not found");
      }

      await db.dataRoomRecipient.delete({
        where: {
          id: recipientId,
          dataRoomId,
        },
      });

      return {
        success: true,
        message: "Successfully removed access to data room!",
      };
    }),
});
