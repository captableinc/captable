import { generatePublicId } from "@/common/id";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import type { DataRoom } from "@prisma/client";
import { DataRoomSchema } from "./schema";

export const dataRoomRouter = createTRPCRouter({
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
