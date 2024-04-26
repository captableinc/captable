import { generatePublicId } from "@/common/id";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { type ContactsType } from "@/types/contacts";
import type { Bucket, DataRoom, DataRoomDocument } from "@prisma/client";
import { z } from "zod";
import { DataRoomSchema } from "./schema";

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

      return {
        dataRoom,
        documents,
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

  getContacts: withAuth.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const user = session.user;
    const companyId = user.companyId;
    const contacts = [] as ContactsType;

    const members = await db.member.findMany({
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

    const stakeholders = await db.stakeholder.findMany({
      where: {
        companyId,
      },
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
