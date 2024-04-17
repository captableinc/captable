import { generatePublicId } from "@/common/id";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import type {
  DataRoom,
  DataRoomDocument,
  DataRoomRecipient,
} from "@prisma/client";
import { z } from "zod";
import { DataRoomSchema } from "./schema";

export const dataRoomRouter = createTRPCRouter({
  getDataRoom: withAuth
    .input(
      z.object({
        dataRoomPublicId: z.string(),
        getRecipients: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const user = session.user;
      const companyId = user.companyId;
      const { dataRoomPublicId, getRecipients } = input;

      const dataRoom = await db.dataRoom.findUniqueOrThrow({
        where: {
          publicId: dataRoomPublicId,
          companyId,
        },

        include: {
          documents: true,

          ...(getRecipients && { recipients: true }),
        },
      });

      const documentIds = dataRoom.documents.map((doc) => doc.id);

      const documents: DataRoomDocument[] = await db.dataRoomDocument.findMany({
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

      if (getRecipients) {
        const recipientIds = dataRoom.recipients.map(
          (recipient) => recipient.id,
        );

        const recipients: DataRoomRecipient[] =
          await db.dataRoomRecipient.findMany({
            where: {
              id: { in: recipientIds },
            },

            include: {
              member: {
                select: {
                  id: true,
                  workEmail: true,
                },
              },

              stakeholder: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          });

        return {
          dataRoom,
          documents,
          recipients,
        };
      } else {
        return {
          dataRoom,
          documents,
        };
      }
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
