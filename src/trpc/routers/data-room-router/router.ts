import { generatePublicId } from "@/common/id";
import { checkMembership } from "@/server/auth";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { type ContactsType } from "@/types/contacts";
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

  getContacts: withAuth.query(async ({ ctx }) => {
    const { db, session } = ctx;

    const contacts = [] as ContactsType;

    const { members, stakeholders } = await db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      const members = await tx.member.findMany({
        where: {
          companyId,
        },

        include: {
          user: {
            select: {
              email: true,
              name: true,
              image: true,
            },
          },
        },
      });

      const stakeholders = await tx.stakeholder.findMany({
        where: {
          companyId,
        },
      });

      return { stakeholders, members };
    });

    (members || []).map((member) =>
      contacts.push({
        id: member.id,
        image: member.user.image!,
        email: member.user.email!,
        value: member.user.email!,
        name: member.user.name!,
        type: "member",
      }),
    );

    (stakeholders || []).map((stakeholder) =>
      contacts.push({
        id: stakeholder.id,
        email: stakeholder.email,
        value: stakeholder.email,
        name: stakeholder.name,
        institutionName: stakeholder.institutionName!,
        type: "stakeholder",
      }),
    );

    return contacts;
  }),
});
