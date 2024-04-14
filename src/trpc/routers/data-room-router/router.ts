import { generatePublicId } from "@/common/id";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { DataRoomSchema } from "./schema";

export const dataRoomRouter = createTRPCRouter({
  save: withAuth.input(DataRoomSchema).mutation(async ({ ctx, input }) => {
    try {
      const { db, session } = ctx;
      const user = session.user;
      const { publicId } = input;

      if (!publicId) {
        const room = await db.dataRoom.create({
          data: {
            name: input.name,
            companyId: user.companyId,
            publicId: generatePublicId(),
          },
        });

        return {
          success: true,
          message: "Successfully created a data room",
          data: room,
        };
      }

      console.log("Trying to save data room");
      console.log({ input });
      return {
        success: true,
        message: "successfully updated company",
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
