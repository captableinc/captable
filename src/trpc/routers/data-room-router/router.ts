import { generatePublicId } from "@/common/id";
import { checkMembership } from "@/server/auth";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import type { DataRoom } from "@prisma/client";
import { z } from "zod";
import { DataRoomSchema } from "./schema";

export const dataRoomRouter = createTRPCRouter({
  getDataRoom: withAuth
    .input(z.object({ dataRoomPublicId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const { dataRoomPublicId } = input;

      const { dataRoomDocument, dataRoom } = await db.$transaction(
        async (tx) => {
          const { companyId } = await checkMembership({ session, tx });

          const dataRoom = await tx.dataRoom.findUniqueOrThrow({
            where: {
              publicId: dataRoomPublicId,
              companyId,
            },
            include: {
              documents: true,
              recipients: {
                include: {
                  member: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          email: true,
                          name: true,
                          image: true,
                        },
                      },
                    },
                  },
                  stakeholder: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      institutionName: true,
                    },
                  },
                },
              },
            },
          });

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
          return { dataRoomDocument, dataRoom };
        },
      );

      const documents = dataRoomDocument.map((doc) => ({
        id: doc.document.bucket.id,
        name: doc.document.bucket.name,
        key: doc.document.bucket.key,
        mimeType: doc.document.bucket.mimeType,
        size: doc.document.bucket.size,
        createdAt: doc.document.bucket.createdAt,
        updatedAt: doc.document.bucket.updatedAt,
      }));

      return {
        dataRoom,
        documents,
      };
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
      console.error("Error saving dataroom:", error);
      return {
        success: false,
        message:
          "Oops, something went wrong while saving data room. Please try again.",
      };
    }
  }),
});
