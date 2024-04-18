import { generatePublicId } from "@/common/id";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import type { Bucket, DataRoom, DataRoomDocument } from "@prisma/client";
import { z } from "zod";
import { DataRoomSchema } from "./schema";

import { type DataRoomRecipientType } from "@/types/documents/data-room";

interface DataRoomDocumentType extends DataRoomDocument {
  document: {
    id: string;
    bucket: Bucket;
  };
}

export const dataRoomRouter = createTRPCRouter({
  getDataRoom: withAuth
    .input(z.object({ dataRoomPublicId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const user = session.user;
      const companyId = user.companyId;
      const { dataRoomPublicId } = input;

      const dataRoom = await db.dataRoom.findUniqueOrThrow({
        where: {
          publicId: dataRoomPublicId,
          companyId,
        },

        include: {
          documents: true,
          recipients: true,
        },
      });

      const documentIds = dataRoom.documents.map((doc) => doc.id);

      const dataRoomDocument: DataRoomDocumentType[] =
        await db.dataRoomDocument.findMany({
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

      const documents = dataRoomDocument.map((doc) => ({
        id: doc.document.bucket.id,
        name: doc.document.bucket.name,
        key: doc.document.bucket.key,
        mimeType: doc.document.bucket.mimeType,
        size: doc.document.bucket.size,
        createdAt: doc.document.bucket.createdAt,
        updatedAt: doc.document.bucket.updatedAt,
      }));

      console.log("TYpe of documents", typeof documents);

      const recipientIds = dataRoom.recipients.map((recipient) => recipient.id);

      const dataRoomRecipient = await db.dataRoomRecipient.findMany({
        where: {
          id: { in: recipientIds },
        },

        include: {
          member: {
            select: {
              id: true,
              user: {
                select: {
                  email: true,
                  name: true,
                },
              },
            },
          },
          stakeholder: true,
        },
      });

      const recipients: DataRoomRecipientType[] = dataRoomRecipient.map(
        (recipient) => {
          const r = {
            id: recipient.id,
            email: recipient.email,
          } as DataRoomRecipientType;

          if (recipient.member && recipient.member.user) {
            r.member = {
              id: recipient.member.id,
              email: recipient.member.user.email ?? "",
              name: recipient.member.user.name ?? "",
            };
          }

          if (recipient.stakeholder) {
            r.stakeholder = {
              id: recipient.stakeholder.id,
              email: recipient.stakeholder.email,
              name: recipient.stakeholder.name,
              institutionName: recipient.stakeholder.institutionName ?? "",
            };
          }

          return r;
        },
      );

      return {
        dataRoom,
        documents,
        recipients,
      };
    }),

  save: withAuth.input(DataRoomSchema).mutation(async ({ ctx, input }) => {
    try {
      let room = {} as DataRoom;
      const { db, session } = ctx;
      const user = session.user;
      const { publicId } = input;

      if (!publicId) {
        room = await db.dataRoom.create({
          data: {
            name: input.name,
            companyId: user.companyId,
            publicId: generatePublicId(),
          },
        });
      } else {
        room = await db.dataRoom.update({
          where: {
            publicId,
          },
          data: {
            name: input.name,
          },
        });

        const { documents, recipients } = input;

        if (documents) {
          await db.dataRoomDocument.createMany({
            data: documents.map((document) => ({
              dataRoomId: room.id,
              documentId: document.documentId,
            })),
          });
        }

        if (recipients) {
          await db.dataRoomRecipient.createMany({
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

      return {
        success: true,
        message: "Successfully updated data room",
        data: room,
      };
    } catch (error) {
      console.error("Error saving dataroom:", error);
      return {
        success: false,
        message:
          "Oops, something went wrong while saving data room. Please try again.",
      };
    }
  }),
});
